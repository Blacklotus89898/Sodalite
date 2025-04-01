import React, { useState, useEffect, useCallback } from "react";
import { Container } from "./container";

interface FileShareProps {
  websocketUrl: string;
}

interface SharedFile {
  name: string;
  type: string;
  content: string | ArrayBuffer;
}

const FileShare: React.FC<FileShareProps> = ({ websocketUrl }) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [sharedFile, setSharedFile] = useState<SharedFile | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Initialize WebSocket connection
  useEffect(() => {
    const ws = new WebSocket(websocketUrl);
    setSocket(ws);

    ws.onopen = () => {
      setStatus("Connected to WebSocket server");
      setIsConnected(true);
    };

    ws.onmessage = async (event) => {
      try {
        if (event.data instanceof Blob) {
          handleBinaryData(event.data);
        } else {
          handleJsonData(event.data);
        }
      } catch (error) {
        console.error("Error processing received data:", error);
        setStatus("Error processing received data");
      }
    };

    ws.onclose = () => {
      setStatus("WebSocket connection closed");
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setStatus("WebSocket error");
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [websocketUrl]);

  // Handle binary data received from WebSocket
  const handleBinaryData = async (blob: Blob) => {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const fileType = blob.type || "application/pdf";
      const fileURL = URL.createObjectURL(new Blob([arrayBuffer], { type: fileType }));

      setSharedFile({
        name: determineFileName(fileType),
        type: fileType,
        content: fileURL,
      });

      setStatus("Received file");

      // If it's a text file, read and set content
      if (fileType.includes("text")) {
        const text = await blob.text();
        setTextContent(text);
      }
    } catch (error) {
      console.error("Error processing binary data:", error);
      setStatus("Error processing binary data");
    }
  };

  // Determine filename based on file type
  const determineFileName = (fileType: string): string => {
    if (fileType.includes("pdf")) return "ReceivedFile.pdf";
    if (fileType.includes("image")) {
      const extension = fileType.split("/")[1] || "png";
      return `ReceivedImage.${extension}`;
    }
    if (fileType.includes("text")) return "ReceivedText.txt";
    return "ReceivedFile";
  };

  // Handle JSON data received from WebSocket
  const handleJsonData = (data: string) => {
    try {
      console.log("Received data:", data);
      const receivedData = JSON.parse(data);

      setSharedFile({
        name: receivedData.filename || "Unknown",
        type: receivedData.filetype || "application/octet-stream",
        // type: receivedData.filetype || "application/pdf",
        content: receivedData.content,
      });

      setStatus(`Received ${receivedData.filename}`);

      // If it's text content
      if (receivedData.filetype?.includes("text")) {
        setTextContent(receivedData.content);
      }
    } catch (error) {
      console.error("Error parsing JSON data:", error);
      setStatus("Error parsing JSON data");
    }
  };

  // Handle file selection
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Create preview URL
      const localPreviewURL = URL.createObjectURL(selectedFile);
      setPreviewURL(localPreviewURL);

      // Handle text files
      if (selectedFile.type.includes("text")) {
        const reader = new FileReader();
        reader.onload = () => {
          setTextContent(reader.result as string);
        };
        reader.readAsText(selectedFile);
      }
    }
  }, []);

  // Send file via WebSocket
  const handleFileSend = useCallback(() => {
    if (!file || !socket || socket.readyState !== WebSocket.OPEN) {
      setStatus(socket?.readyState !== WebSocket.OPEN ? "WebSocket not connected" : "No file selected");
      return;
    }

    setStatus("Sending file...");

    const reader = new FileReader();

    reader.onload = () => {
      const fileData = reader.result;
      if (fileData instanceof ArrayBuffer) {
        socket.send(fileData);
        setStatus(`File "${file.name}" sent successfully`);
      } else {
        setStatus("Failed to read file as binary data");
      }
    };

    reader.onerror = () => {
      setStatus("Error reading file");
    };

    reader.readAsArrayBuffer(file);
  }, [file, socket]);

  // Cleanup function for URL objects
  useEffect(() => {
    return () => {
      if (previewURL) URL.revokeObjectURL(previewURL);
      if (sharedFile?.content && typeof sharedFile.content === 'string' && sharedFile.content.startsWith('blob:')) {
        URL.revokeObjectURL(sharedFile.content);
      }
    };
  }, [previewURL, sharedFile]);

  // Render file preview based on file type
  const renderFilePreview = (isReceived: boolean, url: string, fileType: string, content?: string) => {
    if (fileType.includes("pdf") && !isReceived) {
      return (
        <iframe
          src={url}
          title="PDF Preview"
          className="w-full h-96 border-none"
        />
      );
    } else if (fileType.includes("image")) {
      return (
        <img
          src={url}
          alt="Image Preview"
          className="max-w-full max-h-96 mx-auto block"
        />
      );
    } else if (fileType.includes("")) {
      return (
        <>
          <img
            src={url}
            alt="Image Preview"
            className="max-w-full max-h-96 mx-auto block"
          />
          <p>
            {content}
          </p>
          <iframe
            src={content}
            title="Iframe Preview"
            className="max-w-full max-h-96 mx-auto block"
          />
          <a
            href={url}
            download={sharedFile?.name}
            className="text-blue-500 underline"
          >
            Download PDF
          </a>
        </>
      );
    } else if (fileType.includes("pdf")) {
      return (
        <>
          <iframe
            src={content}
            title="Image Preview"
            className="max-w-full max-h-96 mx-auto block"
          />
        </>
      );
    } else if (fileType.includes("text")) {
      return (
        <div className="whitespace-pre-wrap text-left p-4 border border-gray-200 rounded bg-gray-50 max-h-96 overflow-auto">
          {content || "Loading text content..."}
        </div>
      );
    }

    return <div className="p-4 text-gray-500">Preview not available for this file type</div>;
  };

  return (
    <Container maxWidth={1200} maxHeight={1000}>
      <div className="p-6 border border-gray-300 rounded-lg max-w-md mx-auto">
        <h3 className="text-xl font-semibold mb-4">File Sharing via WebSocket</h3>

        {/* Connection Status */}
        <div className="mb-4 flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="text-sm">{status}</span>
        </div>

        {/* File Selection */}
        <div className="mb-4">
          <div className="flex mb-2">
            <input
              type="file"
              accept="application/pdf,image/*,text/plain"
              onChange={handleFileChange}
              className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <button
              onClick={handleFileSend}
              disabled={!file || !isConnected}
              className={`ml-2 px-4 py-2 rounded text-white ${!file || !isConnected ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              Send
            </button>
          </div>
          {file && (
            <div className="text-sm text-gray-600">
              Selected: {file.name} ({Math.round(file.size / 1024)} KB)
            </div>
          )}
        </div>

        {/* File Preview Container */}
        {file && previewURL && (
          <div className="mb-6 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">Local Preview</h4>
            <div className="text-sm text-gray-600 mb-2">
              <div>Name: {file.name}</div>
              <div>Type: {file.type}</div>
            </div>
            {renderFilePreview(false, previewURL, file.type, textContent)}
          </div>
        )}

        {/* Received File */}
        {sharedFile && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">Received File</h4>
            <div className="text-sm text-gray-600 mb-2">
              <div>Name: {sharedFile.name}</div>
              <div>Type: {sharedFile.type}</div>
            </div>
            {typeof sharedFile.content === 'string' && renderFilePreview(
              true,
              sharedFile.content,
              sharedFile.type,
              sharedFile.type.includes("text") ? textContent : sharedFile.content as string

            )}
          </div>
        )}
      </div>
    </Container>
  );
};

export default FileShare;