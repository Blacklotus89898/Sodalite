    import React, { useRef, useState, useEffect } from "react";

    const ObjectTracking: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [orientation, setOrientation] = useState<{ alpha: number; beta: number; gamma: number }>({
        alpha: 0,
        beta: 0,
        gamma: 0,
    });

    const [inputSet, setInputSet] = useState(false);
    const [center, setCenter] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [textValue, setTextValue] = useState("");

    // Camera selection state
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);

    // Fetch camera devices
    useEffect(() => {
        const getDevices = async () => {
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter((d) => d.kind === "videoinput");
        setDevices(videoDevices);
        if (videoDevices.length > 0 && !selectedDeviceId) {
            setSelectedDeviceId(videoDevices[0].deviceId);
        }
        };
        getDevices();
    }, [selectedDeviceId]);

    // Start camera when device changes
    useEffect(() => {
        const startCamera = async () => {
        if (!selectedDeviceId) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: selectedDeviceId } },
            audio: false,
            });
            if (videoRef.current) {
            videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
        }
        };
        startCamera();
        // Cleanup: stop previous stream
        return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach((track) => track.stop());
        }
        };
    }, [selectedDeviceId]);

    // Device orientation event listener
    useEffect(() => {
        const handleOrientation = (event: DeviceOrientationEvent) => {
        const alpha = event.alpha ?? 0;
        const beta = event.beta ?? 0;
        const gamma = event.gamma ?? 0;
        setOrientation({ alpha, beta, gamma });

        if (inputSet && inputRef.current && containerRef.current) {
            const container = containerRef.current;
            const { offsetWidth: width, offsetHeight: height } = container;

            const maxTilt = 20;
            const offsetX = (gamma / maxTilt) * (width / 4);
            const offsetY = (beta / maxTilt) * (height / 4);

            const newX = center.x + offsetX;
            const newY = center.y + offsetY;

            // Apply translation + rotation around center with alpha + initial 90deg vertical
            inputRef.current.style.transform = `translate(${newX}px, ${newY}px) translate(-50%, -50%) rotate(${alpha + 90}deg) rotateX(180deg) rotateY(180deg)`;
        }
        };

        if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
        ) {
        // @ts-ignore
        DeviceOrientationEvent.requestPermission()
            .then((response: any) => {
            if (response === "granted") {
                window.addEventListener("deviceorientation", handleOrientation);
            }
            })
            .catch(console.error);
        } else {
        window.addEventListener("deviceorientation", handleOrientation);
        }

        return () => {
        window.removeEventListener("deviceorientation", handleOrientation);
        };
    }, [inputSet, center]);

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const bounds = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top - 500;

        setCenter({ x, y });
        setInputSet(true);

        if (inputRef.current) {
        // Initial transform with +90deg rotation to be vertical
        inputRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotateX(180deg) rotateY(180deg)`;
        }
    };

    // Camera dropdown handler
    const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDeviceId(e.target.value);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Camera selection dropdown */}
        <div style={{ marginBottom: "1rem", width: "100%", maxWidth: "600px" }}>
            <label>
            Select Camera:&nbsp;
            <select value={selectedDeviceId} onChange={handleDeviceChange}>
                {devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${device.deviceId.slice(-4)}`}
                </option>
                ))}
            </select>
            </label>
        </div>

        <div
            ref={containerRef}
            onClick={handleClick}
            style={{
            position: "relative",
            width: "100%",
            maxWidth: "600px",
            aspectRatio: "3/4",
            overflow: "hidden",
            borderRadius: "12px",
            backgroundColor: "black",
            }}
        >
            <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {inputSet && (
            <textarea
                ref={inputRef}
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                rows={3}
                style={{
                position: "absolute",
                width: "180px",
                height: "90px",
                padding: "8px",
                borderRadius: "8px",
                border: "2px solid white",
                outline: "none",
                resize: "none",
                fontSize: "14px",
                backgroundColor: "rgba(255,255,255,0.9)",
                color: "#000",
                boxShadow: "0 0 6px rgba(0,0,0,0.5)",
                transformOrigin: "center center",
                pointerEvents: "auto",
                top: 0,
                left: 0,
                userSelect: "text",
                transition: "transform 0.1s linear",
                }}
            />
            )}
        </div>

        <div
            style={{
            padding: "0.5rem",
            fontFamily: "Arial",
            textAlign: "left",
            width: "100%",
            maxWidth: "600px",
            }}
        >
            <p>
            <strong>Alpha (Z rotation):</strong> {orientation.alpha.toFixed(2)}
            </p>
            <p>
            <strong>Beta (X tilt):</strong> {orientation.beta.toFixed(2)}
            </p>
            <p>
            <strong>Gamma (Y tilt):</strong> {orientation.gamma.toFixed(2)}
            </p>
        </div>
        </div>
    );
    };

    export default ObjectTracking;
