import React, { useState, useEffect, useRef } from 'react';

interface CustomWindow extends Window {
    SpeechRecognition: typeof window.SpeechRecognition | undefined;
    webkitSpeechRecognition: typeof window.SpeechRecognition;
}
declare let window: CustomWindow;

interface TranscriptProps {
    language?: string;
}

const Transcript: React.FC<TranscriptProps> = ({ language = 'en-US' }) => {
    const [text, setText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);
    const [isSupported, setIsSupported] = useState(true);

    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionRef = useRef<SpeechRecognition | null>(
        SpeechRecognition ? new SpeechRecognition() : null
    );

    useEffect(() => {
        if (!SpeechRecognition) {
            setIsSupported(false);
            return;
        }
        const recognition = recognitionRef.current;
        if (!recognition) return;

        recognition.lang = language;
        recognition.interimResults = true;
        recognition.continuous = true;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }

            setText(prev => prev + finalTranscript);
        };

        recognition.onstart = () => {
            setIsListening(true);
            startVisualizer();
        };

        recognition.onend = () => {
            setIsListening(false);
            stopVisualizer();
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
            stopVisualizer();
        };

        return () => {
            recognition.stop();
            stopVisualizer();
        };
    }, [language]);

    const startRecognition = () => {
        const recognition = recognitionRef.current;
        if (!recognition) return;
        recognition.start();
    };

    const stopRecognition = () => {
        recognitionRef.current?.stop();
    };

    const startVisualizer = async () => {
        try {
            audioContextRef.current = new AudioContext();
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const audioContext = audioContextRef.current;

            analyserRef.current = audioContext.createAnalyser();
            analyserRef.current.fftSize = 256;
            const microphone = audioContext.createMediaStreamSource(stream);
            microphoneRef.current = microphone;
            microphone.connect(analyserRef.current);

            const bufferLength = analyserRef.current.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const tick = () => {
                analyserRef.current?.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
                setAudioLevel(average / 256);
                animationFrameRef.current = requestAnimationFrame(tick);
            };

            tick();
        } catch (err) {
            console.error("Audio visualizer error:", err);
        }
    };

    const stopVisualizer = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        analyserRef.current?.disconnect();
        microphoneRef.current?.disconnect();
        audioContextRef.current?.close();
        setAudioLevel(0);
    };

    if (!isSupported) {
        return <p style={{ color: 'red' }}>Your browser does not support Speech Recognition.</p>;
    }

    return (
        <div style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'center' }}>
            <div style={{ marginBottom: '10px' }}>
                <button onClick={startRecognition} disabled={isListening} style={{ marginRight: '10px' }}>Start</button>
                <button onClick={stopRecognition} disabled={!isListening}>Stop</button>
            </div>

            {isListening && (
                <div style={{ width: '100%', backgroundColor: '#eee', height: '10px', margin: '10px 0' }}>
                    <div style={{ width: `${audioLevel * 100}%`, height: '100%', backgroundColor: '#4caf50' }}></div>
                </div>
            )}

            <p style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }}>{text}</p>
        </div>
    );
};

export default Transcript;
