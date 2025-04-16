import WebSocket, { WebSocketServer } from 'ws';
const path = require("path");
const fs = require("fs");
const port = 8080;
// const server = new WebSocketServer({ host: '0.0.0.0', port });
const server = new WebSocketServer({ port });

const groups: { [key: string]: Set<WebSocket> } = {};

const logFilePath = path.join(__dirname, "server.log");

// Logger function
interface Logger {
    (message: string): void;
}

const logger: Logger = (message) => {
    const logMessage = `${new Date().toISOString()} - ${message}\n`;
    console.log(logMessage.trim());
    if (!fs.existsSync(logFilePath)) {
        fs.writeFileSync(logFilePath, "", "utf8"); // Create or clear the log file on start
    }
    fs.appendFileSync(logFilePath, logMessage, "utf8");
};

server.on('connection', (ws: WebSocket) => {
    logger('Client connected');

    // can use the isBinary flag to handle files
    ws.on('message', (message, isBinary) => {
        if (message instanceof Buffer) {
            logger("Received a binary file, forwarding to group...");

            // Broadcast the binary data to all clients in the same group
            server.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
            return;
        }

        const messageString = message.toString();
        logger(`Received message: ${messageString}`);

        let group = '';
        let data: any = null;

        try {
            const parsedMessage = JSON.parse(messageString);
            group = parsedMessage.group || ''; // Should be called channels
            data = parsedMessage.data || null;
        } catch (error) {
            logger(`Failed to parse message: ${error}`);
        }

        if (group) {
            // Handle grouped messages
            if (!groups[group]) {
                groups[group] = new Set();
                logger(`Created new group: ${group}`);
            }

            if (!groups[group].has(ws)) {
                groups[group].add(ws);
                logger(`Added client to group: ${group}`);
            }

            // Broadcast the message to all clients in the same group
            groups[group].forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
            logger(`Broadcasted message to group: ${group}`);
        } else {
            // Handle non-grouped messages
            server.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
            logger("Broadcasted message to all clients");
        }
    });

    ws.on('close', () => {
        logger('Client disconnected');
        // Remove the client from all groups
        for (const group in groups) {
            groups[group].delete(ws);
            if (groups[group].size === 0) {
                delete groups[group];
                logger(`Deleted empty group: ${group}`);
            }
        }
    });
});

logger(`WebSocket server is running on ws://localhost:${port}`);
