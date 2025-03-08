import { useEffect, useRef, useState } from 'react';
import Peer, { MediaConnection } from 'peerjs';
import { useTheme } from "../stores/hooks";
import { Container } from './container';

function VideoChat() {
  const theme = useTheme().theme;
  const [peerId, setPeerId] = useState<string>('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState<string>('');
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const currentUserVideoRef = useRef<HTMLVideoElement>(null);
  const peerInstance = useRef<Peer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [fontSize, setFontSize] = useState(16); // Base font size
  const [isCallActive, setIsCallActive] = useState(false); // Track if the call is active

  useEffect(() => {
    const peer = new Peer();

    peer.on('open', (id: string) => setPeerId(id));

    peer.on('call', (call: MediaConnection) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((mediaStream) => {
        if (currentUserVideoRef.current) {
          currentUserVideoRef.current.srcObject = mediaStream;
          currentUserVideoRef.current.play();
        }
        call.answer(mediaStream);
        call.on('stream', (remoteStream: MediaStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play();
          }
        });
      });
      setIsCallActive(true); // Call started, set the call active flag
    });

    peerInstance.current = peer;
    return () => peer.destroy();
  }, []);

  const call = (remotePeerId: string) => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((mediaStream) => {
      if (currentUserVideoRef.current) {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
      }

      const call = peerInstance.current?.call(remotePeerId, mediaStream);
      call?.on('stream', (remoteStream: MediaStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        }
      });
      setIsCallActive(true); // Call started, set the call active flag
    });
  };

  const stopVideo = () => {
    const currentStream = currentUserVideoRef.current?.srcObject as MediaStream;
    currentStream?.getTracks().forEach((track) => track.stop()); // Stop all tracks
    setIsCallActive(false); // Call ended, set the call inactive flag
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        const width = entries[0].contentRect.width;
        const newFontSize = Math.max(12, width / 40); // Dynamically scale font size
        setFontSize(newFontSize);
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: theme === "dark" ? '#333' : '#f9f9f9',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: theme === "dark" ? '0 0 10px rgba(0, 0, 0, 0.5)' : '0 0 10px rgba(0, 0, 0, 0.1)',
    width: '80%',
    margin: 'auto',
    marginTop: '20px',
    fontSize: `${fontSize}px` // Apply dynamic font size
  };

  const inputStyle = {
    padding: '10px',
    borderRadius: '5px',
    border: theme === "dark" ? '1px solid #444' : '1px solid #ccc',
    width: '60%',
    backgroundColor: theme === "dark" ? '#555' : '#fff',
    color: theme === "dark" ? '#fff' : '#333',
    fontSize: `${fontSize * 0.8}px`
  };

  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: remotePeerIdValue ? (theme === "dark" ? '#555' : '#007bff') : '#ccc',
    color: '#fff',
    cursor: remotePeerIdValue ? 'pointer' : 'not-allowed',
    transition: 'background-color 0.3s',
    fontSize: `${fontSize}px`
  };

  const stopButtonStyle = {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: theme === "dark" ? '#e74c3c' : '#c0392b',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    fontSize: `${fontSize}px`
  };

  const videoStyle = {
    width: '80%',
    border: '1px solid black',
    borderRadius: '5px',
    marginBottom: '20px',
    backgroundColor: theme === "dark" ? '#444' : '#fff',
  };

  return (
    <Container maxWidth={1200} maxHeight={1200}>
      <div ref={containerRef} style={containerStyle}>
        <h1 style={{ marginBottom: '20px', color: theme === "dark" ? '#fff' : '#333', fontSize: `${fontSize * 1.5}px` }}>
          Video Chat
        </h1>

        {/* Hide the Peer ID input when the call starts */}
        {!isCallActive && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
              <label htmlFor="peerIdInput" style={{ fontSize: `${fontSize}px`, color: theme === "dark" ? '#fff' : '#333' }}>Your Peer ID:</label>
              <input id="peerIdInput" type="text" value={peerId} readOnly style={inputStyle} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
              <label htmlFor="remotePeerIdInput" style={{ fontSize: `${fontSize}px`, color: theme === "dark" ? '#fff' : '#333' }}>Remote Peer ID:</label>
              <input id="remotePeerIdInput" type="text" value={remotePeerIdValue} onChange={(e) => setRemotePeerIdValue(e.target.value)} placeholder="Enter Remote Peer ID" style={inputStyle} />
            </div>
          </>
        )}

        {/* Call/Stop button */}
        {!isCallActive ? (
          <button
            onClick={() => call(remotePeerIdValue)}
            disabled={!remotePeerIdValue}
            style={buttonStyle}
          >
            Call
          </button>
        ) : (
          <button
            onClick={stopVideo}
            style={stopButtonStyle}
          >
            Stop Video
          </button>
        )}

        {/* Video Display */}
        <div style={{ marginTop: '20px', width: '100%', textAlign: 'center' }}>
          <h2 style={{ color: theme === "dark" ? '#fff' : '#333', fontSize: `${fontSize * 1.2}px` }}>Your Video</h2>
          <video ref={currentUserVideoRef} autoPlay playsInline style={videoStyle} />
        </div>

        <div style={{ width: '100%', textAlign: 'center' }}>
          <h2 style={{ color: theme === "dark" ? '#fff' : '#333', fontSize: `${fontSize * 1.2}px` }}>Remote Video</h2>
          <video ref={remoteVideoRef} autoPlay playsInline style={videoStyle} />
        </div>
      </div>
    </Container>
  );
}

export default VideoChat;
