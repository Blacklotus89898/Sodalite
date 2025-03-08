import React from "react";
import { useTheme } from "../stores/hooks";
import { CSSProperties } from "react";

const NotFound: React.FC = () => {

const { theme, chroma } = useTheme();
// Dark theme container styling

const notFoundContainerStyle: CSSProperties = {
  height: '100vh',
  padding: '20px',
  backgroundColor: theme === "dark"? '#111' : "white", // Dark background for the entire page
  textAlign: 'center' as const,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

// Content styling
const contentStyle = {
  backgroundColor: theme === "dark"? '#222' : "white", // Dark background for the entire page
  // Slightly lighter dark background for content box
  padding: '30px',
  borderRadius: '8px',
  boxShadow: `0 4px 12px ${chroma}`, // Soft shadow for depth
  maxWidth: '400px',
  width: '100%',
};

// Header styling
const headerStyle = {
  fontSize: '72px',
  fontWeight: 'bold',
  color: `${chroma}`, // Red color for the 404 to stand out
  marginBottom: '20px',
};

// Message styling
const messageStyle = {
  fontSize: '18px',
  // color: '#ddd',
  color: theme === "light"? '#111' : "white", // Dark background for the entire page

};
  return (
    <div style={notFoundContainerStyle}>
      <div style={contentStyle}>
        <h1 style={headerStyle}>404</h1>
        <p style={messageStyle}>Page Not Found</p>
      </div>
    </div>
  );
};

export default NotFound;