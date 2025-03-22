import React, { useState } from 'react';

const ServerController: React.FC = () => {
  const [status, setStatus] = useState<string>('Idle'); // State to track worker status
  const [workerName, setWorkerName] = useState<string>(''); // State to capture worker name input

  // Start a specific worker server
  const startWorkerServer = async () => {
    if (!workerName) {
      alert('Please enter a worker name');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/start/${workerName}`, { method: 'GET' });
      if (response.ok) {
        setStatus('Running');
        console.log(`Worker server ${workerName} started!`);
      } else {
        console.error(`Failed to start the worker server ${workerName}`);
        setStatus('Error');
      }
    } catch (error) {
      console.error(`Error starting worker server ${workerName}:`, error);
      setStatus('Error');
    }
  };

  // Stop the worker server
  const stopWorkerServer = async () => {
    try {
      const response = await fetch('http://localhost:3000/stop', { method: 'GET' });
      if (response.ok) {
        setStatus('Stopped');
        console.log('Worker server stopped!');
      } else {
        console.error('Failed to stop the worker server');
        setStatus('Error');
      }
    } catch (error) {
      console.error('Error stopping worker server:', error);
      setStatus('Error');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Worker Server Controller</h1>
      <p>Status: {status}</p>

      <div>
        <label>
          Worker Name:
          <input 
            type="text" 
            value={workerName} 
            onChange={(e) => setWorkerName(e.target.value)} 
            placeholder="Enter worker name (e.g., worker1)" 
          />
        </label>
      </div>

      <div>
        <button onClick={startWorkerServer} disabled={status === 'Running' || !workerName} style={{ marginRight: '10px' }}>
          Start Worker Server
        </button>
        <button onClick={stopWorkerServer} disabled={status === 'Stopped'}>
          Stop Worker Server
        </button>
      </div>
    </div>
  );
};

export default ServerController;
