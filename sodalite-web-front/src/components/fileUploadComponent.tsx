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
    const [width, setWidth] = useState(400); // Default width

    const containerRef = useRef<HTMLDivElement>(null);

    // Resize observer to track container size changes
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver(([entry]) => {
            setWidth(entry.contentRect.width);
        });

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, []);

    // Font size scaling
    const baseFontSize = Math.min(24, Math.max(12, width * 0.025));

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

            const data = await response.json();
            setUploadedFile(data.filename);
            fetchFiles();
        } catch (error) {
            console.error("File upload error:", error);
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
        fetchFiles();
    }, []);

    // Dark mode check
    const isDarkMode = theme === 'dark';

    // Styles with dynamic font sizes
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

    return (
        <Container>
            <div ref={containerRef} style={containerStyle}>
                <h1 style={{ fontSize: baseFontSize * 1.5, marginBottom: '20px' }}>Text Editor Component</h1>
                <input type="file" onChange={handleFileChange} style={inputStyle} />
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
                    style={textareaStyle}
                />
                <button onClick={handleFileUpload} style={buttonStyle}>Upload</button>

                {uploadedFile && (
                    <div style={{ marginTop: '20px', color: '#ddd' }}>
                        <h2>Uploaded File</h2>
                        <p>
                            <a
                                href={`http://localhost:8081/uploads/${uploadedFile}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: chroma, textDecoration: 'none' }}
                            >
                                {uploadedFile}
                            </a>
                        </p>
                    </div>
                )}

                <div style={{ marginTop: '20px', color: '#ddd' }}>
                    <h2>Uploaded Files</h2>
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
            </div>
        </Container>
    );
};

export default FileUploadComponent;
