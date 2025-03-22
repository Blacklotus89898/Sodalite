const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
const cors = require('cors');
const express = require('express');
const app = express();
app.use(cors());

// Variable to hold the worker server process
let workerServer = null;

// Function to start the worker server
const startServer = (workerName) => {
  // Construct the absolute path to the worker server dynamically based on the worker name
  const workerServerPath = path.join(__dirname, '../', workerName, 'server.js');
  
  // Set the directory where the worker server is located
  const workerServerDir = path.dirname(workerServerPath);  // Get the directory path

  // Check if the worker server is already running
  if (workerServer && !workerServer.killed) {
    console.log('Worker server is already running!');
    return;
  }

  // Start the worker server with the provided path and working directory
  workerServer = spawn('node', [workerServerPath], { cwd: workerServerDir }); // Set the cwd option
  console.log(`Worker server for ${workerName} started!`);

  workerServer.stdout.on('data', (data) => {
    console.log(`Worker server stdout: ${data}`);
  });

  workerServer.stderr.on('data', (data) => {
    console.error(`Worker server stderr: ${data}`);
  });

  workerServer.on('close', (code) => {
    console.log(`Worker server process exited with code ${code}`);
  });
};

// Function to stop the worker server
const stopServer = () => {
  if (workerServer) {
    workerServer.kill();
    console.log('Worker server stopped!');
  } else {
    console.log('No worker server is running!');
  }
};

// HTTP server
app.get('/start/:workerName', (req, res) => {
  const { workerName } = req.params;  // Extract worker name from path parameter
  startServer(workerName);
  res.status(200).send(`Worker server ${workerName} started!`);
});

app.get('/stop', (req, res) => {
  stopServer();
  res.status(200).send('Worker server stopped!');
});

// Handle 404 for all other routes
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Start the HTTP server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
