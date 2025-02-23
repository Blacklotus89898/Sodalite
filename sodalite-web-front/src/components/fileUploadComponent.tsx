import { useState, useEffect, ChangeEvent } from "react";
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
        <div style={containerStyle}>
            <h1 style={headerStyle}>Text Editor Component</h1>
            <input
                type="file"
                onChange={handleFileChange}
                style={inputStyle}
            />
            <button onClick={() => handleFileChange}>New File</button>
            <input
                type="text"
                value={filename}
                onChange={handleFilenameChange}
                placeholder="Enter filename"
                style={inputStyle}
            />
            <textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                rows={10}
                cols={50}
                style={textareaStyle}
            />
            <button onClick={handleFileUpload} style={buttonStyle}>Upload</button>

            {uploadedFile && (
                <div style={fileInfoStyle}>
                    <h2>Uploaded File</h2>
                    <p>
                        <a href={`http://localhost:8081/uploads/${uploadedFile}`} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                            {uploadedFile}
                        </a>
                    </p>
                </div>
            )}

            <div style={fileListStyle}>
                <h2>Uploaded Files</h2>
                <ul style={fileListItemStyle}>
                    {files.map((file, index) => (
                        <li key={index} style={listItemStyle}>
                            <a href={`http://localhost:8081/uploads/${file}`} target="_blank" rel="noopener noreferrer" style={linkStyle}>
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

// Dark theme styling
const containerStyle = {
    padding: '20px',
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: '10px',
    maxWidth: '800px',
    margin: 'auto',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    textAlign: 'center' as const,
};

const headerStyle = {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#fff',
    fontWeight: 'bold',
};

const inputStyle = {
    padding: '10px',
    marginBottom: '15px',
    width: '100%',
    backgroundColor: '#555',
    color: '#fff',
    border: '1px solid #444',
    borderRadius: '5px',
    fontSize: '16px',
    boxSizing: 'border-box' as const,
};

const textareaStyle = {
    padding: '10px',
    marginBottom: '20px',
    width: '100%',
    height: '150px',
    backgroundColor: '#555',
    color: '#fff',
    border: '1px solid #444',
    borderRadius: '5px',
    fontSize: '16px',
    resize: 'none' as const,
    boxSizing: 'border-box' as const,
};

const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
};

const fileInfoStyle = {
    marginTop: '20px',
    color: '#ddd',
};

const linkStyle = {
    color: '#3498db',
    textDecoration: 'none',
};

const fileListStyle = {
    marginTop: '20px',
    color: '#ddd',
};

const fileListItemStyle = {
    listStyleType: 'none',
    padding: '0',
};

const listItemStyle = {
    marginBottom: '10px',
};
