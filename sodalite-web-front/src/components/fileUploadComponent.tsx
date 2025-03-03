import { useState, useEffect, ChangeEvent } from "react";
import { FileUploadService } from "../services/fileuploadService"; // Make sure the path is correct
import { useTheme } from '../stores/hooks'; // Assuming the theme hook is available
import { Container } from "./container";

const fileUploadService = new FileUploadService("http://localhost:8081");

const FileUploadComponent = () => {
    const { theme, chroma } = useTheme();
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

    // Check if the theme is dark mode
    const isDarkMode = theme === 'dark';

    // Calculate scalable font sizes based on container width
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const baseFontSize = Math.max(12, width * 0.002); // Example: 2% of container width

    const containerStyle: React.CSSProperties = {
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        color: isDarkMode ? 'white' : 'black',
        borderRadius: '10px',
        padding: '20px',
        maxWidth: '800px',
        margin: 'auto',
        boxShadow: isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        fontSize: baseFontSize,
    };

    const inputStyle: React.CSSProperties = {
        padding: '10px',
        marginBottom: '15px',
        width: '100%',
        backgroundColor: isDarkMode ? '#555' : '#f0f0f0',
        color: isDarkMode ? 'white' : 'black',
        border: `1px solid ${isDarkMode ? '#444' : '#ddd'}`,
        borderRadius: '5px',
        fontSize: baseFontSize,
        outline: 'none',
        transition: 'border 0.3s ease',
    };

    const buttonStyle: React.CSSProperties = {
        padding: '10px 20px',
        backgroundColor: chroma,
        color: isDarkMode ? 'black' : 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: baseFontSize,
        cursor: 'pointer',
        transition: 'background 0.3s ease-in-out, color 0.3s ease-in-out',
    };

    const textareaStyle: React.CSSProperties = {
        padding: '10px',
        marginBottom: '20px',
        width: '100%',
        height: '150px',
        backgroundColor: isDarkMode ? '#555' : '#f0f0f0',
        color: isDarkMode ? 'white' : 'black',
        border: `1px solid ${isDarkMode ? '#444' : '#ddd'}`,
        borderRadius: '5px',
        fontSize: baseFontSize,
        resize: 'none',
        boxSizing: 'border-box',
    };

    const fileInfoStyle: React.CSSProperties = {
        marginTop: '20px',
        color: '#ddd',
    };

    const linkStyle: React.CSSProperties = {
        color: chroma,
        textDecoration: 'none',
    };

    const fileListStyle: React.CSSProperties = {
        marginTop: '20px',
        color: '#ddd',
    };

    const fileListItemStyle: React.CSSProperties = {
        listStyleType: 'none',
        padding: '0',
    };

    const listItemStyle: React.CSSProperties = {
        marginBottom: '10px',
    };

    return (
        <Container>

            <div style={containerStyle}>
                <h1 style={{ fontSize: baseFontSize * 1.5, marginBottom: '20px' }}>Text Editor Component</h1>
                <input
                    type="file"
                    onChange={handleFileChange}
                    style={inputStyle}
                />
                <button onClick={() => setFile(null)} style={buttonStyle}>New File</button>
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
        </Container>
    );
};

export default FileUploadComponent;
