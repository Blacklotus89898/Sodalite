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
        if (resizing) return; // Disable dragging if resizing
        setDragging(true);
        const rect = e.currentTarget.getBoundingClientRect();
        setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleDragEnd = () => {
        setDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!dragging) return; // Prevent updating position if not dragging
        const newLeft = e.clientX - e.currentTarget.getBoundingClientRect().left - offset.x;
        const newTop = e.clientY - e.currentTarget.getBoundingClientRect().top - offset.y;
        setPosition({ left: newLeft, top: newTop });
    };

    // Handle resizing
    const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>) => {
        setResizing(true);
        const rect = e.currentTarget.getBoundingClientRect();
        // Calculate the offset relative to the box's bottom-right corner
        setResizeOffset({
            x: e.clientX - rect.right, // Offset from the right side of the box
            y: e.clientY - rect.bottom, // Offset from the bottom side of the box
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
    }, [resizing, resizeOffset.x, resizeOffset.y]);

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
                    transition: "left 0.3s ease, top 0.3s ease", // Smoother transition for movement
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
