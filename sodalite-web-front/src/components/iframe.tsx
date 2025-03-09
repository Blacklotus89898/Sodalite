import React, { useState } from 'react';

interface IframeProps {
  initialLink: string;
  name: string;
}

const Iframe: React.FC<IframeProps> = ({ initialLink, name }) => {
  const [link, setLink] = useState(initialLink);
  const [inputLink, setInputLink] = useState('');

  const updateLink = (newLink: string) => {
    setLink(newLink);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputLink(e.target.value);
  };

  const handleLinkUpdate = () => {
    updateLink(inputLink);
    setInputLink('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.controls}>
        <input
          type="text"
          value={inputLink}
          onChange={handleInputChange}
          placeholder="Enter new link"
          style={styles.input}
        />
        <button onClick={handleLinkUpdate} style={styles.button}>Update Link</button>
      </div>
      <iframe
        src={link}
        title={name}
        style={styles.iframe}
      >
        {name}
      </iframe>

    </div>
  );
};

// Define the styles
const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: '15px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f4f7f6',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: '1px solid white',
    borderRadius: '15px',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',
    padding: '10px',
  },
  input: {
    padding: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    // marginBottom: '10px',
    width: '80%',
  },
  button: {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
  },
};

export default Iframe;
