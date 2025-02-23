import React, { useRef, useEffect } from 'react';

interface GraphComponentProps {
    xValues: number[];
    yValues: number[];
    type?: 'line' | 'histogram';
}

const GraphComponent: React.FC<GraphComponentProps> = ({ xValues, yValues, type = 'line' }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const padding = 40;
        const width = canvas.width;
        const height = canvas.height;

        // Clear the canvas
        ctx.clearRect(0, 0, width, height);

        // Find the maximum and minimum values for scaling the axis
        const maxValue = Math.max(...yValues);
        const minValue = Math.min(...yValues);
        const maxXValue = Math.max(...xValues);
        const minXValue = Math.min(...xValues);

        // Calculate the scale
        const xScale = (width - 2 * padding) / (maxXValue - minXValue);
        const yScale = (height - 2 * padding) / (maxValue - minValue);

        // Draw axes
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();

        // Draw axis values
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // X-axis values
        xValues.forEach((x) => {
            const xPos = padding + (x - minXValue) * xScale;
            ctx.fillText(x.toString(), xPos, height - padding + 20);
        });

        // Y-axis values
        const yStep = (maxValue - minValue) / 10;
        for (let i = 0; i <= 10; i++) {
            const yValue = minValue + i * yStep;
            const yPos = height - padding - (yValue - minValue) * yScale;
            ctx.fillText(yValue.toFixed(2), padding - 20, yPos);
        }

        // Draw graph
        if (type === 'line') {
            ctx.beginPath();
            ctx.moveTo(padding + (xValues[0] - minXValue) * xScale, height - padding - (yValues[0] - minValue) * yScale);
            xValues.forEach((x, i) => {
                ctx.lineTo(padding + (x - minXValue) * xScale, height - padding - (yValues[i] - minValue) * yScale);
            });
            ctx.strokeStyle = 'blue';
            ctx.stroke();
        } else if (type === 'histogram') {
            const barWidth = xScale * 0.8;
            xValues.forEach((x, i) => {
                const barHeight = (yValues[i] - minValue) * yScale;
                ctx.fillStyle = 'blue';
                ctx.fillRect(padding + (x - minXValue) * xScale - barWidth / 2, height - padding - barHeight, barWidth, barHeight);
            });
        }
    }, [xValues, yValues, type]);

    return <canvas ref={canvasRef} width={600} height={400} />;
};

export default GraphComponent;
