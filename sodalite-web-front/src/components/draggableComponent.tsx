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

  useEffect(() => {
    setPosition(initialPosition);
    setSize(initialSize);
  }, [initialPosition, initialSize]);

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (resizing) return;
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

  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setResizing(true);
    setResizeStart({ x: e.clientX, y: e.clientY });
    setResizeInitialSize(size);
    e.stopPropagation();
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

  return (
    <div
      style={{
        ...childStyle,
        left: position.left,
        top: position.top,
        width: size.width,
        height: size.height,
      }}
      onMouseDown={handleDragStart}
    >
      {children}
      <div style={resizeHandleStyle} onMouseDown={handleResizeStart} />
    </div>
  );
};

const childStyle: CSSProperties = {
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#3498db",
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
