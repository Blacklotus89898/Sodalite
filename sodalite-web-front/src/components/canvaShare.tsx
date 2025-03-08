import React, { useEffect, useRef } from 'react';
import { Container } from './container';
import { WebSocketService } from '../services/websocketService';
import { useServer, useTheme } from '../stores/hooks';

export const CanvaShare: React.FC = () => {
    const { address } = useServer();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const isDrawing = useRef(false);
    const wsServiceRef = useRef<WebSocketService | null>(null);
    const { theme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Initialize WebSocket service
        wsServiceRef.current = new WebSocketService(address['websocketServer']);
        wsServiceRef.current.connect((data) => drawFromServer(data as { startX: number, startY: number, x: number, y: number }, ctx));

        const drawFromServer = (data: { startX: number, startY: number, x: number, y: number }, ctx: CanvasRenderingContext2D) => {
            ctx.beginPath();
            ctx.moveTo(data.startX, data.startY);
            ctx.lineTo(data.x, data.y);
            ctx.strokeStyle = theme === 'dark' ? 'white' : 'black'; // Change color based on theme
            ctx.lineWidth = 5; // Change brush size as needed
            ctx.lineCap = 'round'; // Round the ends of the lines
            ctx.stroke();
            ctx.closePath();
        };

        const getTouchPos = (e: TouchEvent | MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width; // Scale factor for width
            const scaleY = canvas.height / rect.height; // Scale factor for height

            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

            // Adjust for scaling
            const x = (clientX - rect.left) * scaleX;
            const y = (clientY - rect.top) * scaleY;

            return { x, y };
        };

        const startDrawing = (e: MouseEvent | TouchEvent) => {
            isDrawing.current = true;
            const pos = getTouchPos(e);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        };

        const draw = (e: MouseEvent | TouchEvent) => {
            if (!isDrawing.current) return;
            const pos = getTouchPos(e);

            ctx.lineTo(pos.x, pos.y);
            ctx.strokeStyle = theme === 'dark' ? 'white' : 'black'; // Change color based on theme
            ctx.lineWidth = 5; // Change brush size as needed
            ctx.lineCap = 'round'; // Round the ends of the lines
            ctx.stroke();

            // Send drawing data to server
            if (wsServiceRef.current) {
                wsServiceRef.current.send({
                    group: 'drawing',
                    startX: pos.x,
                    startY: pos.y,
                    x: pos.x,
                    y: pos.y
                });
            }
        };

        const stopDrawing = () => {
            if (!isDrawing.current) return;
            isDrawing.current = false;
            ctx.closePath();
        };

        // Set canvas size dynamically to fill the parent container
        const resizeCanvas = () => {
            if (canvas) {
                canvas.width = canvas.parentElement?.clientWidth || 800; // Set width based on parent container
                canvas.height = canvas.parentElement?.clientHeight || 600; // Set height based on parent container
            }
        };

        // Resize canvas when window is resized
        window.addEventListener('resize', resizeCanvas);

        resizeCanvas(); // Set initial size

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

            if (wsServiceRef.current) {
                wsServiceRef.current.close();
            }

            window.removeEventListener('resize', resizeCanvas);
        };
    }, [address, theme]); // Add theme as a dependency

    return (
        <Container maxWidth={1000} maxHeight={800}>
            <h1>Canva Share Component</h1>
            <canvas id="canvas" ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }}></canvas>
        </Container>
    );
};