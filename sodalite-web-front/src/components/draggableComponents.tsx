import React, { useState } from "react";

const DraggableComponents = () => {
  const [positions, setPositions] = useState([
    { id: 1, left: 100, top: 100 },
    { id: 2, left: 300, top: 100 },
    { id: 3, left: 100, top: 300 },
  ]);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    setDraggingId(id);
    const rect = e.currentTarget.getBoundingClientRect();
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggingId === null) return;

    const newLeft = e.clientX - e.currentTarget.getBoundingClientRect().left - offset.x;
    const newTop = e.clientY - e.currentTarget.getBoundingClientRect().top - offset.y;

    setPositions((prevPositions) =>
      prevPositions.map((pos) =>
        pos.id === draggingId ? { ...pos, left: newLeft, top: newTop } : pos
      )
    );
  };

  return (
    <div
      style={{
        position: "relative",
        width: "500px",
        height: "500px",
        border: "2px solid #ccc",
        backgroundColor: "#f0f0f0",
        overflow: "hidden",
      }}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {positions.map((position) => (
        <div
          key={position.id}
          draggable
          onDragStart={(e) => handleDragStart(e, position.id)}
          onDragEnd={handleDragEnd}
          style={{
            position: "absolute",
            left: `${position.left}px`,
            top: `${position.top}px`,
            width: "180px",
            height: "180px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#3498db",
            color: "white",
            fontSize: "20px",
            fontWeight: "bold",
            borderRadius: "8px",
            cursor: draggingId === position.id ? "grabbing" : "grab",
            userSelect: "none",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {`Drag me ${position.id}`}
        </div>
      ))}
    </div>
  );
};

export default DraggableComponents;
