import React, { useEffect, useRef, useState } from 'react';

const WebRTCStreamer: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const [transform, setTransform] = useState<string>('grayscale');
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    // Enumerate video devices on mount
    const enumerateCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(device => device.kind === 'videoinput');
        setVideoDevices(videoInputs);

        // Auto-select environment camera if available
        const envCam = videoInputs.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('environment'));
        setSelectedDeviceId(envCam?.deviceId || videoInputs[0]?.deviceId || null);
      } catch (err) {
        console.error('Failed to enumerate devices', err);
      }
    };
    enumerateCameras();
  }, []);

  const startWebRTC = async () => {
    try {
      if (!selectedDeviceId) {
        throw new Error('No video device selected');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: selectedDeviceId } },
        audio: false,
      });
      console.log('Local media stream obtained');
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });
      pcRef.current = pc;

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.ontrack = (event: RTCTrackEvent) => {
        if (event.streams && event.streams[0] && remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
        if (event.candidate) {
          console.log('Sending ICE candidate:', event.candidate);
          // Send to signaling server here if needed
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const response = await fetch('http://192.168.0.101:8081/offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sdp: pc.localDescription?.sdp,
          type: pc.localDescription?.type,
          transform: transform,
        }),
      });

      const answer = await response.json();
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('Error during WebRTC setup:', error);
    }
  };

  return (
    <div>
      <h2>WebRTC Video Stream</h2>

      <label htmlFor="camera">Select Camera:</label>
      <select
        id="camera"
        value={selectedDeviceId || ''}
        onChange={(e) => setSelectedDeviceId(e.target.value)}
      >
        {videoDevices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Camera ${device.deviceId}`}
          </option>
        ))}
      </select>

      <label htmlFor="transform">Select Transformation:</label>
      <select
        id="transform"
        value={transform}
        onChange={(e) => setTransform(e.target.value)}
      >
        <option value="grayscale">Grayscale</option>
        <option value="edge">Edge Detection</option>
        <option value="blur">Blur</option>
      </select>

      <button onClick={startWebRTC}>Start Streaming</button>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <video ref={localVideoRef} autoPlay muted playsInline style={{ width: '45%' }} />
        <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '45%' }} />
      </div>
    </div>
  );
};

export default WebRTCStreamer;
