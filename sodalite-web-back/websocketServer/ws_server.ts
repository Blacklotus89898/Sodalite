import WebSocket, { WebSocketServer } from 'ws';

const port = 8080;
// const server = new WebSocketServer({ host: '0.0.0.0', port });
const server = new WebSocketServer({ port });

const groups: { [key: string]: Set<WebSocket> } = {};

server.on('connection', (ws: WebSocket) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        if (message instanceof Buffer) {
            // Handle binary files
            console.log("Received a binary file, forwarding to group...");

            // Broadcast the binary data to all clients in the same group
            server.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
            return;
        }

        const messageString = message.toString();
        console.log('Received:', messageString);

        let group = '';
        let data: any = null;

        try {
            const parsedMessage = JSON.parse(messageString);
            group = parsedMessage.group || ''; // Should be called channels
            data = parsedMessage.data || null;
        } catch (error) {
            console.error('Failed to parse message:', error);
        }

        if (group) {
            // Handle grouped messages
            if (!groups[group]) {
                groups[group] = new Set();
            }

            if (!groups[group].has(ws)) {
                groups[group].add(ws);
            }

            // Broadcast the message to all clients in the same group
            groups[group].forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        } else {
            // Handle non-grouped messages
            server.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        // Remove the client from all groups
        for (const group in groups) {
            groups[group].delete(ws);
            if (groups[group].size === 0) {
                delete groups[group];
            }
        }
    });
});

console.log(`WebSocket server is running on ws://localhost:${port}`);
