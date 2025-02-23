import React, { useState, useEffect, ChangeEvent } from "react";
import { FileUploadService } from "../services/fileuploadService"; // Make sure the path is correct

const fileUploadService = new FileUploadService("http://localhost:8081");

const FileUploadComponent = () => {
    const [file, setFile] = useState<File | null>(null);
    const [fileContent, setFileContent] = useState<string>("");
    const [filename, setFilename] = useState<string>("newfile.txt");
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [files, setFiles] = useState<string[]>([]);

    // Handle file selection
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);

            const reader = new FileReader();
            reader.onload = (event) => {
                setFileContent(event.target?.result as string);
                setFilename(selectedFile.name); // Set default filename
            };
            reader.readAsText(selectedFile);
        }
    };

    // Handle filename change
    const handleFilenameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilename(e.target.value);
    };

    // Handle file upload
    const handleFileUpload = async () => {
        if (!file) return;

        try {
            const blob = new Blob([fileContent], { type: "text/plain" });
            const formData = new FormData();
            formData.append("file", blob, filename);

            const response = await fetch("http://localhost:8081/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}: ${await response.text()}`);
            }

            const data = await response.json(); // Now correctly parses JSON
            setUploadedFile(data.filename); // Store filename for display
            fetchFiles(); // Refresh file list
        } catch (error) {
            console.error("File upload error:", error);
        }
    };

    // Fetch list of uploaded files
    const fetchFiles = async () => {
        try {
            const fileList = await fileUploadService.getFileList();
            setFiles(fileList);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    // Fetch files on component mount
    useEffect(() => {
        fetchFiles();
    }, []);

    return (
        <div>
            <h1>Text Editor Component</h1>
            <input type="file" onChange={handleFileChange} />
            <input
                type="text"
                value={filename}
                onChange={handleFilenameChange}
                placeholder="Enter filename"
            />
            <textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                rows={10}
                cols={50}
            />
            <button onClick={handleFileUpload}>Upload</button>

            {uploadedFile && (
                <div>
                    <h2>Uploaded File</h2>
                    <p>
                        <a href={`http://localhost:8081/uploads/${uploadedFile}`} target="_blank" rel="noopener noreferrer">
                            {uploadedFile}
                        </a>
                    </p>
                </div>
            )}

            <div>
                <h2>Uploaded Files</h2>
                <ul>
                    {files.map((file, index) => (
                        <li key={index}>
                            <a href={`http://localhost:8081/uploads/${file}`} target="_blank" rel="noopener noreferrer">
                                {file}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default FileUploadComponent;
