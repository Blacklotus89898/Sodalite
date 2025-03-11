import React, { useState, useEffect, JSX } from 'react';

const TextComparator: React.FC = () => {
    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');
    const [diffOutput, setDiffOutput] = useState<JSX.Element[]>([]);
    const [diffOutput2, setDiffOutput2] = useState('');

    useEffect(() => {
        const diffHtml = compareTexts(text1, text2);
        const diffHtml2 = compareTexts2(text1, text2);
        setDiffOutput(diffHtml);
        setDiffOutput2(diffHtml2);
    }, [text1, text2]);


    const handleCompare = () => {
        const diffHtml = compareTexts(text1, text2);
        const diffHtml2 = compareTexts2(text1, text2);
        setDiffOutput(diffHtml);
        setDiffOutput2(diffHtml2);
    }

    const compareTexts = (first: string, second: string): JSX.Element[] => {
        const firstLines = first.split('\n');
        const secondLines = second.split('\n');
        const maxLines = Math.max(firstLines.length, secondLines.length);

        const result: JSX.Element[] = [];

        for (let i = 0; i < maxLines; i++) {
            const line1 = firstLines[i] || '';
            const line2 = secondLines[i] || '';

            if (line1 === line2) {
                result.push(
                    <div key={i} style={{ whiteSpace: 'pre-wrap' }}>
                        {line1}
                    </div>
                );
            } else {
                if (line1) {
                    result.push(
                        <div key={`${i}-delete`} style={{ color: 'red', whiteSpace: 'pre-wrap' }}>
                            {line1}
                        </div>
                    ); // Line missing in the second input
                }
                if (line2) {
                    result.push(
                        <div key={`${i}-insert`} style={{ color: 'green', whiteSpace: 'pre-wrap' }}>
                            {line2}
                        </div>
                    ); // Line added in the second input
                }
            }
        }

        return result;
    };

    const compareTexts2 = (first: string, second: string): string => {
        let result = ''; const maxLen = Math.max(first.length, second.length); for (let i = 0; i < maxLen; i++) {
            const char1 = first[i] || ''; const char2 = second[i] || ''; if (char1 === char2) {
                result += char1; // No difference 
            }
            else {
                if (char1) {
                    result += `<span style="color: red;">${char1}</span>`; // Missing in second 
                }
                if (char2) {
                    result += `<span style="color: green;">${char2}</span>`; // Additional in second 
                }
            }
        }
        return result;
    };

    return (
        <div>
            <h2>Text Comparator (Line-by-Line)</h2>
            <textarea
                placeholder="Enter first text"
                value={text1}
                onChange={(e) => {
                    setText1(e.target.value);
                }
                }
                style={{ width: '100%', height: '100px', marginBottom: '10px' }}
            />
            <textarea
                placeholder="Enter second text"
                value={text2}
                onChange={(e) => {
                    setText2(e.target.value);
                    handleCompare();
                }}
                style={{ width: '100%', height: '100px', marginBottom: '10px' }}
            />
            <button onClick={handleCompare} style={{ marginBottom: '20px' }}>
                Compare
            </button>
            <div
                style={{
                    padding: '10px',
                    border: '1px solid #ccc',
                    whiteSpace: 'pre-wrap',
                }}
            >
                {diffOutput}
            </div>
            <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', whiteSpace: 'pre-wrap', }} dangerouslySetInnerHTML={{ __html: diffOutput2 }} />
        </div>
    );
};

export default TextComparator;
