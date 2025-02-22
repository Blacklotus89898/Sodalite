import React, { useEffect, useRef, useState } from 'react';
import { WebSocketService } from '../services/websocketService';
import { useServer } from '../stores/hooks';

export const ChatApp: React.FC = () => {
  const { address } = useServer();
  const [messages, setMessages] = useState<{ message: string; group: string }[]>([]);
  const [input, setInput] = useState<string>('');
  const [group, setGroup] = useState<string>('default');
  const wsServiceRef = useRef<WebSocketService | null>(null);

  useEffect(() => {
    // Initialize WebSocket service
    wsServiceRef.current = new WebSocketService(address['websocketServer']);

    wsServiceRef.current.connect((data) => {
      console.log('Received:', data);
      setMessages((prevMessages) => [...prevMessages, data as { message: string; group: string }]);
    });

    return () => {
      if (wsServiceRef.current) {
        wsServiceRef.current.close();
      }
    };
  }, [address]);

  const sendMessage = () => {
    if (wsServiceRef.current && input.trim()) {
      wsServiceRef.current.send({ message: input, group: group });
      setInput('');
    }
  };

  return (
    <div>
      <h1>Chat App</h1>
      <div>
        <div>
          <label>
            Group:
            <input
              type="text"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
            />
          </label>
        </div>
        <div>
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.group}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};