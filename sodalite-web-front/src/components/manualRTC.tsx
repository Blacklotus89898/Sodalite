import React, { useState, useRef, useEffect } from 'react';
import { WebSocketService } from '../services/websocketService';
import { useServer } from '../stores/hooks';

function ManualRTC() {
    const [localDescription, setLocalDescription] = useState('');
    const [remoteDescription, setRemoteDescription] = useState('');
    const [remoteIceCandidate, setRemoteIceCandidate] = useState('');
    const [localIceCandidates, setLocalIceCandidates] = useState<string[]>([]);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);

    const wsServiceRef = useRef<WebSocketService | null>(null);
    const { address } = useServer();
    const [, setIsConnected] = useState<boolean>(false);
    const [isCaller, setIsCaller] = useState<boolean>(false);



    useEffect(() => {

        wsServiceRef.current = new WebSocketService(address['websocketServer']);

        const connectWebSocket = () => {
            wsServiceRef.current?.connect(async (data: unknown) => {
                console.log("Data received"+data);
                const parsedData = data as { type: string; message: string };
                setIsConnected(true); // Set connection status to true when successfully connected

                if (isCaller) {
                    console.log("Caller received:" + parsedData);
                    if (parsedData.type === "answer") {
                        console.log("Caller received sdp:"+ parsedData.message);
                        setRemoteDescription(parsedData.message);
                        await handleRemoteDescription(parsedData.message);
                    } if (parsedData.type === "answerIce") {
                        console.log("Caller received ice:"+ parsedData.message);
                        setRemoteIceCandidate(parsedData.message);
                    }
                } else {
                    if (parsedData.type === "offer") {
                    console.log("Before setting remote:", remoteDescription);
                    setRemoteDescription(parsedData.message);
                    await handleRemoteDescription(parsedData.message);
                    console.log("After setting remote:", remoteDescription);
                    await createAnswer();
                    } if (parsedData.type === "offerIce") {

                        setRemoteIceCandidate(parsedData.message);
                    }
                }
            });
        };

        connectWebSocket(); // Initial connection attempt
        setIsConnected(wsServiceRef.current.getConnectionStatus());


        // Peer connection
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
            if (wsServiceRef.current) {
                wsServiceRef.current.close();
            }
        };
    }, [isCaller, address]);

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


    const handleRemoteDescription = async (sdp?: string) => {
        if (sdp) {
            console.log("sdp:"+sdp);
            try {
                const remoteDesc = new RTCSessionDescription(JSON.parse(sdp));
                await peerConnectionRef.current?.setRemoteDescription(remoteDesc);
            } catch (error) {
                console.error('Error setting remote description:', error);
            }
        } else {
            try {
                if (!peerConnectionRef.current || !remoteDescription) return;
                const remoteDesc = new RTCSessionDescription(JSON.parse(remoteDescription));
                await peerConnectionRef.current.setRemoteDescription(remoteDesc);
            } catch (error) {
                console.error('Error setting remote description:', error);
            }
        }
    };

    const parseIceCandidates = (candidatesString: string) => {
        const candidatesArray = candidatesString.trim().split('\n').map(candidate => candidate.trim());
        return candidatesArray.map(candidate => JSON.parse(candidate));
    };

    const addIceCandidate = async () => {
        try {
            if (!peerConnectionRef.current || !remoteIceCandidate.trim()) return;

            const candidates = parseIceCandidates(remoteIceCandidate);

            for (const candidateData of candidates) {
                if (candidateData && candidateData.candidate) {
                    const iceCandidate = new RTCIceCandidate(candidateData);
                    await peerConnectionRef.current.addIceCandidate(iceCandidate);
                    console.log('Added ICE candidate:', candidateData);
                }
            }

            // alert('All ICE candidates added successfully!');
        } catch (error) {
            console.error('Error adding ICE candidate:', error);
            alert('Invalid ICE candidate format. Ensure it is a valid JSON array.');
        }
    };

    // const copyToClipboard = (text: string) => {
    //     navigator.clipboard.writeText(text).then(() => {
    //     }).catch(err => {
    //         console.error('Failed to copy: ', err);
    //     });
    // };

    const initiateCall = async () => {
        setIsCaller(true);
        // start local stream
        await startLocalStream();
        // create offer and set local description
        await createOffer();
    }

    useEffect(() => {
        if (isCaller && localDescription && localIceCandidates.length > 0) {
            // send local description and ICE candidates
            wsServiceRef.current?.send({ message: localDescription, type: "offer" });
            wsServiceRef.current?.send({ message: localIceCandidates.join('\n'), type: "offerIce" });
        }
        
    }, [localDescription, localIceCandidates, isCaller]);

    useEffect(() => {   
        const handleAnswer = async () => {
            if (!isCaller && localDescription && localIceCandidates.length > 0) {
                await sendAnswer();
            }
        };
        handleAnswer();
    }, [localDescription, localIceCandidates, isCaller]);

    useEffect(() => {
        if (remoteIceCandidate) {
            addIceCandidate();
        }
    }, [remoteIceCandidate]);

    // const sendOffer = async () => {
    //     wsServiceRef.current?.send({ message: localDescription, type: "offer" });
    //     wsServiceRef.current?.send({ message: localIceCandidates.join('\n'), type: "offerIce" });

    // }

    const acceptCall = async () => {
        setIsCaller(false);
        startLocalStream();
    }

    const sendAnswer = async () => {
        console.log("Sending answer");
        wsServiceRef.current?.send({ message: localDescription, type: "answer" });
        wsServiceRef.current?.send({ message: localIceCandidates.join("\n"), type: "answerIce" });
        // addIceCandidate();

    }



    return (
        <div className="ManualRTC">

            {/* <h1>Signaling Server Status ws {isConnected.toString()}</h1> */}
            {/* <h1>CaLLER Status {isCaller.toString()}</h1> */}
            {/* <button onClick={() => setIsConnected(wsServiceRef.current?.getConnectionStatus() ?? false)}>Refresh connection status</button> */}
            <button onClick={acceptCall}>Create Call</button>
            <button onClick={initiateCall}>Join Call</button>
            {/* <button onClick={sendOffer}>Offer Call</button> */}
            {/* <button onClick={sendAnswer}>Send answer</button> */}

            <h1>Manual WebRTC Signaling</h1>
            {/* <button onClick={startLocalStream}>Start Local Stream</button> */}

            <div>
                <video ref={localVideoRef} autoPlay playsInline muted></video>
                <video ref={remoteVideoRef} autoPlay playsInline></video>
            </div>
{/* 
            <div>
                <button onClick={createOffer}>Create Offer</button>
                <button onClick={createAnswer}>Create Answer</button>
                <button onClick={() => handleRemoteDescription()}>Set Remote Description</button>
                <button onClick={addIceCandidate}>Add ICE Candidate</button>
            </div> */}
{/* 
            <div>
                <h3>Local Description (Offer/Answer)</h3>
                <textarea value={localDescription} readOnly rows={5}></textarea>
                <button onClick={() => copyToClipboard(localDescription)}>Copy to Clipboard</button>

                <h3>Remote Description</h3>
                <textarea
                    value={remoteDescription}
                    onChange={(e) => setRemoteDescription(e.target.value)}
                    placeholder="Paste remote description here"
                    rows={5}
                ></textarea>
                <button onClick={() => copyToClipboard(remoteDescription)}>Copy to Clipboard</button>

                <h3>Remote ICE Candidate</h3>
                <textarea
                    value={remoteIceCandidate}
                    onChange={(e) => setRemoteIceCandidate(e.target.value)}
                    placeholder="Paste remote ICE candidate here"
                    rows={5}
                ></textarea>
                <button onClick={() => copyToClipboard(remoteIceCandidate)}>Copy to Clipboard</button>

                <h3>Local ICE Candidates (Copy and share these)</h3>
                <textarea
                    value={localIceCandidates.join('\n')}
                    readOnly
                    rows={5}
                ></textarea>
                <button onClick={() => copyToClipboard(localIceCandidates.join('\n'))}>Copy to Clipboard</button>
            </div> */}
        </div>
    );
}

export default ManualRTC;