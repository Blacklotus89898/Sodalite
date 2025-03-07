import React, { useState } from "react";
import { useTheme } from "../stores/hooks";

const Notebook = () => {
  const { theme, chroma } = useTheme();
  const [pages, setPages] = useState<{ id: number; title: string; content: string }[]>([
    { id: 1, title: "Page 1", content: "" }
  ]);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [editingTitle, setEditingTitle] = useState<number | null>(null);

  const isDarkMode = theme === "dark";

  const containerStyle: React.CSSProperties = {
    display: "flex",
    height: "100vh",
    backgroundColor: isDarkMode ? "#1a1a1a" : "white",
    color: isDarkMode ? "white" : "black"
  };

  const sidebarStyle: React.CSSProperties = {
    width: "25%",
    padding: "16px",
    backgroundColor: isDarkMode ? "#333" : "#ddd"
  };

  const pageStyle: React.CSSProperties = {
    width: "75%",
    padding: "16px"
  };

  const buttonStyle: React.CSSProperties = {
    marginTop: "16px",
    padding: "8px",
    backgroundColor: chroma,
    width: "100%",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  };

  const addPage = () => {
    const newPage = {
      id: pages.length + 1,
      title: `Page ${pages.length + 1}`,
      content: ""
    };
    setPages([...pages, newPage]);
    setSelectedPage(newPage.id);
  };

  const deletePage = (id: number) => {
    if (pages.length === 1) return;
    const newPages = pages.filter(page => page.id !== id);
    setPages(newPages);
    setSelectedPage(newPages[0]?.id || 1);
  };

  const updateContent = (id: number, newContent: string) => {
    setPages(pages.map(page => (page.id === id ? { ...page, content: newContent } : page)));
  };

  const updateTitle = (id: number, newTitle: string) => {
    setPages(pages.map(page => (page.id === id ? { ...page, title: newTitle } : page)));
  };

  return (
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>Notebook</h2>
        <ul>
          {pages.map(page => (
            <li key={page.id} style={{ padding: "8px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: selectedPage === page.id ? "#666" : "inherit" }}
                onClick={() => setSelectedPage(page.id)}>
              {editingTitle === page.id ? (
                <input
                  style={{ backgroundColor: "#555", color: "white", border: "none", padding: "4px" }}
                  value={page.title}
                  onChange={(e) => updateTitle(page.id, e.target.value)}
                  onBlur={() => setEditingTitle(null)}
                  autoFocus
                />
              ) : (
                <span onDoubleClick={() => setEditingTitle(page.id)}>{page.title}</span>
              )}
              <button style={{ marginLeft: "8px", color: "red", background: "none", border: "none", cursor: "pointer" }} onClick={() => deletePage(page.id)}>x</button>
            </li>
          ))}
        </ul>
        <button style={buttonStyle} onClick={addPage}>Add Page</button>
      </div>
      <div style={pageStyle}>
        {pages.map(page => (
          selectedPage === page.id && (
            <textarea style={{ width: "100%", height: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: "#f0f0f0" }} key={page.id}
                      value={page.content} 
                      onChange={(e) => updateContent(page.id, e.target.value)}>
            </textarea>
          )
        ))}
      </div>
    </div>
  );
};

export default Notebook;
