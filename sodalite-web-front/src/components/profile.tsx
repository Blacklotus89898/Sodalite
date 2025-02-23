import React, { useState, ChangeEvent } from 'react';

type Profile = {
  theme: string;
  appList: string[];
  userName: string;
  chroma: string;
};

const ProfileComponent: React.FC = () => {
  const [profile, setProfile] = useState<Profile>({
    theme: '',
    appList: [],
    userName: '',
    chroma: ''
  });
  const [jsonInput, setJsonInput] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const result = JSON.parse(event.target.result as string);
          setProfile(result);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleAppListChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      appList: e.target.value.split('\n')
    }));
  };

  const handleJsonInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
  };

  const handleLoadJson = () => {
    try {
      const jsonProfile = JSON.parse(jsonInput);
      setProfile(jsonProfile);
    } catch (error) {
      console.error("Invalid JSON input:", error);
    }
  };

  return (
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
            name="userName"
            value={profile.userName}
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
            name="appList"
            value={profile.appList.join('\n')}
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

      {/* Profile Preview */}
      <div style={{ backgroundColor: '#222', padding: '20px', borderRadius: '8px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Profile Preview:</h2>
        <pre style={{ color: '#ddd', backgroundColor: '#333', padding: '10px', borderRadius: '5px' }}>{JSON.stringify(profile, null, 2)}</pre>
      </div>
    </div>
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

// Input hover and focus styles
const inputHoverStyle = {
  ...inputStyle,
  backgroundColor: '#111',
  border: '1px solid #888',
};

export default ProfileComponent;
