import React, { useState } from 'react';

interface CustomWindow extends Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
}

declare let window: CustomWindow;

const VoiceToText: React.FC = () => {
    const [text, setText] = useState<string>('');
    const [isListening, setIsListening] = useState<boolean>(false);

    // Cross-browser SpeechRecognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        return <p>Your browser does not support Speech Recognition.</p>;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[0][0].transcript;
        setText(result);
        recognition.stop(); // Explicitly stop after getting result
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
    };

    const startRecognition = () => {
        setText(''); // Clear previous text
        recognition.start();
    };

    return (
        <div>
            <button onClick={startRecognition} disabled={isListening}>
                {isListening ? 'Listening...' : 'Start Voice Recognition'}
            </button>
            <p>Recognized Text: {text}</p>
        </div>
    );
};

export default VoiceToText;
