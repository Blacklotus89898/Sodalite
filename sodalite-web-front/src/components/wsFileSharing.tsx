import React, { useState, useEffect } from "react";

interface FileShareProps {
    websocketUrl: string;
}

const FileShare: React.FC<FileShareProps> = ({ websocketUrl }) => {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<string>("");
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [sharedFile, setSharedFile] = useState<{ name: string; type: string; content: string | ArrayBuffer } | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(null);

    useEffect(() => {
        const ws = new WebSocket(websocketUrl);
        setSocket(ws);

        ws.onopen = () => {
            setStatus("Connected to WebSocket server");
        };

        ws.onmessage = async (event) => {
            if (event.data instanceof Blob) {
                // Handle binary data
                const blob = event.data;
                const arrayBuffer = await blob.arrayBuffer();
                const fileType = blob.type || "application/pdf"; // Default to PDF
                const fileURL = URL.createObjectURL(new Blob([arrayBuffer], { type: fileType }));

                setSharedFile({
                    name: "ReceivedFile.pdf",
                    type: fileType,
                    content: fileURL,
                });

                setStatus("Received file");
                return;
            }

            try {
                const receivedData = JSON.parse(event.data);
                setSharedFile({
                    name: receivedData.filename,
                    type: receivedData.filetype,
                    content: receivedData.content,
                });
            } catch (error) {
                console.error("Error parsing received file:", error);
                setStatus("Error parsing file");
            }
        };

        ws.onclose = () => {
            setStatus("WebSocket connection closed");
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            setStatus("WebSocket error");
        };

        return () => {
            ws.close();
        };
    }, [websocketUrl]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);

            // Create local preview for the file
            const reader = new FileReader();
            reader.onload = () => {
                const previewFileURL = reader.result as string;
                setPreviewURL(previewFileURL); // Set the preview URL
            };
            reader.readAsDataURL(selectedFile); // Read file as DataURL for image/pdf preview
        }
    };

    const handleFileSend = () => {
        if (!file || !socket || socket.readyState !== WebSocket.OPEN) {
            setStatus("No file selected or WebSocket not ready");
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            const fileData = reader.result;
            if (fileData instanceof ArrayBuffer) {
                socket.send(fileData);
                setStatus(`File "${file.name}" sent successfully`);
            } else {
                setStatus("Failed to read file");
            }
        };

        reader.onerror = () => {
            setStatus("Error reading file");
        };

        reader.readAsArrayBuffer(file);
    };

    return (
        <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", width: "400px" }}>
            <h3>PDF File Sharing via WebSocket</h3>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <button onClick={handleFileSend} style={{ marginLeft: "10px" }}>
                Send File
            </button>
            <p>Status: {status}</p>

            {/* Local Preview Before Sending */}
            {previewURL && (
                <div style={{ marginTop: "20px" }}>
                    <h4>Local Preview:</h4>
                    {file && file.type === "application/pdf" ? (
                        <iframe
                            src={previewURL}
                            title="Local Preview"
                            style={{ width: "100%", height: "400px", border: "none" }}
                        ></iframe>
                    ) : (
                        <p>Preview not available for this file type.</p>
                    )}
                </div>
            )}

            {/* Preview the received file */}
            {sharedFile && (
                <div style={{ marginTop: "20px" }}>
                    <h4>Received File:</h4>
                    <p><strong>Name:</strong> {sharedFile.name}</p>
                    <p><strong>Type:</strong> {sharedFile.type}</p>

                    {sharedFile.type === "application/pdf" ? (
                        <iframe
                            src={sharedFile.content as string}
                            title={sharedFile.name}
                            style={{ width: "100%", height: "400px", border: "none" }}
                        ></iframe>
                    ) : (
                        <p>Preview not available for this file type.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default FileShare;
