import React, { useState, useEffect, ReactNode, CSSProperties } from "react";

interface ResizableDraggableComponentProps {
  children: ReactNode;
  initialPosition: { left: number; top: number };
  initialSize: { width: number; height: number };
  onUpdate: (updates: { left?: number; top?: number; width?: number; height?: number }) => void;
}

const ResizableDraggableComponent: React.FC<ResizableDraggableComponentProps> = ({
  children,
  initialPosition,
  initialSize,
  onUpdate,
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
  const [resizeInitialSize, setResizeInitialSize] = useState(initialSize);
  
  const [zIndex, setZIndex] = useState(1); // Track the zIndex of the component on hover

  useEffect(() => {
    setPosition(initialPosition);
    setSize(initialSize);
  }, [initialPosition, initialSize]);

  // Dragging logic
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (resizing) return; // Prevent dragging when resizing
    setDragging(true);
    setDragOffset({ x: e.clientX - position.left, y: e.clientY - position.top });
  };

  const handleDragMove = (e: MouseEvent) => {
    if (!dragging) return;
    const newLeft = e.clientX - dragOffset.x;
    const newTop = e.clientY - dragOffset.y;
    setPosition({ left: newLeft, top: newTop });
    onUpdate({ left: newLeft, top: newTop });
  };

  const handleDragEnd = () => setDragging(false);

  // Resize logic
  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setResizing(true);
    setResizeStart({ x: e.clientX, y: e.clientY });
    setResizeInitialSize(size);
    e.stopPropagation(); // Prevent dragging logic from starting when resizing
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!resizing) return;
    const newWidth = Math.max(50, resizeInitialSize.width + (e.clientX - resizeStart.x));
    const newHeight = Math.max(50, resizeInitialSize.height + (e.clientY - resizeStart.y));

    setSize({ width: newWidth, height: newHeight });
    onUpdate({ width: newWidth, height: newHeight });
  };

  const handleResizeEnd = () => setResizing(false);

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

  // Update zIndex on hover
  const handleMouseEnter = () => setZIndex(10); // Bring to the front on hover
  const handleMouseLeave = () => setZIndex(1); // Reset zIndex when hover ends

  return (
    <div
      style={{
        ...childStyle,
        left: position.left,
        top: position.top,
        width: size.width,
        height: size.height,
        zIndex: zIndex, // Apply dynamic zIndex
      }}
      onMouseDown={handleDragStart}
      onMouseEnter={handleMouseEnter} // Handle mouse hover enter
      onMouseLeave={handleMouseLeave} // Handle mouse hover leave
    >
      {children}
      <div
        style={resizeHandleStyle}
        onMouseDown={handleResizeStart} // Start resizing when the mouse is pressed on the handle
      />
    </div>
  );
};

const childStyle: CSSProperties = {
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "transparent",
  color: "white",
  fontWeight: "bold",
  borderRadius: "8px",
  cursor: "move",
  userSelect: "none",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

const resizeHandleStyle: CSSProperties = {
  position: "absolute",
  bottom: 0,
  right: 0,
  width: "16px",
  height: "16px",
  backgroundColor: "#e74c3c",
  cursor: "se-resize",
  borderRadius: "50%",
  border: "2px solid white",
};

export default ResizableDraggableComponent;
