import React, { ChangeEvent } from 'react';
import { useProfile } from '../stores/hooks'; // Import the custom hook for the global profile context
import { Container } from './container';

const ProfileComponent: React.FC = () => {
  const { profile, setProfile } = useProfile(); // Access global state from context
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

  return (
    <Container>
      <div style={{ padding: '20px', backgroundColor: '#000', borderRadius: '8px', color: 'white', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Profile Component</h1>

        {/* Load Profile from JSON File */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '16px', marginBottom: '10px' }}>Load Profile from JSON File:</label>
          <input type="file" accept=".json" onChange={handleFileChange} style={{ padding: '10px', backgroundColor: '#444', border: 'none', borderRadius: '5px', color: 'white' }} />
        </div>

        {/* Manual Input Section */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '20px', paddingBottom: "10px", marginBottom: '20px' }}>Manual Input:</label>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '14px' }}>Username:</label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '14px' }}>Theme:</label>
            <input
              type="text"
              name="theme"
              value={profile.theme}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '14px' }}>Chroma:</label>
            <input
              type="text"
              name="chroma"
              value={profile.chroma}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '14px' }}>App List (one per line):</label>
            <textarea
              name="favoriteApp"
              value={profile.favoriteApp.join('\n')}
              onChange={handleAppListChange}
              rows={5}
              style={textareaStyle}
            />
          </div>
        </div>

        {/* Load Profile from JSON String */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '16px', marginBottom: '10px' }}>Load Profile from JSON String:</label>
          <textarea
            value={jsonInput}
            onChange={handleJsonInputChange}
            rows={5}
            style={textareaStyle}
          />
          <button
            onClick={handleLoadJson}
            style={{ padding: '10px 20px', backgroundColor: '#444', border: 'none', borderRadius: '5px', color: 'white', cursor: 'pointer', marginTop: '10px' }}
          >
            Load JSON
          </button>
        </div>

        {/* Download Profile Button */}
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={downloadProfile}
            style={{ padding: '10px 20px', backgroundColor: '#444', border: 'none', borderRadius: '5px', color: 'white', cursor: 'pointer' }}
          >
            Download Profile as JSON
          </button>
        </div>

        {/* Profile Preview */}
        <div style={{ backgroundColor: '#222', padding: '20px', borderRadius: '8px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Profile Preview:</h2>
          <pre style={{ color: '#ddd', backgroundColor: '#333', padding: '10px', borderRadius: '5px' }}>{JSON.stringify(profile, null, 2)}</pre>
        </div>
      </div>
    </Container>
  );
};

// Reusable styles for input and textarea
const inputStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#000',
  border: '1px solid #444',
  borderRadius: '5px',
  color: 'white',
  marginBottom: '10px',
  transition: 'background-color 0.3s ease, border 0.3s ease',
};

const textareaStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#000',
  border: '1px solid #444',
  borderRadius: '5px',
  color: 'white',
  transition: 'background-color 0.3s ease, border 0.3s ease',
};

export default ProfileComponent;
