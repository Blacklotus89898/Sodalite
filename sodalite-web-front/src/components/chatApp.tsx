import React, { useEffect, useRef, useState } from 'react';
import { WebSocketService } from '../services/websocketService';
import { useServer, useTheme } from '../stores/hooks';
import { Container } from './container';
import { useLog } from '../stores/hooks';
import { LogType } from '../stores/stores';

export const ChatApp: React.FC = () => {
  const { address } = useServer();
  const { theme, chroma } = useTheme();
  const [messages, setMessages] = useState<{ message: string; group: string }[]>([]);
  const [input, setInput] = useState<string>('');
  const [group, setGroup] = useState<string>('default');
  const [isConnected, setIsConnected] = useState<boolean>(false); // State for connection status
  const wsServiceRef = useRef<WebSocketService | null>(null);
  const { logs, addLogs } = useLog();	

  useEffect(() => {
    wsServiceRef.current = new WebSocketService(address['websocketServer']);

    const connectWebSocket = () => {
      wsServiceRef.current?.connect((data) => {
        console.log('Received:', data);

        addLogs([ {
          Time: new Date().toLocaleTimeString(),
          Message: data as string,
          Type: "chatApp",
        }]);
        setMessages((prevMessages) => [...prevMessages, data as { message: string; group: string }]);
        setIsConnected(true); // Set connection status to true when successfully connected
      });
    };

    wsServiceRef.current.onConnectionStatusChange(setIsConnected); // Update connection status

    connectWebSocket(); // Initial connection attempt

    return () => {
      if (wsServiceRef.current) {
        wsServiceRef.current.close();
      }
    };
  }, [address]);

  const sendMessage = () => {
    if (wsServiceRef.current && input.trim()) {
      setMessages((prevMessages) => [...prevMessages,  { message: input, group: group }]);
      wsServiceRef.current.send({ message: input, group: group });
      setInput('');
    }
  };

  // const reconnect = () => {
  //   setIsConnected(false); // Set status to disconnected while reconnecting
  //   if (wsServiceRef.current) {
  //     wsServiceRef.current.close(); // Close the previous connection
  //     setTimeout(() => {
  //       // Retry connecting after a short delay
  //       wsServiceRef.current?.connect(() => {
  //         setIsConnected(true); // Set to connected once reconnection is successful
  //       });
  //     }, 1000);
  //   }
  // };

  // Dynamic font sizes based on screen width
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const baseFontSize = Math.max(12, width * 0.01); // Adjusting the font size dynamically

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
    height: '100%',  // Ensure it grows with parent
    alignItems: 'center',
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
    flexShrink: 0, // Prevent shrinking
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
    flexShrink: 0, // Prevent shrinking
  };

  const messageStyle: React.CSSProperties = {
    padding: '10px',
    backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    borderRadius: '5px',
    fontSize: baseFontSize * 0.9,
    marginBottom: '8px',
    wordWrap: 'break-word',
  };

  const groupStyle: React.CSSProperties = {
    fontWeight: 'bold',
    marginRight: '5px',
  };

  return (
    <Container maxWidth={1200} maxHeight={1000}>
      <div style={containerStyle}>
        <h1 style={{ textAlign: 'center', fontSize: baseFontSize * 1.2, marginBottom: '0px' }}>
          Chat App
        </h1>

                {/* Connection status display */}
                <div style={{margin:"0px" }}>
          {isConnected ? (
            <h5 style={{ color: theme === 'dark' ? 'white' : 'black' }}>Status: Connected</h5>
          ) : (
            <div style={{ color: theme === 'dark' ? 'white' : 'black' }}>
              <h5>Status: Disconnected</h5>
            </div>
          )}
        </div>

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



        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '15px', width: '100%' }}>
          {messages.map((msg, index) => (
            <div key={index} style={messageStyle}>
              <span style={groupStyle}>{msg.group}:</span> {msg.message}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '5px', paddingBottom: '10px', flexWrap: 'wrap', width: '100%' }}>
          <input
            type="text"
            value={input}
            placeholder='Enter message'
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
            style={{ ...inputStyle, flex: '1 1 auto' }}
            onMouseOver={(e) => e.currentTarget.style.border = `1px solid ${chroma}`}
            onMouseOut={(e) => e.currentTarget.style.border = `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'}`}
          />
          <button
            onClick={sendMessage}
            style={{ ...buttonStyle, flex: '1 1 100%' }}
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
