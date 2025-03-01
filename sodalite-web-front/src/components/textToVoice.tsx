import React, { useState } from 'react';

const TextToVoice = () => {
  const [text, setText] = useState('');


const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setText(event.target.value);
};

  const speakText = () => {
    const utterance = new window.SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div>
      <textarea value={text} onChange={handleTextChange} />
      <button onClick={speakText}>Speak Text</button>
    </div>
  );
};

export default TextToVoice;
