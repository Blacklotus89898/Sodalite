import React, { useState } from 'react';

const Postman: React.FC = () => {
    const [response, setResponse] = useState('');
    return (
        <div>
            <h1>Postman Component</h1>
            <p>This is a template for the Postman component.</p>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const method = (form.elements.namedItem('method') as HTMLSelectElement).value;
                    const ip = (form.elements.namedItem('ip') as HTMLInputElement).value;
                    const port = (form.elements.namedItem('port') as HTMLInputElement).value;
                    const body = (form.elements.namedItem('body') as HTMLTextAreaElement).value;

                    try {
                        const response = await fetch(`http://${ip}:${port}`, {
                            method: method.toUpperCase(),
                            headers: { 'Content-Type': 'application/json' },
                            body: method.toLowerCase() !== 'get' ? JSON.stringify(JSON.parse(body)) : undefined,
                        });

                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }

                        const contentType = response.headers.get('Content-Type');
                        const data = contentType && contentType.includes('application/json')
                            ? await response.json()
                            : await response.text();

                        setResponse(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
                    } catch (error) {
                        console.error('Error:', error);
                        setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
                    }
                }}
            >
                <label>
                    Method:
                    <select name="method">
                        <option value="get">GET</option>
                        <option value="post">POST</option>
                        <option value="put">PUT</option>
                        <option value="del">DELETE</option>
                    </select>
                </label>
                <br />
                <label>
                    IP Address:
                    <input type="text" name="ip" required />
                </label>
                <br />
                <label>
                    Port:
                    <input type="text" name="port" required />
                </label>
                <br />
                <label>
                    Body:
                    <textarea name="body" />
                </label>
                <br />
                <button type="submit">Send Request</button>
            </form>
            <h2>Response</h2>
            <pre>{response}</pre>
        </div>
    );
};

export default Postman;