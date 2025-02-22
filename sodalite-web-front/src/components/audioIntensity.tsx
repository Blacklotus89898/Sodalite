import React, { useEffect, useRef, useState } from 'react';

export const AudioIntensity: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [intensity, setIntensity] = useState<number>(0);

    useEffect(() => {
        // Step 1: Request Microphone Access
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    // Step 2: Set Up the Web Audio API
                    const audioContext = new (window.AudioContext)();
                    const source = audioContext.createMediaStreamSource(stream);
                    const analyser = audioContext.createAnalyser();
                    source.connect(analyser);
                    analyser.fftSize = 256;
                    const bufferLength = analyser.frequencyBinCount;
                    const dataArray = new Uint8Array(bufferLength);

                    // Step 3: Visualize the Voice Intensity
                    const canvas = canvasRef.current;
                    if (canvas) {
                        const canvasContext = canvas.getContext('2d');
                        canvas.width = window.innerWidth;
                        canvas.height = 200;

                        function draw() {
                            requestAnimationFrame(draw);

                            analyser.getByteFrequencyData(dataArray);

                            if (canvasContext && canvas) {
                                canvasContext.fillStyle = '#ddd';
                                canvasContext.fillRect(0, 0, canvas.width, canvas.height);

                                const barWidth = (canvas.width / bufferLength) * 2.5;
                                let barHeight;
                                let x = 0;
                                let sum = 0;

                                for (let i = 0; i < bufferLength; i++) {
                                    barHeight = dataArray[i];
                                    sum += barHeight;
                                    canvasContext.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
                                    canvasContext.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
                                    x += barWidth + 1;
                                }

                                const avgIntensity = sum / bufferLength;
                                setIntensity(avgIntensity);
                            }
                        }

                        draw();
                    }
                }).catch(err => {
                    console.error('Error accessing the microphone:', err);
                });
        } else {
            console.error('MediaDevices API not supported in this browser.');
        }
    }, []);

    return (
        <div>
            <h1>Voice Intensity Visualizer</h1>
            <canvas ref={canvasRef}></canvas>
            <div>
                <p>Audio Intensity: {Math.round(intensity)}</p>
            </div>
        </div>
    );
};

