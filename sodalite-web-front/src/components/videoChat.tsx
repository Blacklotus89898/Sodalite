import { useEffect, useRef, useState } from 'react';
import Peer, { MediaConnection } from 'peerjs';

function VideoChat() {
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

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f9f9f9',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      width: '80%',
      margin: 'auto',
      marginTop: '20px'
    }}>
      <h1 style={{ marginBottom: '20px' }}>Video Chat</h1>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
        gap: '10px'
      }}>
        <label htmlFor="peerIdInput" style={{ fontSize: '16px' }}>Your Peer ID:</label>
        <input
          id="peerIdInput"
          type="text"
          value={peerId}
          readOnly
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '60%'
          }}
        />
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
        gap: '10px'
      }}>
        <label htmlFor="remotePeerIdInput" style={{ fontSize: '16px' }}>Remote Peer ID:</label>
        <input
          id="remotePeerIdInput"
          type="text"
          value={remotePeerIdValue}
          onChange={(e) => setRemotePeerIdValue(e.target.value)}
          placeholder="Enter Remote Peer ID"
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '60%'
          }}
        />
      </div>
      <button
        onClick={() => call(remotePeerIdValue)}
        disabled={!remotePeerIdValue}
        style={{
          padding: '10px 20px',
          borderRadius: '5px',
          border: 'none',
          backgroundColor: remotePeerIdValue ? '#007bff' : '#ccc',
          color: '#fff',
          cursor: remotePeerIdValue ? 'pointer' : 'not-allowed',
          transition: 'background-color 0.3s'
        }}
        onMouseOver={(e) => remotePeerIdValue && ((e.target as HTMLButtonElement).style.backgroundColor = '#0056b3')}
        onMouseOut={(e) => remotePeerIdValue && ((e.target as HTMLButtonElement).style.backgroundColor = '#007bff')}
      >
        Call
      </button>
      <div style={{ marginTop: '20px', width: '100%', textAlign: 'center' }}>
        <h2>Your Video</h2>
        <video ref={currentUserVideoRef} autoPlay playsInline style={{ width: '80%', border: '1px solid black', borderRadius: '5px', marginBottom: '20px' }} />
      </div>
      <div style={{ width: '100%', textAlign: 'center' }}>
        <h2>Remote Video</h2>
        <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '80%', border: '1px solid black', borderRadius: '5px' }} />
      </div>
    </div>
  );
}

export default VideoChat;
