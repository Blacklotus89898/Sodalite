import React, { useState, useEffect, ChangeEvent } from "react";

interface FileUploadComponentProps {
  group?: string;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({ group }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [files, setFiles] = useState([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    if (group) {
      formData.append("group", group);
    }

    try {
      const response = await fetch("http://localhost:8081/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.text();
      setUploadedFile(data);
      fetchFiles(); // Refresh the file list after upload
    } catch (error) {
      console.error("File upload error:", error);
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await fetch("http://localhost:8081/files");
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div>
      <h1>File Upload</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
      {uploadedFile && (
        <div>
          <h2>Uploaded File</h2>
          <p dangerouslySetInnerHTML={{ __html: uploadedFile }}></p>
        </div>
      )}
      <div>
        <h2>Uploaded Files</h2>
        <ul>
          {files.map((file, index) => (
            <li key={index}>
              <a href={`http://localhost:8081/uploads/${file}`}>{file}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FileUploadComponent;
