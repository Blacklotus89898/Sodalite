import React, { useState, JSX } from "react";
import ResizableDraggableComponent from "./draggableComponent";
import { ChatApp } from "./chatApp";
import VideoChat from "./videoChat";
import UpdateAddress from "./serverSettings";
import CollabApp from "./collabApp";
import FileUploadComponent from "./fileUploadComponent";
import { CanvaShare } from "./canvaShare";

interface BoxData {
  id: number;
  left: number;
  top: number;
  width: number;
  height: number;
  type: "text" | "image" | "custom";
  content: string | JSX.Element;
}

const ResizableDraggableContainer: React.FC = () => {
  const [boxes, setBoxes] = useState<BoxData[]>([
    { id: 1, left: 100, top: 100, width: 400, height: 450, type: "custom", content: <CollabApp /> },
    { id: 2, left: 300, top: 100, width: 400, height: 450, type: "custom", content: <VideoChat /> },
    { id: 3, left: 100, top: 300, width: 400, height: 450, type: "custom", content: <ChatApp /> },
    { id: 4, left: 100, top: 300, width: 400, height: 450, type: "custom", content: <UpdateAddress /> },
    { id: 5, left: 100, top: 300, width: 400, height: 450, type: "custom", content: <FileUploadComponent /> },
    { id: 6, left: 200, top: 300, width: 400, height: 450, type: "custom", content: <CanvaShare /> },
  ]);

  const updateBox = (id: number, updates: Partial<BoxData>) => {
    setBoxes((prev) =>
      prev.map((box) => (box.id === id ? { ...box, ...updates } : box))
    );
  };

  const addNewBox = (type: "text" | "image" | "custom") => {
    const newId = boxes.length + 1;
    setBoxes([
      ...boxes,
      {
        id: newId,
        left: 50,
        top: 50,
        width: 180,
        height: 180,
        type,
        content:
          type === "text"
            ? `New Text Box ${newId}`
            : type === "image"
              ? <img src="https://via.placeholder.com/150" alt={`Image ${newId}`} style={{ width: "100%", height: "100%" }} />
              : <div>Custom Box {newId}</div>,
      },
    ]);
  };

  const deleteBox = (id: number) => {
    setBoxes((prev) => prev.filter((box) => box.id !== id));
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "800px",
        border: "2px solid #ccc",
        backgroundColor: "#f0f0f0",
        overflow: "hidden",
      }}
    >
      <button onClick={() => addNewBox("text")}>Add Text Box</button>
      {boxes.map((box) => (
        <ResizableDraggableComponent
          key={box.id}
          initialPosition={{ left: box.left, top: box.top }}
          initialSize={{ width: box.width, height: box.height }}
          onUpdate={(updates) => updateBox(box.id, updates)}
        >
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {/* Red Circle Delete Button */}
            <button
              onClick={() => deleteBox(box.id)}
              style={{
                position: "absolute",
                top: "4px",
                left: "4px",
                width: "16px",
                height: "16px",
                backgroundColor: "red",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
                zIndex: 10,
              }}
              title="Delete"
            />
            {/* Box Content */}
            <div style={{ width: "100%", height: "100%", padding: "10px", boxSizing: "border-box" }}>
              {box.content}
            </div>
          </div>
        </ResizableDraggableComponent>
      ))}
    </div>
  );
};

export default ResizableDraggableContainer;
