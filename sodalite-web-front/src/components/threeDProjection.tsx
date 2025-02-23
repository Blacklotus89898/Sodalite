import { useRef, useEffect, useState } from 'react';

const ThreeDProjection = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);
    const [angleX, setAngleX] = useState(0);
    const [angleY, setAngleY] = useState(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = 500;
        canvas.height = 500;

        const center = { x: canvas.width / 2, y: canvas.height / 2 };

        const points = [
            { x: 100, y: 0, z: 0 }, // X-axis
            { x: 0, y: 100, z: 0 }, // Y-axis
            { x: 0, y: 0, z: 100 }, // Z-axis
            { x: 50, y: 50, z: 50 } // New point
        ];

        const drawGrid = () => {
            const gridSpacing = 50;
            const gridLines = 20;

            // Draw horizontal grid lines
            ctx.strokeStyle = '#ccc';
            ctx.lineWidth = 0.5;
            for (let i = -gridLines; i < gridLines; i++) {
                ctx.beginPath();
                ctx.moveTo(center.x + i * gridSpacing, 0);
                ctx.lineTo(center.x + i * gridSpacing, canvas.height);
                ctx.stroke();
            }

            // Draw vertical grid lines
            for (let i = -gridLines; i < gridLines; i++) {
                ctx.beginPath();
                ctx.moveTo(0, center.y + i * gridSpacing);
                ctx.lineTo(canvas.width, center.y + i * gridSpacing);
                ctx.stroke();
            }
        };

        const drawAxes = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGrid(); // Draw the grid

            const cosX = Math.cos(angleX);
            const sinX = Math.sin(angleX);
            const cosY = Math.cos(angleY);
            const sinY = Math.sin(angleY);

            const transformedPoints = points.map(point => {
                const { x, y, z } = point;

                const yRotated = y * cosX - z * sinX;
                const zRotated = y * sinX + z * cosX;

                const xRotated = x * cosY + zRotated * sinY;

                return {
                    x: xRotated,
                    y: yRotated,
                    z: zRotated
                };
            });

            // Drawing the axes
            ctx.beginPath();
            ctx.moveTo(center.x, center.y);
            ctx.lineTo(center.x + transformedPoints[0].x, center.y - transformedPoints[0].y);
            ctx.strokeStyle = 'red';
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(center.x, center.y);
            ctx.lineTo(center.x + transformedPoints[1].x, center.y - transformedPoints[1].y);
            ctx.strokeStyle = 'green';
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(center.x, center.y);
            ctx.lineTo(center.x + transformedPoints[2].x, center.y - transformedPoints[2].y);
            ctx.strokeStyle = 'blue';
            ctx.stroke();

            // Drawing the new point
            ctx.beginPath();
            ctx.arc(center.x + transformedPoints[3].x, center.y - transformedPoints[3].y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = 'black';
            ctx.fill();
        };

        const animate = () => {
            drawAxes();
            requestAnimationFrame(animate);
        };

        animate(); // Start the animation loop

        const handleMouseDown = (e: MouseEvent) => {
            setIsDragging(true);
            setMouseX(e.clientX);
            setMouseY(e.clientY);
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setAngleY(prev => prev + (e.clientX - mouseX) * 0.01);
                setAngleX(prev => prev + (e.clientY - mouseY) * 0.01);
                setMouseX(e.clientX);
                setMouseY(e.clientY);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        const handleMouseLeave = () => {
            setIsDragging(false);
        };

        // Add event listeners to canvas
        if (canvas) {
            canvas.addEventListener('mousedown', handleMouseDown);
            canvas.addEventListener('mousemove', handleMouseMove);
            canvas.addEventListener('mouseup', handleMouseUp);
            canvas.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            // Cleanup event listeners on component unmount
            if (canvas) {
                canvas.removeEventListener('mousedown', handleMouseDown);
                canvas.removeEventListener('mousemove', handleMouseMove);
                canvas.removeEventListener('mouseup', handleMouseUp);
                canvas.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [angleX, angleY, isDragging, mouseX, mouseY]);

    return <canvas ref={canvasRef}></canvas>;
};

export default ThreeDProjection;
