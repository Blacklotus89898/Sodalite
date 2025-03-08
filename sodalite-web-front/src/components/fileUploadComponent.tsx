import { useState, useEffect, useRef, ChangeEvent } from "react";
import { FileUploadService } from "../services/fileuploadService";
import { useTheme } from '../stores/hooks';
import { Container } from "./container";

const fileUploadService = new FileUploadService("http://localhost:8081");

const FileUploadComponent = () => {
    const { theme, chroma } = useTheme();
    const [file, setFile] = useState<File | null>(null);
    const [fileContent, setFileContent] = useState<string>(""); 
    const [filename, setFilename] = useState<string>("newfile.txt");
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [files, setFiles] = useState<string[]>([]);

    const containerRef = useRef<HTMLDivElement>(null);

    // Font size scaling
    const baseFontSize = 16; // Adjusted for more predictable scaling

    // File selection handler
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);

            const reader = new FileReader();
            reader.onload = (event) => {
                setFileContent(event.target?.result as string);
                setFilename(selectedFile.name);
            };
            reader.readAsText(selectedFile);
        }
    };

    const handleFilenameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilename(e.target.value);
    };

    // File upload handler
    const handleFileUpload = async () => {
        if (!fileContent) {
            alert("Please enter some content for the file.");
            return;
        }

        const blob = new Blob([fileContent], { type: "text/plain" });
        const formData = new FormData();
        formData.append("file", blob, filename);

        try {
            const response = await fetch("http://localhost:8081/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}: ${await response.text()}`);
            }

            const data = await response.json();
            setUploadedFile(data.filename);
            fetchFiles();  // Refresh the list of uploaded files
        } catch (error) {
            console.error("File upload error:", error);
            alert("Failed to upload the file.");
        }
    };

    // Fetch uploaded files
    const fetchFiles = async () => {
        try {
            const fileList = await fileUploadService.getFileList();
            setFiles(fileList);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    useEffect(() => {
        fetchFiles();  // Fetch files on component mount
    }, []);

    // Dark mode check
    const isDarkMode = theme === 'dark';

    // Styles with dynamic font sizes
    const containerStyle: React.CSSProperties = {
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        color: isDarkMode ? 'white' : 'black',
        borderRadius: '10px',
        padding: '20px',
        maxWidth: '1000px',
        minHeight: '600px', // Ensure enough space
        margin: 'auto',
        boxShadow: isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'row', // Flexbox for horizontal layout
        flex: 1, // Allow container to grow
    };

    const sidebarStyle: React.CSSProperties = {
        width: '250px', // Fixed sidebar width
        paddingRight: '20px',
        borderRight: `1px solid ${isDarkMode ? '#444' : '#ddd'}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        height: '100%', // Ensure sidebar takes full height
        flexShrink: 0, // Sidebar won't shrink
    };

    const contentStyle: React.CSSProperties = {
        flex: 1, // Take up the remaining space
        paddingLeft: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        flexGrow: 1, // Allow content to grow and take available vertical space
    };

    const inputStyle: React.CSSProperties = {
        padding: '10px 0px',
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
        marginBottom: '15px',
    };

    const textareaStyle: React.CSSProperties = {
        padding: '10px',
        marginBottom: '20px',
        width: '100%',
        backgroundColor: isDarkMode ? '#555' : '#f0f0f0',
        color: isDarkMode ? 'white' : 'black',
        border: `1px solid ${isDarkMode ? '#444' : '#ddd'}`,
        borderRadius: '5px',
        fontSize: baseFontSize,
        resize: 'vertical',
        boxSizing: 'border-box',
        flex: 1, // Makes textarea fill the remaining vertical space
        height: '100%', // Ensure textarea grows with parent
    };

    return (
        <Container maxWidth={1200} maxHeight={800}>
            <div ref={containerRef} style={containerStyle}>
                {/* Sidebar with file controls */}
                <div style={sidebarStyle}>
                    <h2 style={{ fontSize: baseFontSize * 1.2, marginBottom: '20px' }}>File Controls</h2>
                    <input type="file" onChange={handleFileChange} style={inputStyle}
                        onMouseOver={(e) => e.currentTarget.style.border = `1px solid ${chroma}`}
                        onMouseOut={(e) => e.currentTarget.style.border = `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'}`} />
                    <button onClick={() => setFile(null)} style={buttonStyle}>New File</button>
                    <h3>Uploaded Files</h3>
                    <ul style={{ listStyleType: 'none', padding: '0' }}>
                        {files.map((file, index) => (
                            <li key={index} style={{ marginBottom: '10px' }}>
                                <a
                                    href={`http://localhost:8081/uploads/${file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: chroma, textDecoration: 'none' }}
                                >
                                    {file}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right side content */}
                <div style={contentStyle}>
                    <h1 style={{ fontSize: baseFontSize * 1.5, marginBottom: '20px' }}>Text Editor</h1>
                   
                    <input
                        type="text"
                        value={filename}
                        onChange={handleFilenameChange}
                        placeholder="Enter filename"
                        style={inputStyle}
                        onMouseOver={(e) => e.currentTarget.style.border = `1px solid ${chroma}`}
                        onMouseOut={(e) => e.currentTarget.style.border = `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'}`} />
                    <button onClick={handleFileUpload} style={buttonStyle}>Upload</button>
                    <textarea
                        value={fileContent}
                        onChange={(e) => setFileContent(e.target.value)}
                        style={textareaStyle}
                        onMouseOver={(e) => e.currentTarget.style.border = `1px solid ${chroma}`}
                        onMouseOut={(e) => e.currentTarget.style.border = `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'}`} />
                </div>
            </div>
        </Container>
    );
};

export default FileUploadComponent;
