// // Sending JSON
// const jsonData = JSON.stringify({ message: 'Hello, world!' });
// websocket.send(jsonData);

// // Receiving JSON
// websocket.onmessage = (event) => {
//     const receivedData = JSON.parse(event.data);
//     console.log('Received message:', receivedData.message);
// };

// // Sending a Blob
// const blob = new Blob(['Hello, world!'], { type: 'text/plain' });
// websocket.send(blob);

// // Receiving a Blob
// websocket.onmessage = (event) => {
//     const receivedBlob = event.data;
//     // Process the received Blob
// };
