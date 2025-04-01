import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../stores/hooks';

interface ContainerProps {
    children: React.ReactNode;
    maxWidth?: number;  // Optional max width prop
    maxHeight?: number; // Optional max height prop
}
export const Container: React.FC<ContainerProps> = ({ children, maxWidth, maxHeight }) => {
    const { theme, chroma } = useTheme();
    const isDarkMode = theme === 'dark';

    const [isHovered, setIsHovered] = useState(false);
    const [width, setWidth] = useState(400); // Safe starting size
    const [height, setHeight] = useState(300); // Safe starting size
    const [, setResizing] = useState(false);
    const [userResized, setUserResized] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    const updateSizeToFitParent = () => {
        const parent = containerRef.current?.parentElement;
        if (parent) {
            const { clientWidth, clientHeight } = parent;

            setWidth((prevWidth) => (userResized ? prevWidth : Math.min(clientWidth, maxWidth || clientWidth)));
            setHeight((prevHeight) => (userResized ? prevHeight : Math.min(clientHeight, maxHeight || clientHeight)));
        }
    };

    useEffect(() => {
        updateSizeToFitParent();

        const parent = containerRef.current?.parentElement;
        if (!parent) return;

        const resizeObserver = new ResizeObserver(() => {
            updateSizeToFitParent();
        });

        resizeObserver.observe(parent);

        return () => resizeObserver.disconnect();
    }, [userResized]);

    const containerStyle: React.CSSProperties = {
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        color: isDarkMode ? 'white' : 'black',
        border: isHovered ? `4px solid ${chroma}` : '4px solid transparent',
        borderRadius: '15px',
        padding: '16px',
        boxShadow: isDarkMode
            ? '0px 4px 12px rgba(0, 0, 0, 0.6)'
            : '0px 4px 12px rgba(200, 200, 200, 0.6)',
        transition: 'background-color 0.3s ease, color 0.3s ease, border 0.3s ease',
        width: `${width}px`,
        height: `${height}px`,
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        maxWidth: '100%',
        maxHeight: '100%',
    };

    const resizeHandleStyle: React.CSSProperties = {
        position: 'absolute',
        width: '16px',
        height: '16px',
        backgroundColor:isHovered ? `${chroma}`: "transparent",
        bottom: '0',
        right: '0',
        cursor: 'nwse-resize',
        borderTopLeftRadius: '4px',
    };

    const startResize = (e: React.MouseEvent) => {
        e.preventDefault();
        setResizing(true);
        setUserResized(true);

        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', stopResize);
    };

    const handleResize = (e: MouseEvent) => {
        const parent = containerRef.current?.parentElement;
        if (!parent) return;

        const maxWidth = parent.clientWidth;
        const maxHeight = parent.clientHeight;

        setWidth((prevWidth) => Math.min(maxWidth, Math.max(200, prevWidth + e.movementX)));
        setHeight((prevHeight) => Math.min(maxHeight, Math.max(150, prevHeight + e.movementY)));
    };

    const stopResize = () => {
        setResizing(false);
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);
    };

    return (
        <div
            ref={containerRef}
            style={containerStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
            <div style={resizeHandleStyle} onMouseDown={startResize} />
        </div>
    );
};
