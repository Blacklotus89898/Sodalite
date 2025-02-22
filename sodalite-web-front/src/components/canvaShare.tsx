import React, { useEffect, useRef } from 'react';
import { Container } from './container';
import { WebSocketService } from '../services/websocketService';
import { useServer } from '../stores/hooks';

export const CanvaShare: React.FC = () => {
    const { address } = useServer();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const isDrawing = useRef(false);
    const wsServiceRef = useRef<WebSocketService | null>(null);

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
        };
    }, [address]);

    return (
        <div>
            <h1>Canva Share Component</h1>
            <Container>
                <canvas id="canvas" ref={canvasRef}></canvas>
            </Container>
        </div>
    );
};