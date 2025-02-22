import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { WebSocketService } from '../services/websocketService';

const CollabApp: React.FC = () => {
    const [content, setContent] = useState('');
    const wsServiceRef = useRef<WebSocketService | null>(null);

    useEffect(() => {
        wsServiceRef.current = new WebSocketService('ws://localhost:8080');
        wsServiceRef.current.connect((data: unknown) => {
            const parsedData = data as { content: string };
            setContent(parsedData.content);
        });

        return () => {
            if (wsServiceRef.current) {
                wsServiceRef.current.close();
            }
        };
    }, []);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);

        if (wsServiceRef.current) {
            wsServiceRef.current.send({ content: newContent, group: 'collab' });
        }
    };

    return (
        <div>
            <h1>Collaborative Text Editor</h1>
            <textarea
                value={content}
                onChange={handleChange}
                rows={10}
                cols={50}
                placeholder="Type your text here..."
            ></textarea>
        </div>
    );
};

export default CollabApp;