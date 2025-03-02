import React, { useState, JSX } from "react";
import ResizableDraggableComponent from "./draggableComponent";
import { ChatApp } from "./chatApp";
import Iframe from "./iframe";
import VideoChat from "./videoChat";

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
    {
      id: 1,
      left: 100,
      top: 100,
      width: 180,
      height: 180,
      type: "text",
      content:
      <Iframe initialLink="https://wikipedia.com" name="Example" /> 
      ,
    },
    {
      id: 2,
      left: 300,
      top: 100,
      width: 180,
      height: 180,
      type: "image",
      content: <VideoChat />,
    },
    {
      id: 3,
      left: 100,
      top: 300,
      width: 180,
      height: 180,
      type: "custom",
      content: (
       <ChatApp />
      ),
    },
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
  

  return (
    <div
      style={{
        position: "relative",
        width: "90%",
        height: "500px",
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
          {box.type === "text" ? (
            <div style={{ padding: "10px" }}>{box.content}</div>
          ) : box.type === "image" ? (
            box.content
          ) : (
            box.content
          )}
        </ResizableDraggableComponent>
      ))}
    </div>
  );
};

export default ResizableDraggableContainer;
