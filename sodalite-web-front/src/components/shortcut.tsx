
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


  return (
    <>
    
        <div style={modalStyles}>
          <div style={modalContentStyles}>
            <h2>Modal Opened!</h2>
            <h3>Quick tips</h3>
            <p>z for quick menu</p>
            <p>/ for search menu</p>
            <p>change the theme and chroma</p>
            <p>Explore</p>
            <p>Press Spacebar again to close.</p>
          </div>
        </div>
      
    </>
  );
};

export default SpacebarModal;
