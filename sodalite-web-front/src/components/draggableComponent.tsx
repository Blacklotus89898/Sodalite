import React, { useState, useEffect, ReactNode } from "react";

interface ResizableDraggableComponentProps {
  children: ReactNode; // Allows any child component to be passed
}

const ResizableDraggableComponent: React.FC<ResizableDraggableComponentProps> = ({ children }) => {
  const [position, setPosition] = useState({ left: 100, top: 100 });
  const [size, setSize] = useState({ width: 180, height: 180 });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [resizeOffset, setResizeOffset] = useState({ x: 0, y: 0 });

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (resizing) return;
    setDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleDragEnd = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!dragging) return;
    const newLeft = e.clientX - e.currentTarget.getBoundingClientRect().left - offset.x;
    const newTop = e.clientY - e.currentTarget.getBoundingClientRect().top - offset.y;
    setPosition({ left: newLeft, top: newTop });
  };

  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setResizing(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setResizeOffset({
      x: e.clientX - rect.right,
      y: e.clientY - rect.bottom,
    });
    e.preventDefault();
  };

  const handleResizeEnd = () => {
    setResizing(false);
  };

  useEffect(() => {
    const handleResize = (e: MouseEvent) => {
      if (resizing) {
        const newWidth = e.clientX - (e.target as Element).getBoundingClientRect().left - resizeOffset.x;
        const newHeight = e.clientY - (e.target as Element).getBoundingClientRect().top - resizeOffset.y;
        setSize({
          width: Math.max(newWidth, 50),
          height: Math.max(newHeight, 50),
        });
      }
    };

    if (resizing) {
      document.addEventListener("mousemove", handleResize);
      document.addEventListener("mouseup", handleResizeEnd);
    } else {
      document.removeEventListener("mousemove", handleResize);
      document.removeEventListener("mouseup", handleResizeEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleResize);
      document.removeEventListener("mouseup", handleResizeEnd);
    };
  }, [resizing, resizeOffset.x, resizeOffset.y]);

  return (
    <div
      style={parentContainerStyle}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={{
          ...childStyle,
          left: `${position.left}px`,
          top: `${position.top}px`,
          width: `${size.width}px`,
          height: `${size.height}px`,
        }}
      >
        {children} {/* Render child component here */}
        <div
          onMouseDown={handleResizeStart}
          style={resizeHandleStyle}
          aria-label="Resize"
        />
      </div>
    </div>
  );
};

export default ResizableDraggableComponent;

// Dark theme container styling
import { CSSProperties } from "react";

const parentContainerStyle: CSSProperties = {
  position: "relative",
  width: "90%",
  height: "500px",
  border: "2px solid #ccc",
  backgroundColor: "#2d2d2d", // Dark background
  overflow: "hidden",
  borderRadius: "8px",
};
const childStyle: CSSProperties = {
// Dark theme child component styling

  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#3498db", // Blue color for the child box
  color: "white",
  fontSize: "20px",
  fontWeight: "bold",
  borderRadius: "8px",
  cursor: "grabbing",
  userSelect: "none",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  transition: "left 0.3s ease, top 0.3s ease",
};
const resizeHandleStyle: CSSProperties = {
// Resize handle styling
  position: "absolute",
  bottom: "-10px",
  right: "-10px",
  width: "20px",
  height: "20px",
  backgroundColor: "#e74c3c", // Red color for resize handle
  cursor: "se-resize",
  borderRadius: "50%",
  border: "2px solid white",
  boxSizing: "border-box",
};
