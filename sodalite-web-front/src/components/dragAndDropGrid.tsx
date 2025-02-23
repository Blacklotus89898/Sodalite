import React, { useState, ReactNode } from "react";

interface DraggableChildProps {
  index: number;
  moveChild: (fromIndex: number, toIndex: number) => void;
  children: ReactNode;
}

const DraggableChild = ({ index, moveChild, children }: DraggableChildProps) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Allow drop by preventing default handling
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const fromIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    moveChild(fromIndex, index); // Swap positions of dragged item and target item
    e.dataTransfer.clearData();
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        width: "180px",
        height: "180px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#3498db",
        color: "white",
        fontSize: "20px",
        fontWeight: "bold",
        border: "2px solid #2980b9",
        borderRadius: "8px",
        cursor: "grab",
        userSelect: "none",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onDragEnd={(e) => {
        // Reset the styles after the drag ends
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
      }}
      onDragEnter={(e) => {
        // Add a lift effect on hover
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
      }}
      onDragLeave={(e) => {
        // Reset hover effects
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
      }}
    >
      {children}
    </div>
  );
};

interface DragAndDropGridProps {
  children: ReactNode[];
  rows: number;
  cols: number;
}

const DragAndDropGrid = ({ children, rows, cols }: DragAndDropGridProps) => {
  const [childComponents, setChildComponents] = useState(children);

  const moveChild = (fromIndex: number, toIndex: number) => {
    const updatedChildren = [...childComponents];
    // Swap the elements at fromIndex and toIndex
    const temp = updatedChildren[fromIndex];
    updatedChildren[fromIndex] = updatedChildren[toIndex];
    updatedChildren[toIndex] = temp;

    setChildComponents(updatedChildren);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 200px)`,
        gridTemplateRows: `repeat(${rows}, 200px)`,
        gap: "20px",
        padding: "20px",
        background: "#ecf0f1",
        borderRadius: "12px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {childComponents.map((child, index) => (
        <DraggableChild key={index} index={index} moveChild={moveChild}>
          {child}
        </DraggableChild>
      ))}
    </div>
  );
};

export default DragAndDropGrid;
