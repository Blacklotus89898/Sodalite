import React, { useState, useEffect, ReactNode, CSSProperties } from "react";

interface ResizableDraggableComponentProps {
  children: ReactNode;
}

const ResizableDraggableComponent: React.FC<ResizableDraggableComponentProps> = ({ children }) => {
  const [position, setPosition] = useState({ left: 100, top: 100 });
  const [size, setSize] = useState({ width: 180, height: 180 });

  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);

  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
  const [initialSize, setInitialSize] = useState({ width: 180, height: 180 });

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (resizing) return; // Don't allow dragging if resizing
    setDragging(true);
    setDragOffset({
      x: e.clientX - position.left,
      y: e.clientY - position.top,
    });
  };

  const handleDragMove = async (e: MouseEvent) => {
    // await delay(50); // Add a delay of 100ms

    if (!dragging) return;
    setPosition({
      left: e.clientX - dragOffset.x,
      top: e.clientY - dragOffset.y,
    });
  };

  const handleDragEnd = () => {
    setDragging(false);
  };

  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setResizing(true);
    setResizeStart({ x: e.clientX, y: e.clientY });
    setInitialSize({ width: size.width, height: size.height });
    e.stopPropagation(); // Prevent dragging from starting
    e.preventDefault();
  };

  const handleResizeMove = async (e: MouseEvent) => {

    // await delay(200); // Add a delay of 100ms
    if (!resizing) return;

    const deltaX = e.clientX - resizeStart.x;
    const deltaY = e.clientY - resizeStart.y;

    setSize({
      width: Math.max(50, initialSize.width + deltaX),
      height: Math.max(50, initialSize.height + deltaY),
    });
  };

  const handleResizeEnd = () => {
    setResizing(false);
  };

  // Global event listeners
  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", handleDragMove);
      document.addEventListener("mouseup", handleDragEnd);
    } else {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
    };
  }, [dragging]);

  useEffect(() => {
    if (resizing) {
      document.addEventListener("mousemove", handleResizeMove);
      document.addEventListener("mouseup", handleResizeEnd);
    } else {
      document.removeEventListener("mousemove", handleResizeMove);
      document.removeEventListener("mouseup", handleResizeEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleResizeMove);
      document.removeEventListener("mouseup", handleResizeEnd);
    };
  }, [resizing]);

  return (
    <div style={parentContainerStyle}>
      <div
        style={{
          ...childStyle,
          left: `${position.left}px`,
          top: `${position.top}px`,
          width: `${size.width}px`,
          height: `${size.height}px`,
        }}
        onMouseDown={handleDragStart}
      >
        {children}
        <div
          style={resizeHandleStyle}
          onMouseDown={handleResizeStart}
          aria-label="Resize"
        />
      </div>
    </div>
  );
};

// Styles
const parentContainerStyle: CSSProperties = {
  position: "relative",
  width: "90%",
  height: "500px",
  border: "2px solid #ccc",
  backgroundColor: "#2d2d2d",
  overflow: "hidden",
  borderRadius: "8px",
};

const childStyle: CSSProperties = {
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#3498db",
  color: "white",
  fontSize: "20px",
  fontWeight: "bold",
  borderRadius: "8px",
  cursor: "move",
  userSelect: "none",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

const resizeHandleStyle: CSSProperties = {
  position: "absolute",
  bottom: "0",
  right: "0",
  width: "20px",
  height: "20px",
  backgroundColor: "#e74c3c",
  cursor: "se-resize",
  borderRadius: "50%",
  border: "2px solid white",
  boxSizing: "border-box",
};

export default ResizableDraggableComponent;
