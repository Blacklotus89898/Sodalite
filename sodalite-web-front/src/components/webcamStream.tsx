import React, { useRef, useEffect, useState } from "react";

const WebcamStream: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null); // Reference to the video element
    const [stream, setStream] = useState<MediaStream | null>(null); // Webcam stream
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null); // To store the MediaRecorder

    // Initialize the webcam stream
    useEffect(() => {
        const initWebcam = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false, // Set to true if audio is needed
                });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream; // Attach stream to video element
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current?.play(); // Start playing the video feed
                    };
                }
            } catch (err) {
                console.error("Error accessing webcam:", err);
                alert("Webcam access denied. Please enable permissions and reload.");
            }
        };

        initWebcam();

        // Cleanup webcam stream when the component unmounts
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []); // Empty dependency array to run only once

    // Start recording video
    const handleStartRecording = () => {
        if (!stream) {
            console.error("No webcam stream available");
            return;
        }
        setIsRecording(true);

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder; // Store mediaRecorder in ref
        const chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };

        mediaRecorder.onstop = async () => {
            setIsRecording(false);
            const blob = new Blob(chunks, { type: "video/webm" });
            await sendToServer(blob); // Send recorded video to the backend
        };

        mediaRecorder.start();
        console.log("Recording started");

        setTimeout(() => {
            mediaRecorder.stop(); // Stop recording after a certain time (e.g., 5 seconds)
            console.log("Recording stopped");
        }, 5000);
    };

    // Send the recorded video to the backend server
    const sendToServer = async (videoBlob: Blob) => {
        const formData = new FormData();
        formData.append("video", videoBlob, "recording.webm");

        try {
            const response = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData,
            });
            if (!response.ok) {
                throw new Error("Failed to upload video");
            }
            console.log("Video uploaded successfully");
        } catch (err) {
            console.error("Error uploading video:", err);
        }
    };

    // Cleanup mediaRecorder when the component unmounts
    useEffect(() => {
        return () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                mediaRecorderRef.current.stop(); // Stop the recording if component unmounts
            }
        };
    }, []);

    return (
        <div>
            <h1>Webcam Stream</h1>
            <video
                ref={videoRef}
                style={{ width: "100%", maxHeight: "400px", border: "2px solid black" }}
            />
            <div style={{ marginTop: "20px" }}>
                <button
                    onClick={handleStartRecording}
                    disabled={isRecording}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: isRecording ? "#ccc" : "#007BFF",
                        color: "white",
                        border: "none",
                        cursor: isRecording ? "not-allowed" : "pointer",
                    }}
                >
                    {isRecording ? "Recording..." : "Start Recording"}
                </button>
            </div>
        </div>
    );
};

export default WebcamStream;
