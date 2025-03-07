import React, { useState, useEffect } from "react";

const modalStyles: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalContentStyles: React.CSSProperties = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
  textAlign: "center",
};

const SpacebarModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === "Space") {
      setIsOpen((prev) => !prev);
      event.preventDefault(); // Prevent page scrolling
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      {isOpen && (
        <div style={modalStyles}>
          <div style={modalContentStyles}>
            <h2>Modal Opened!</h2>
            <p>Press Spacebar again to close.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default SpacebarModal;
