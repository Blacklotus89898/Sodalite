import React, { useState, ChangeEvent } from 'react';
import { useTheme } from '../stores/hooks';

const CodeEditor: React.FC = () => {
  const [codeInput, setCodeInput] = useState<string>('');
  const [language, setLanguage] = useState<string>('json');
  const { theme } = useTheme();

  // Function to handle input changes
  const handleCodeInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCodeInput(e.target.value);
  };

  // Function to handle language selection
  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  // Syntax highlighting function with preserved formatting
  const highlightCode = (code: string, lang: string) => {
    let highlightedCode = code
      .replace(/ /g, '&nbsp;') // Preserve spaces
      .replace(/\n/g, '<br/>'); // Preserve newlines

    if (lang === 'json') {
      highlightedCode = highlightedCode
        .replace(/"(.*?)"(?=\s*:)/g, '<span style="color: #90ee90">"$1"</span>') // Keys
        .replace(/"(.*?)"/g, '<span style="color: #f9d7a6">"$1"</span>') // Strings
        .replace(/\b(\d+)\b/g, '<span style="color: #ff6347">$1</span>') // Numbers
        .replace(/\b(true|false|null)\b/g, '<span style="color: #add8e6">$1</span>'); // Booleans & null
    } else if (lang === 'python') {
      highlightedCode = highlightedCode
        .replace(/(#.*?$)/gm, '<span style="color: #90ee90">$1</span>') // Comments
        .replace(/(".*?"|'.*?')/g, '<span style="color: #f9d7a6">$1</span>') // Strings
        .replace(/\b(def|class|return|if|else|elif|import|from|as|for|while|try|except|finally|with)\b/g, '<span style="color: #ff6347">$1</span>'); // Keywords
    } else if (lang === 'cpp') {
      highlightedCode = highlightedCode
        .replace(/(\/\/.*?$)/gm, '<span style="color: #90ee90">$1</span>') // Single-line comments
        .replace(/(".*?")/g, '<span style="color: #f9d7a6">$1</span>') // Strings
        .replace(/\b(int|double|float|char|bool|void|string|return|if|else|for|while|do|switch|case|break|continue)\b/g, '<span style="color: #ff6347">$1</span>'); // Keywords
    }
    return `<pre><code>${highlightedCode}</code></pre>`;
  };

  // Styles
  const styles = {
    container: {
      padding: '20px',
      borderRadius: '8px',
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: theme === 'dark' ? '#111' : '#fff',
      color: theme === 'dark' ? 'white' : 'black',
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '20px',
      fontSize: '24px',
    },
    select: {
      marginBottom: '10px',
      padding: '5px',
    },
    textarea: {
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      fontFamily: 'monospace',
      fontSize: '14px',
      minHeight: '200px',
      resize: 'vertical' as const,
      borderRadius: '5px',
      backgroundColor: theme === 'dark' ? '#000' : '#f8f8f8',
      color: theme === 'dark' ? 'white' : 'black',
      border: theme === 'dark' ? '1px solid #444' : '1px solid #ccc',
    },
    preview: {
      backgroundColor: theme === 'dark' ? '#222' : '#f9f9f9',
      padding: '20px',
      borderRadius: '8px',
      marginTop: '20px',
      fontFamily: 'monospace',
      fontSize: '14px',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Code Editor</h1>

      {/* Language Selection */}
        <h2>
      <label>
        Select Language:
        </label>
      <select style={styles.select} value={language} onChange={handleLanguageChange}>
        <option value="json">JSON</option>
        <option value="python">Python</option>
        <option value="cpp">C++</option>
      </select>
        </h2>
        
      {/* Manual Input Section */}
      <div>
        <label><h2>Code Input:</h2></label>
        <textarea
          style={styles.textarea}
          value={codeInput}
          onChange={handleCodeInputChange}
          placeholder="Enter your code here..."
        />
      </div>

      {/* Preview Section */}
      <div style={styles.preview}>
        <h2>Preview:</h2>
        <div dangerouslySetInnerHTML={{ __html: highlightCode(codeInput, language) }} />
      </div>
    </div>
  );
};

export default CodeEditor;
