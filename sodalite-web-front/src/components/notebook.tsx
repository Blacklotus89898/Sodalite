import React, { useState, useRef, useEffect } from "react";
import { useTheme, useServer } from "../stores/hooks";
import { Container } from "./container";
import { FileUploadService } from "../services/fileuploadService";

const PersistentNotebookLayout: React.FC = () => {

  interface Page {
    id: number;
    title: string;
    content: string;
  }


  const { address } = useServer();
  const [fileUploadService, setFileUploadService] = useState(new FileUploadService(address['fileServer']));

  useEffect(() => {
    setFileUploadService(new FileUploadService(address['fileServer']));
  }, [address]);



  const { theme, chroma } = useTheme();
  const [pages, setPages] = useState<Page[]>([
    { id: 1, title: "Page 1", content: "" },
  ]);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [editingTitle, setEditingTitle] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState(false); // State for collapsing sidebar
  const [sidebarWidth, setSidebarWidth] = useState(250); // Initial sidebar width (in px)

  const sidebarRef = useRef<HTMLDivElement>(null);
  const isDarkMode = theme === "dark";

  const containerStyle: React.CSSProperties = {
    display: "flex",
    height: "100vh",
    backgroundColor: isDarkMode ? "#1a1a1a" : "white",
    color: isDarkMode ? "white" : "black",
    fontSize: "16px",
  };

  const sidebarStyle: React.CSSProperties = {
    width: `${sidebarWidth}px`,
    padding: "16px",
    backgroundColor: isDarkMode ? "#333" : "#ddd",
    boxShadow: isDarkMode ? "2px 0 5px rgba(0, 0, 0, 0.3)" : "2px 0 5px rgba(200, 200, 200, 0.5)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    transition: "width 0.3s ease", // Smooth transition for resizing
  };

  const pageStyle: React.CSSProperties = {
    width: `calc(100% - ${sidebarWidth}px)`, // Adjust page width based on sidebar width
    padding: "16px",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "10px",
    backgroundColor: chroma,
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s ease",
  };

  const toggleSidebar = () => setCollapsed(!collapsed);

  const addPage = () => {
    const newPage = {
      id: pages.length + 1,
      title: `Page ${pages.length + 1}`,
      content: "",
    };
    setPages([...pages, newPage]);
    setSelectedPage(newPage.id);
  };

  const deletePage = (id: number) => {
    if (pages.length === 1) return;
    const newPages = pages.filter((page) => page.id !== id);
    setPages(newPages);
    setSelectedPage(newPages[0]?.id || 1);
  };

  const updateContent = (id: number, newContent: string) => {
    setPages(
      pages.map((page) =>
        page.id === id ? { ...page, content: newContent } : page
      )
    );
  };

  const updateTitle = (id: number, newTitle: string) => {
    setPages(
      pages.map((page) =>
        page.id === id ? { ...page, title: newTitle } : page
      )
    );
  };

  // Resizing Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(100, startWidth + moveEvent.clientX - startX); // Minimum width of 100px
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };



  const handleFileUpload = async (id: number) => {
    const page = pages.find((page: Page) => page.id === id);
    if (!page) return;
    const filename = page.title;
    const fileContent = page.content;
    if (!fileContent) {
      alert("Please enter some content for the file.");
      return;
    }

    const blob = new Blob([fileContent], { type: "text/plain" });

    fileUploadService.uploadFile(blob, filename)
      .then(() => {
          alert("File uploaded successfully" + filename);
      })
      .catch((error) => {
        console.error("File upload error:", error);
        alert("Failed to upload the file.");
      });
  };

  return (
    <Container maxWidth={1200} maxHeight={1200}>
      <div style={containerStyle}>
        {/* Sidebar */}
        <div ref={sidebarRef} style={sidebarStyle}>
          {/* Collapsible Toggle Button */}
          <button
            onClick={toggleSidebar}
            style={{
              padding: "10px",
              backgroundColor: isDarkMode ? "#444" : "#eee",
              color: isDarkMode ? "white" : "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginBottom: "16px",
            }}
          >
            {collapsed ? "Expand" : "Collapse"}
          </button>

          <h2
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              marginBottom: "16px",
              display: collapsed ? "none" : "block",
            }}
          >
            Notebook
          </h2>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {pages.map((page) => (
              <li
                key={page.id}
                style={{
                  padding: "10px",
                  backgroundColor: selectedPage === page.id ? "#555" : "inherit",
                  borderRadius: "5px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: collapsed ? "center" : "space-between",
                  alignItems: "center",
                  transition: "background-color 0.3s ease",
                }}
                onClick={() => setSelectedPage(page.id)}
              >
                {editingTitle === page.id ? (
                  <input
                    style={{
                      backgroundColor: "#555",
                      color: "white",
                      border: "none",
                      padding: "4px",
                      borderRadius: "4px",
                    }}
                    value={page.title}
                    onChange={(e) => updateTitle(page.id, e.target.value)}
                    onBlur={() => setEditingTitle(null)}
                    autoFocus
                  />
                ) : (
                  <span
                    onDoubleClick={() => setEditingTitle(page.id)}
                    style={{
                      color: selectedPage === page.id ? chroma : "inherit",
                      fontWeight: selectedPage === page.id ? "bold" : "normal",
                      display: collapsed ? "none" : "inline",
                    }}
                  >
                    {collapsed ? `#${page.id}` : page.title}
                  </span>
                )}
                <button onClick={() => handleFileUpload(page.id)} style={buttonStyle}>Upload to Cloud</button>
                <button
                  // style={{
                  //   marginLeft: "8px",
                  //   color: "red",
                  //   background: "none",
                  //   border: "none",
                  //   cursor: "pointer",
                  //   fontSize: "16px",
                  // }}
                  style={buttonStyle}
                  onClick={() => deletePage(page.id)}
                >
                  Delete
                </button>

              </li>
            ))}
          </ul>
          <button style={buttonStyle} onClick={addPage}>
            Add Page
          </button>
        </div>

        {/* Resizer between Sidebar and Main Content */}
        <div
          onMouseDown={handleMouseDown}
          style={{
            width: "5px",
            cursor: "ew-resize",
            backgroundColor: isDarkMode ? "#444" : "#ddd",
            // position: "absolute",
            top: "0",
            bottom: "0",
            left: `${sidebarWidth + 40}px`, // Positioning resizer correctly
          }}
        />

        {/* Main Content Area */}
        <div style={pageStyle}>
          {pages.map(
            (page) =>
              selectedPage === page.id && (
                <textarea
                  key={page.id}
                  style={{
                    width: "100%",
                    height: "100%",
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    backgroundColor: isDarkMode ? "#444" : "#f4f4f4",
                    color: isDarkMode ? "white" : "black",
                    fontSize: "14px",
                  }}
                  value={page.content}
                  onChange={(e) => updateContent(page.id, e.target.value)}
                ></textarea>
              )
          )}
        </div>
      </div>
    </Container>
  );
};


export default PersistentNotebookLayout;
