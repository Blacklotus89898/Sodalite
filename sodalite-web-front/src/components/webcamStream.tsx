import React, { useRef, useEffect, useState } from "react";
import { Container } from "./container";

const WebcamStream: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null); // Reference to the video element
    const [stream, setStream] = useState<MediaStream | null>(null); // Webcam stream
    const [isRecording, setIsRecording] = useState(false);
    const [filename, setFilename] = useState<string | null>(null); // Store the filename after upload
    const [customFilename, setCustomFilename] = useState<string>(""); // Optional custom filename
    const [videoToFetch, setVideoToFetch] = useState<string>(""); // State for the video filename to fetch

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
        const filenameToSend = customFilename || "recording.webm"; // Use custom filename or fallback to "recording.webm"
        formData.append("video", videoBlob, filenameToSend);

        try {
            const response = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();

            if (response.ok) {
                // Save the filename received from the server
                setFilename(data.filename);
                console.log("Video uploaded successfully, filename:", data.filename);
            } else {
                console.error("Error uploading video:", data.message);
            }
        } catch (err) {
            console.error("Error uploading video:", err);
        }
    };

    // Handle filename input for the fetched video
    const handleFetchVideo = () => {
        if (!videoToFetch) return;
        setFilename(videoToFetch);
        setVideoToFetch(""); // Clear the input field
    };

    return (
        <Container maxWidth={1200} maxHeight={1200}>
            <h1>Webcam Stream</h1>
            
            {/* Webcam Video */}
            <div style={{ marginTop: "20px", border: "2px solid black", padding: "10px" }}>
                <h2>Your Webcam Stream</h2>
                <video
                    ref={videoRef}
                    style={{ width: "100%", maxHeight: "400px" }}
                    autoPlay
                    playsInline
                    muted
                    controls
                />
            </div>

            {/* Record Button */}
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

            {/* Optional filename input for uploaded video */}
            <div style={{ marginTop: "20px" }}>
                <label>
                    Enter a custom filename for your video (optional):
                    <input
                        type="text"
                        value={customFilename}
                        onChange={(e) => setCustomFilename(e.target.value)}
                        placeholder="Enter filename (e.g. myvideo)"
                        style={{
                            padding: "5px",
                            marginLeft: "10px",
                            border: "1px solid #ccc",
                        }}
                    />
                </label>
            </div>

            {/* Fetch video section */}
            <div style={{ marginTop: "20px" }}>
                <label>
                    Enter a video filename to fetch:
                    <input
                        type="text"
                        value={videoToFetch}
                        onChange={(e) => setVideoToFetch(e.target.value)}
                        placeholder="Enter filename to fetch"
                        style={{
                            padding: "5px",
                            marginLeft: "10px",
                            border: "1px solid #ccc",
                        }}
                    />
                </label>
                <button
                    onClick={handleFetchVideo}
                    style={{
                        padding: "5px 10px",
                        marginLeft: "10px",
                        backgroundColor: "#007BFF",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    Fetch Video
                </button>
            </div>

            {/* Display the uploaded video */}
            {filename && (
                <div style={{ marginTop: "20px", border: "2px solid black", padding: "10px" }}>
                    <h2>Watch your uploaded video</h2>
                    <video
                        key={filename} // Force re-render of the video element when filename changes
                        style={{ width: "100%", maxHeight: "400px" }}
                        controls
                    >
                        <source
                            src={`http://localhost:5000/stream/${filename}`}
                            type="video/webm"
                        />
                        Your browser does not support the video tag.
                    </video>
                </div>
            )}
        </Container>
    );
};

export default WebcamStream;
