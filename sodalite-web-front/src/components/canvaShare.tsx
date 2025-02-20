import React, { useEffect, useRef } from 'react';
import { Container } from './container';

export const CanvaShare: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const isDrawing = useRef(false);
    const wsRef = useRef<WebSocket | null>(null);

    // make it a togglable feature for websocket or not
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Initialize WebSocket connection
        wsRef.current = new WebSocket('ws://192.168.0.103:8080');

        // Handle incoming messages
        wsRef.current.onmessage = async event => {
            console.log('Received data:', event.data); // Log the received data
            try {
                const text = await event.data.text();
                const data = JSON.parse(text);
                drawFromServer(data, ctx);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        };

        const drawFromServer = (data: { startX: number, startY: number, x: number, y: number }, ctx: CanvasRenderingContext2D) => {
            ctx.beginPath();
            ctx.moveTo(data.startX, data.startY);
            ctx.lineTo(data.x, data.y);
            ctx.strokeStyle = '#000000'; // Change color as needed
            ctx.lineWidth = 5; // Change brush size as needed
            ctx.lineCap = 'round'; // Round the ends of the lines
            ctx.stroke();
            ctx.closePath();
        };

        const getTouchPos = (e: TouchEvent) => {
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            return {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top
            };
        };

        const startDrawing = (e: MouseEvent | TouchEvent) => {
            isDrawing.current = true;
            ctx.beginPath();
            if (e instanceof MouseEvent) {
                ctx.moveTo(e.offsetX, e.offsetY);
            } else {
                const pos = getTouchPos(e);
                ctx.moveTo(pos.x, pos.y);
            }
        };

        const draw = (e: MouseEvent | TouchEvent) => {
            if (!isDrawing.current) return;
            let pos;
            if (e instanceof MouseEvent) {
                pos = { x: e.offsetX, y: e.offsetY };
            } else {
                pos = getTouchPos(e);
            }

            ctx.lineTo(pos.x, pos.y);
            ctx.strokeStyle = '#000000'; // Change color as needed
            ctx.lineWidth = 5; // Change brush size as needed
            ctx.lineCap = 'round'; // Round the ends of the lines
            ctx.stroke();

            // Send drawing data to server
            if (wsRef.current) {
                wsRef.current.send(JSON.stringify({
                    startX: pos.x,
                    startY: pos.y,
                    x: pos.x,
                    y: pos.y
                }));
            }
        };

        const stopDrawing = () => {
            if (!isDrawing.current) return;
            isDrawing.current = false;
            ctx.closePath();
        };

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        canvas.addEventListener('touchstart', startDrawing);
        canvas.addEventListener('touchmove', draw);
        canvas.addEventListener('touchend', stopDrawing);
        canvas.addEventListener('touchcancel', stopDrawing);

        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseout', stopDrawing);

            canvas.removeEventListener('touchstart', startDrawing);
            canvas.removeEventListener('touchmove', draw);
            canvas.removeEventListener('touchend', stopDrawing);
            canvas.removeEventListener('touchcancel', stopDrawing);

            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    return (
        <div>
            <h1>Canva Share Component</h1>
            <Container>
            <canvas id="canvas" ref={canvasRef}></canvas>
            </Container>
        </div>
    );
};
