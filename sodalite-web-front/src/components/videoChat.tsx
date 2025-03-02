import { useEffect, useRef, useState } from 'react';
import Peer, { MediaConnection } from 'peerjs';
import { useTheme } from "../stores/hooks"; // Assuming useTheme hook is defined in your stores/hooks file

function VideoChat() {
  const theme = useTheme().theme; // Get the current theme (dark or light)

  // States to manage peer ID, remote peer ID input, and references for video elements
  const [peerId, setPeerId] = useState<string>('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState<string>('');
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const currentUserVideoRef = useRef<HTMLVideoElement>(null);
  const peerInstance = useRef<Peer | null>(null);

  useEffect(() => {
    // Initialize PeerJS
    const peer = new Peer();

    // On Peer connection open, set the peer ID
    peer.on('open', (id: string) => {
      setPeerId(id);
    });

    // Handling incoming calls
    peer.on('call', (call: MediaConnection) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          // Display the current user's video
          if (currentUserVideoRef.current) {
            currentUserVideoRef.current.srcObject = mediaStream;
            currentUserVideoRef.current.play();
          }
          // Answer the call with user's media stream
          call.answer(mediaStream);
          // On receiving remote stream, display it
          call.on('stream', (remoteStream: MediaStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
              remoteVideoRef.current.play();
            }
          });
        })
        .catch((err) => {
          console.error('Failed to get media: ', err);
        });
    });

    // Store the peer instance for later use
    peerInstance.current = peer;

    // Cleanup function to destroy the peer instance when component unmounts
    return () => {
      peer.destroy();
    };
  }, []);

  // Function to initiate a call to a remote peer
  const call = (remotePeerId: string) => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        // Display the current user's video
        if (currentUserVideoRef.current) {
          currentUserVideoRef.current.srcObject = mediaStream;
          currentUserVideoRef.current.play();
        }

        // Make a call to the remote peer with the media stream
        const call = peerInstance.current?.call(remotePeerId, mediaStream);

        // On receiving remote stream, display it
        call?.on('stream', (remoteStream: MediaStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play();
          }
        });
      })
      .catch((err) => {
        console.error('Failed to get media: ', err);
      });
  };

  // Dynamic styles based on the current theme
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: theme === "dark" ? '#333' : '#f9f9f9', // Dynamic background
    padding: '20px',
    borderRadius: '10px',
    boxShadow: theme === "dark" ? '0 0 10px rgba(0, 0, 0, 0.5)' : '0 0 10px rgba(0, 0, 0, 0.1)', // Adjust shadow for dark mode
    width: '80%',
    margin: 'auto',
    marginTop: '20px',
  };

  const inputStyle = {
    padding: '10px',
    borderRadius: '5px',
    border: theme === "dark" ? '1px solid #444' : '1px solid #ccc', // Border color changes based on theme
    width: '60%',
    backgroundColor: theme === "dark" ? '#555' : '#fff', // Input background
    color: theme === "dark" ? '#fff' : '#333', // Text color
  };

  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: remotePeerIdValue ? '#007bff' : '#ccc',
    color: '#fff',
    cursor: remotePeerIdValue ? 'pointer' : 'not-allowed',
    transition: 'background-color 0.3s',
    backgroundColor: theme === "dark" ? '#555' : '#007bff', // Button color based on theme
  };

  const videoStyle = {
    width: '80%',
    border: '1px solid black',
    borderRadius: '5px',
    marginBottom: '20px',
    backgroundColor: theme === "dark" ? '#444' : '#fff', // Video background to match theme
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: '20px', color: theme === "dark" ? '#fff' : '#333' }}>Video Chat</h1>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
        gap: '10px',
      }}>
        <label htmlFor="peerIdInput" style={{ fontSize: '16px', color: theme === "dark" ? '#fff' : '#333' }}>Your Peer ID:</label>
        <input
          id="peerIdInput"
          type="text"
          value={peerId}
          readOnly
          style={inputStyle}
        />
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
        gap: '10px',
      }}>
        <label htmlFor="remotePeerIdInput" style={{ fontSize: '16px', color: theme === "dark" ? '#fff' : '#333' }}>Remote Peer ID:</label>
        <input
          id="remotePeerIdInput"
          type="text"
          value={remotePeerIdValue}
          onChange={(e) => setRemotePeerIdValue(e.target.value)}
          placeholder="Enter Remote Peer ID"
          style={inputStyle}
        />
      </div>

      <button
        onClick={() => call(remotePeerIdValue)}
        disabled={!remotePeerIdValue}
        style={buttonStyle}
        onMouseOver={(e) => remotePeerIdValue && ((e.target as HTMLButtonElement).style.backgroundColor = '#0056b3')}
        onMouseOut={(e) => remotePeerIdValue && ((e.target as HTMLButtonElement).style.backgroundColor = '#007bff')}
      >
        Call
      </button>

      <div style={{ marginTop: '20px', width: '100%', textAlign: 'center' }}>
        <h2 style={{ color: theme === "dark" ? '#fff' : '#333' }}>Your Video</h2>
        <video ref={currentUserVideoRef} autoPlay playsInline style={videoStyle} />
      </div>

      <div style={{ width: '100%', textAlign: 'center' }}>
        <h2 style={{ color: theme === "dark" ? '#fff' : '#333' }}>Remote Video</h2>
        <video ref={remoteVideoRef} autoPlay playsInline style={videoStyle} />
      </div>
    </div>
  );
}

export default VideoChat;
