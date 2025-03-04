import React, { ChangeEvent } from 'react';
import { useProfile, useTheme } from '../stores/hooks'; // Import the custom hook for the global profile context
import { Container } from './container';

const ProfileComponent: React.FC = () => {
  const { profile, setProfile } = useProfile(); // Access global state from context
  const { theme, chroma } = useTheme(); // Get theme and chroma dynamically
  const [jsonInput, setJsonInput] = React.useState<string>('');

  // Sanitize the input by trimming leading/trailing whitespace
  const sanitizeJson = (jsonString: string) => {
    return jsonString.trim();
  };

  // Handle the file input and parse JSON
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const fileContent = event.target.result as string;
          console.log("File Content:", fileContent); // Log the content of the file
          try {
            const result = JSON.parse(fileContent);
            setProfile(result); // Update global profile state
          } catch (error) {
            console.error("Error parsing JSON from file:", error);
            alert("The file content is not valid JSON.");
          }
        }
      };
      reader.readAsText(file);
    }
  };

  // Handle changes in the manual input fields
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    })); // Update global profile state
  };

  // Handle changes in the app list input
  const handleAppListChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      favoriteApp: e.target.value.split('\n')
    })); // Update global profile state
  };

  // Handle changes in the raw JSON input field
  const handleJsonInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
  };

  // Handle loading the profile from the raw JSON input
  const handleLoadJson = () => {
    try {
      const sanitizedInput = sanitizeJson(jsonInput); // Sanitize the input
      console.log("Sanitized JSON Input:", sanitizedInput); // Log sanitized input for debugging
      const jsonProfile = JSON.parse(sanitizedInput); // Try parsing the sanitized input
      setProfile(jsonProfile); // Update global profile state
    } catch (error) {
      console.error("Invalid JSON input:", error);
      alert("The provided JSON is invalid. Please check the format.");
    }
  };

  // Function to trigger the download of the profile as a JSON file
  const downloadProfile = () => {
    const profileBlob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(profileBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'profile.json'; // The name of the file being downloaded
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Determine if dark mode is active
  const isDarkMode = theme === 'dark';

  // Reusable styles
  const containerStyle: React.CSSProperties = {
    padding: '20px',
    backgroundColor: isDarkMode ? '#111' : '#fff',
    borderRadius: '8px',
    color: isDarkMode ? 'white' : 'black',
    maxWidth: '800px',
    margin: '0 auto',
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '24px',
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: '20px',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '16px',
    marginBottom: '10px',
  };

  const inputGroupStyle: React.CSSProperties = {
    marginBottom: '10px',
  };

  const inputLabelStyle: React.CSSProperties = {
    fontSize: '14px',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    backgroundColor: isDarkMode ? '#000' : '#f8f8f8',
    border: `1px solid ${isDarkMode ? '#444' : '#ccc'}`,
    borderRadius: '5px',
    color: isDarkMode ? 'white' : 'black',
    marginBottom: '10px',
    transition: 'background-color 0.3s ease, border 0.3s ease',
  };

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    backgroundColor: isDarkMode ? '#000' : '#f8f8f8',
    border: `1px solid ${isDarkMode ? '#444' : '#ccc'}`,
    borderRadius: '5px',
    color: isDarkMode ? 'white' : 'black',
    transition: 'background-color 0.3s ease, border 0.3s ease',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: chroma,
    border: 'none',
    borderRadius: '5px',
    color: isDarkMode ? 'black' : 'white',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.3s ease',
  };

  const previewStyle: React.CSSProperties = {
    backgroundColor: isDarkMode ? '#222' : '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
  };

  const jsonPreviewStyle: React.CSSProperties = {
    color: isDarkMode ? '#ddd' : '#333',
    backgroundColor: isDarkMode ? '#333' : '#fff',
    padding: '10px',
    borderRadius: '5px',
    whiteSpace: 'pre-wrap',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Profile Component</h1>

      {/* Load Profile from JSON File */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Load Profile from JSON File:</label>
        <input type="file" accept=".json" onChange={handleFileChange}
          style={inputStyle}
          onMouseOver={(e) => e.currentTarget.style.border = `1px solid ${chroma}`}
          onMouseOut={(e) => e.currentTarget.style.border = '1px solid rgba(0, 0, 0, 0.3)'}
        />
      </div>

      {/* Manual Input Section */}
      <div style={sectionStyle}>
        <label style={inputLabelStyle}>Manual Input:</label>
        <div style={inputGroupStyle}>
          <label style={inputLabelStyle}>Username:</label>
          <input
            type="text"
            name="username"
            value={profile.username}
            onChange={handleInputChange}
            style={inputStyle}
            onMouseOver={(e) => e.currentTarget.style.border = `1px solid ${chroma}`}
            onMouseOut={(e) => e.currentTarget.style.border = '1px solid rgba(0, 0, 0, 0.3)'}
          />
        </div>
        <div style={inputGroupStyle}>
          <label style={inputLabelStyle}>Theme:</label>
          <input
            type="text"
            name="theme"
            value={profile.theme}
            onChange={handleInputChange}
            style={inputStyle}
            onMouseOver={(e) => e.currentTarget.style.border = `1px solid ${chroma}`}
            onMouseOut={(e) => e.currentTarget.style.border = '1px solid rgba(0, 0, 0, 0.3)'}
          />
        </div>
        <div style={inputGroupStyle}>
          <label style={inputLabelStyle}>Chroma:</label>
          <input
            type="text"
            name="chroma"
            value={profile.chroma}
            onChange={handleInputChange}
            style={inputStyle}
            onMouseOver={(e) => e.currentTarget.style.border = `1px solid ${chroma}`}
            onMouseOut={(e) => e.currentTarget.style.border = '1px solid rgba(0, 0, 0, 0.3)'}
          />
        </div>
        <div style={inputGroupStyle}>
          <label style={inputLabelStyle}>App List (one per line):</label>
          <textarea
            name="favoriteApp"
            value={profile.favoriteApp.join('\n')}
            onChange={handleAppListChange}
            rows={5}
            style={textareaStyle}
            onMouseOver={(e) => e.currentTarget.style.border = `1px solid ${chroma}`}
            onMouseOut={(e) => e.currentTarget.style.border = '1px solid rgba(0, 0, 0, 0.3)'}
          />
        </div>
      </div>

      {/* Load Profile from JSON String */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Load Profile from JSON String:</label>
        <textarea
          onMouseOver={(e) => e.currentTarget.style.border = `1px solid ${chroma}`}
          onMouseOut={(e) => e.currentTarget.style.border = '1px solid rgba(0, 0, 0, 0.3)'}
          value={jsonInput}
          onChange={handleJsonInputChange}
          rows={5}
          style={textareaStyle}
        />
        <button onClick={handleLoadJson} style={buttonStyle}>
          Load JSON
        </button>
      </div>

      {/* Download Profile Button */}
      <div style={sectionStyle}>
        <button onClick={downloadProfile} style={buttonStyle}>
          Download Profile as JSON
        </button>
      </div>

      {/* Profile Preview */}
      <div style={previewStyle}>
        <h2 style={headerStyle}>Profile Preview:</h2>
        <pre style={jsonPreviewStyle}>{JSON.stringify(profile, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ProfileComponent;
