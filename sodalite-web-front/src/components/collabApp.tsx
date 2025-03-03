import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { WebSocketService } from '../services/websocketService';
import { useServer, useTheme } from '../stores/hooks';

const CollabApp: React.FC = () => {
  const { address } = useServer();
  const { theme, chroma } = useTheme();
  const [content, setContent] = useState('');
  const wsServiceRef = useRef<WebSocketService | null>(null);

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


  const baseFontSize = Math.max(12, ); // Example: 2% of container width

  const containerStyle: React.CSSProperties = {
    backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)',
    color: theme === 'dark' ? 'white' : 'black',
    borderRadius: '10px',
    padding: '20px',
    maxWidth: '600px',
    margin: 'auto',
    boxShadow: theme === 'dark' ? '0px 4px 10px rgba(0, 0, 0, 0.3)' : '0px 4px 10px rgba(200, 200, 200, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    fontSize: baseFontSize,
  };

  const titleStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: baseFontSize * 1.2,
    marginBottom: '20px',
  };

  const textareaStyle: React.CSSProperties = {
    padding: '10px',
    borderRadius: '8px',
    border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'}`,
    backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    color: theme === 'dark' ? 'white' : 'black',
    fontSize: baseFontSize,
    resize: 'none',
    outline: 'none',
    transition: 'border 0.3s ease, background-color 0.3s ease',
    minHeight: '150px',
    maxHeight: '300px',
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Collaborative Text Editor</h1>
      <textarea
        value={content}
        onChange={handleChange}
        rows={10}
        cols={50}
        placeholder="Type your text here..."
        style={textareaStyle}
        onMouseOver={(e) => e.currentTarget.style.border = `1px solid ${chroma}`}
        onMouseOut={(e) => e.currentTarget.style.border = `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'}`}
        onFocus={(e) => e.target.style.border = `1px solid ${chroma}`}
        onBlur={(e) => e.target.style.border = `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'}`}
      ></textarea>
    </div>
  );
};

export default CollabApp;
