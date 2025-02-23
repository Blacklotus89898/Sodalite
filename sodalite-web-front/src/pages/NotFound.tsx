import React from "react";

const NotFound: React.FC = () => {
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

// Dark theme container styling
import { CSSProperties } from "react";

const notFoundContainerStyle: CSSProperties = {
  height: '100vh',
  padding: '20px',
  backgroundColor: '#222', // Dark background for the entire page
  color: '#fff', // Light text for contrast
  textAlign: 'center' as const,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

// Content styling
const contentStyle = {
  backgroundColor: '#333', // Slightly lighter dark background for content box
  padding: '30px',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', // Soft shadow for depth
  maxWidth: '400px',
  width: '100%',
};

// Header styling
const headerStyle = {
  fontSize: '72px',
  fontWeight: 'bold',
  color: '#e74c3c', // Red color for the 404 to stand out
  marginBottom: '20px',
};

// Message styling
const messageStyle = {
  fontSize: '18px',
  color: '#ddd',
};
