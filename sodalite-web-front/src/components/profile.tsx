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
    <div>
      <h1>Profile Component</h1>
      <div>
        <label>Load Profile from JSON File:</label>
        <input type="file" accept=".json" onChange={handleFileChange} />
      </div>
      <div>
        <label>Manual Input:</label>
        <div>
          <label>Username:</label>
          <input type="text" name="userName" value={profile.userName} onChange={handleInputChange} />
        </div>
        <div>
          <label>Theme:</label>
          <input type="text" name="theme" value={profile.theme} onChange={handleInputChange} />
        </div>
        <div>
          <label>Chroma:</label>
          <input type="text" name="chroma" value={profile.chroma} onChange={handleInputChange} />
        </div>
        <div>
          <label>App List (one per line):</label>
          <textarea name="appList" value={profile.appList.join('\n')} onChange={handleAppListChange} rows={5} cols={30} />
        </div>
      </div>
      <div>
        <label>Load Profile from JSON String:</label>
        <textarea value={jsonInput} onChange={handleJsonInputChange} rows={5} cols={30} />
        <button onClick={handleLoadJson}>Load JSON</button>
      </div>
      <div>
        <h2>Profile Preview:</h2>
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ProfileComponent;
