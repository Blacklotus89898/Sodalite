import React from 'react';
import { AudioIntensity } from '../components/audioIntensity.tsx';

const Music: React.FC = () => {
    return (
        <div style={pageStyle}>
            <h1 style={titleStyle}>🎶 Live Music Visualizer</h1>
            <p style={subtitleStyle}>Turn on your microphone and see your audio come to life!</p>
            <div style={visualizerContainerStyle}>
                <AudioIntensity />
            </div>
        </div>
    );
};

const pageStyle = {
    height: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    color: '#fff',
    fontFamily: `'Arial', sans-serif`,
    padding: '20px',
    boxSizing: 'border-box' as const,
};

const titleStyle = {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#00ffcc',
};

const subtitleStyle = {
    fontSize: '18px',
    marginBottom: '30px',
    color: '#ccc',
};

const visualizerContainerStyle = {
    backgroundColor: '#1e1e1e',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 255, 204, 0.3)',
    width: '100%',
    maxWidth: '800px',
    boxSizing: 'border-box' as const,
};

export default Music;
