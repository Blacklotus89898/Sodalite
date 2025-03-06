import React, { useState, useRef, useEffect } from 'react';

// Serveless implementation, need to fix the ice candidate
function ManualRTC() {
    const [localDescription, setLocalDescription] = useState('');
    const [remoteDescription, setRemoteDescription] = useState('');
    const [remoteIceCandidate, setRemoteIceCandidate] = useState('');
    const [localIceCandidates, setLocalIceCandidates] = useState<string[]>([]);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        const pc = new RTCPeerConnection();
        peerConnectionRef.current = pc;

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                const candidateStr = JSON.stringify(event.candidate);
                setLocalIceCandidates(prev => [...prev, candidateStr]);
                console.log('New ICE candidate:', candidateStr);
            }
        };

        pc.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        return () => {
            pc.close();
            peerConnectionRef.current = null;
            localStreamRef.current?.getTracks().forEach(track => track.stop());
        };
    }, []);

    const startLocalStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            stream.getTracks().forEach(track => {
                peerConnectionRef.current?.addTrack(track, stream);
            });
        } catch (error) {
            console.error('Error accessing media devices:', error);
        }
    };

    const createOffer = async () => {
        try {
            if (!peerConnectionRef.current) return;
            const offer = await peerConnectionRef.current.createOffer();
            await peerConnectionRef.current.setLocalDescription(offer);
            setLocalDescription(JSON.stringify(offer));
        } catch (error) {
            console.error('Error creating offer:', error);
        }
    };

    const createAnswer = async () => {
        try {
            if (!peerConnectionRef.current) return;
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);
            setLocalDescription(JSON.stringify(answer));
        } catch (error) {
            console.error('Error creating answer:', error);
        }
    };

    const handleRemoteDescription = async () => {
        try {
            if (!peerConnectionRef.current || !remoteDescription) return;
            const remoteDesc = new RTCSessionDescription(JSON.parse(remoteDescription));
            await peerConnectionRef.current.setRemoteDescription(remoteDesc);
        } catch (error) {
            console.error('Error setting remote description:', error);
        }
    };

    const addIceCandidate = async () => {
        try {
            if (!peerConnectionRef.current || !remoteIceCandidate.trim()) return;
    
            let candidates = JSON.parse(remoteIceCandidate);
    
            // Ensure candidates is an array (if single candidate, wrap in an array)
            if (!Array.isArray(candidates)) {
                candidates = [candidates];
            }
    
            for (const candidateData of candidates) {
                if (candidateData && candidateData.candidate) {
                    const iceCandidate = new RTCIceCandidate(candidateData);
                    await peerConnectionRef.current.addIceCandidate(iceCandidate);
                    console.log('Added ICE candidate:', candidateData);
                }
            }
    
            alert('All ICE candidates added successfully!');
        } catch (error) {
            console.error('Error adding ICE candidate:', error);
            alert('Invalid ICE candidate format. Ensure it is a valid JSON array.');
        }
    };
    
    

    return (
        <div className="ManualRTC">
            <h1>Manual WebRTC Signaling</h1>
            <button onClick={startLocalStream}>Start Local Stream</button>

            <div>
                <video ref={localVideoRef} autoPlay playsInline muted></video>
                <video ref={remoteVideoRef} autoPlay playsInline></video>
            </div>

            <div>
                <button onClick={createOffer}>Create Offer</button>
                <button onClick={createAnswer}>Create Answer</button>
                <button onClick={handleRemoteDescription}>Set Remote Description</button>
                <button onClick={addIceCandidate}>Add ICE Candidate</button>
            </div>

            <div>
                <h3>Local Description (Offer/Answer)</h3>
                <textarea value={localDescription} readOnly rows={5}></textarea>

                <h3>Remote Description</h3>
                <textarea
                    value={remoteDescription}
                    onChange={(e) => setRemoteDescription(e.target.value)}
                    placeholder="Paste remote description here"
                    rows={5}
                ></textarea>

                <h3>Remote ICE Candidate</h3>
                <textarea
                    value={remoteIceCandidate}
                    onChange={(e) => setRemoteIceCandidate(e.target.value)}
                    placeholder="Paste remote ICE candidate here"
                    rows={5}
                ></textarea>

                <h3>Local ICE Candidates (Copy and share these)</h3>
                <textarea
                    value={localIceCandidates.join('\n')}
                    readOnly
                    rows={5}
                ></textarea>
            </div>
        </div>
    );
}

export default ManualRTC;
