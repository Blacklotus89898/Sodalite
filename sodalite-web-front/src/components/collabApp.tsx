import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { WebSocketService } from '../services/websocketService';
import { useServer, useTheme } from '../stores/hooks';
import { Container } from './container';

const CollabApp: React.FC = () => {
  const { address } = useServer();
  const { theme, chroma } = useTheme();
  const [content, setContent] = useState('');
  const wsServiceRef = useRef<WebSocketService | null>(null);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    wsServiceRef.current = new WebSocketService(address['websocketServer']);

    wsServiceRef.current.connect((data: unknown) => {
      const parsedData = data as { content: string };
      setContent(parsedData.content);
    });

    return () => {
      if (wsServiceRef.current) {
        wsServiceRef.current.close();
      }
    };
  }, [address]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    if (wsServiceRef.current) {
      wsServiceRef.current.send({ content: newContent, group: 'collab' });
    }
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        const width = entries[0].contentRect.width;
        const newFontSize = Math.max(12, width / 40); // Dynamically scale font size based on container width
        setFontSize(newFontSize);
      }
    });

    const containerElement = document.getElementById("collabContainer");
    if (containerElement) {
      resizeObserver.observe(containerElement);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const containerStyle: React.CSSProperties = {
    backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)',
    color: theme === 'dark' ? 'white' : 'black',
    borderRadius: '10px',
    maxWidth: '100%', // Allow it to expand within container width
    width: '100%',
    height: '100%',
    boxShadow: theme === 'dark' ? '0px 4px 10px rgba(0, 0, 0, 0.3)' : '0px 4px 10px rgba(200, 200, 200, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    fontSize: fontSize,
    alignItems: 'center',
  };

  const titleStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: fontSize * 1.2,
    marginBottom: '20px',
  };

const textareaStyle: React.CSSProperties = {
    padding: '10px',
    borderRadius: '8px',
    border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'}`,
    backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    color: theme === 'dark' ? 'white' : 'black',
    fontSize: fontSize,
    resize: 'none',
    outline: 'none',
    transition: 'border 0.3s ease, background-color 0.3s ease',
    minHeight: '150px',
    height: '100%', // Adjust to parent height
    flex: 1, // Allow textarea to take available space
    width: '90%',
    marginBottom: '10px',
};

  return (
    <Container maxWidth={1200} maxHeight={1200}>
      <div id="collabContainer" style={containerStyle}>
        <h1 style={titleStyle}>Collaborative Text Editor</h1>
        <textarea
          value={content}
          onChange={handleChange}
          placeholder="Type your text here..."
          style={textareaStyle}
          onMouseOver={(e) => e.currentTarget.style.border = `1px solid ${chroma}`}
          onMouseOut={(e) => e.currentTarget.style.border = `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'}`}
          onFocus={(e) => e.target.style.border = `1px solid ${chroma}`}
          onBlur={(e) => e.target.style.border = `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'}`}
        ></textarea>
      </div>
    </Container>
  );
};

export default CollabApp;
