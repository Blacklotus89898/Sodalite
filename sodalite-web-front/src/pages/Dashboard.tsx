import React from "react";
import GraphComponent from "../components/graph";
import ProfileComponent from "../components/profile";
import { AudioIntensity } from "../components/audioIntensity";
// import FileUploadComponent from "../components/fileUploadComponent";
import TranslationComponent from "../components/translationComponent";
import Timer from "../components/timer";

const Dashboard: React.FC = () => {
  return (
    <>
      <h1 style={headerStyle}>Dashboard</h1>
      <div style={dashboardContainerStyle}>
        <ProfileComponent />
        {/* <FileUploadComponent /> */}
        <TranslationComponent />
        <AudioIntensity />
        <Timer initialTime={60} />
        <GraphComponent xValues={[1, 2, 3]} yValues={[4, 5, 6]} />
      </div>
    </>
  );
};

export default Dashboard;

// Dark theme dashboard container styling
const dashboardContainerStyle = {
  padding: '20px',
  backgroundColor: '#222', // Dark background for the entire dashboard
  color: '#fff', // Light text for contrast
  borderRadius: '10px',
  margin: 'auto',
  maxWidth: '1900px',
  textAlign: 'center' as const,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)', // Soft shadow for depth
  display: 'flex',
  flexWrap: 'wrap' as const, // Corrected property to allow wrapping of child components
  gap: '20px', // Adding gap for better spacing between components
};

// Styling for the header
const headerStyle = {
  fontSize: '28px',
  marginBottom: '20px',
  color: 'white', // White text color
  fontWeight: 'bold',
};
