import React, { useState, useEffect } from "react";

const ResizableDraggableComponent = () => {
  const [position, setPosition] = useState({ left: 100, top: 100 }); // Initial position of the child
  const [size, setSize] = useState({ width: 180, height: 180 }); // Initial size of the child
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // Offset for dragging
  const [resizeOffset, setResizeOffset] = useState({ x: 0, y: 0 }); // Offset for resizing

  // Handle dragging
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleDragEnd = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const newLeft = e.clientX - e.currentTarget.getBoundingClientRect().left - offset.x;
    const newTop = e.clientY - e.currentTarget.getBoundingClientRect().top - offset.y;
    setPosition({ left: newLeft, top: newTop });
  };

  // Handle resizing
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
        const newWidth = e.clientX - position.left - resizeOffset.x;
        const newHeight = e.clientY - position.top - resizeOffset.y;
        setSize({
          width: Math.max(newWidth, 50), // Minimum width 50px
          height: Math.max(newHeight, 50), // Minimum height 50px
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
  }, [resizing, position.left, position.top, resizeOffset.x, resizeOffset.y]);

  return (
    <div
      style={{
        position: "relative",
        width: "500px", // Fixed width for the parent container
        height: "500px", // Fixed height for the parent container
        border: "2px solid #ccc",
        backgroundColor: "#f0f0f0",
        overflow: "hidden",
      }}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()} // Allow dropping by preventing default behavior
    >
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={{
          position: "absolute",
          left: `${position.left}px`,
          top: `${position.top}px`,
          width: `${size.width}px`, // Resizable width for the child component
          height: `${size.height}px`, // Resizable height for the child component
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#3498db",
          color: "white",
          fontSize: "20px",
          fontWeight: "bold",
          borderRadius: "8px",
          cursor: dragging ? "grabbing" : "grab",
          userSelect: "none",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          transition: dragging ? "none" : "left 0.5s ease, top 0.5s ease, width 0.5s ease, height 0.5s ease", // Smooth transition for release
        }}
      >
        Drag me
        {/* Resize handle (inside the child component) */}
        <div
          onMouseDown={handleResizeStart}
          style={{
            position: "absolute",
            bottom: "-10px", // Position handle inside the child box, with some margin
            right: "-10px", // Position handle inside the child box, with some margin
            width: "20px",
            height: "20px",
            backgroundColor: "#e74c3c",
            cursor: "se-resize",
            borderRadius: "50%",
            border: "2px solid white",
            boxSizing: "border-box", // Prevent border from affecting size
          }}
          aria-label="Resize"
        />
      </div>
    </div>
  );
};

export default ResizableDraggableComponent;
