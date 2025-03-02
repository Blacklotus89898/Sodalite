import React from 'react';

interface TextToVoiceProps {
  text: string;
  language: string; // Add language prop
}

const TextToVoice: React.FC<TextToVoiceProps> = ({ text, language }) => {
  const speakText = () => {
    if (!window.speechSynthesis) {
      alert("Your browser does not support speech synthesis.");
      return;
    }
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = language; // Set the language
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Text to Speech</h2>
      <p>{text ? "Click the button to hear the translation:" : "Please translate some text first."}</p>
      <button onClick={speakText} style={buttonStyle} disabled={!text.trim()}>
        Speak Translated Text
      </button>
    </div>
  );
};

// Styles for the TextToVoice component
const containerStyle = {
  padding: '20px',
  backgroundColor: '#333',
  color: '#fff',
  borderRadius: '10px',
  maxWidth: '600px',
  margin: 'auto',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  textAlign: 'center' as const,
};

const headerStyle = {
  fontSize: '24px',
  marginBottom: '10px',
  color: '#fff',
  fontWeight: 'bold',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#3498db',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  fontSize: '16px',
  cursor: 'pointer',
};

export default TextToVoice;
