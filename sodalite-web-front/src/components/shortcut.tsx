import { useEffect, useRef } from "react";

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
  zIndex: 100,
};

const modalContentStyles: React.CSSProperties = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
  textAlign: "center",
};

interface SpacebarModalProps {
  onClose: () => void; // Function to close the modal
}

const SpacebarModal: React.FC<SpacebarModalProps> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        console.log("Clicked outside, closing modal...");
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div style={modalStyles}>
      <div style={modalContentStyles} ref={modalRef}>
        <h2>Modal Opened!</h2>
        <h3>Quick Tips</h3>
        <p>z for quick menu</p>
        <p>/ for search menu</p>
        <p>Change the theme and chroma</p>
        <p>Explore</p>
        <p>Press Spacebar again to close.</p>
      </div>
    </div>
  );
};

export default SpacebarModal;
