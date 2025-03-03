import React, { useEffect, useRef, useState } from 'react';
import { WebSocketService } from '../services/websocketService';
import { useServer, useTheme } from '../stores/hooks';
import { Container } from './container';

export const ChatApp: React.FC = () => {
  const { address } = useServer();
  const { theme, chroma } = useTheme();
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

  // Dynamic font sizes based on screen width
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const baseFontSize = Math.max(0.2, width * 0.01); // 2% of container width

  const containerStyle: React.CSSProperties = {
    backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)',
    color: theme === 'dark' ? 'white' : 'black',
    borderRadius: '10px',
    padding: '20px',
    maxWidth: '500px',
    margin: 'auto',
    boxShadow: theme === 'dark' ? '0px 4px 10px rgba(0, 0, 0, 0.3)' : '0px 4px 10px rgba(200, 200, 200, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    fontSize: baseFontSize,
  };

  const inputStyle: React.CSSProperties = {
    padding: '10px',
    borderRadius: '5px',
    border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'}`,
    backgroundColor: 'transparent',
    color: theme === 'dark' ? 'white' : 'black',
    fontSize: baseFontSize * 0.9,
    outline: 'none',
    transition: 'border 0.3s ease',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: chroma,
    color: theme === 'dark' ? 'black' : 'white',
    border: 'none',
    padding: '12px',
    fontSize: baseFontSize,
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background 0.3s ease-in-out, color 0.3s ease-in-out',
  };

  const messageStyle: React.CSSProperties = {
    padding: '10px',
    backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    borderRadius: '5px',
    fontSize: baseFontSize * 0.9,
    marginBottom: '8px',
  };

  const groupStyle: React.CSSProperties = {
    fontWeight: 'bold',
    marginRight: '5px',
  };

  return (
    <Container>
    <div style={containerStyle}>
      <h1 style={{ textAlign: 'center', fontSize: baseFontSize * 1.2, marginBottom: '20px' }}>
        Chat App
      </h1>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: baseFontSize }}>Group:</label>
        <input
          type="text"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          style={inputStyle}
          onMouseOver={(e) => e.currentTarget.style.border = `1px solid ${chroma}`}
          onMouseOut={(e) => e.currentTarget.style.border = `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'}`}
        />
      </div>

      <div style={{ maxHeight: '300px', overflowY: 'scroll', marginBottom: '15px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={messageStyle}>
            <span style={groupStyle}>{msg.group}:</span> {msg.message}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
          style={inputStyle}
          onMouseOver={(e) => e.currentTarget.style.border = `1px solid ${chroma}`}
          onMouseOut={(e) => e.currentTarget.style.border = `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'}`}
        />
        <button
          onClick={sendMessage}
          style={buttonStyle}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = chroma}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = chroma}
        >
          Send
        </button>
      </div>
    </div>
    </Container>
  );
};
