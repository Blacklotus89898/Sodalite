# Backend Server

## Running the Server

To run the backend server (peerServer and websocket), use the following command:

```sh
npm start
```

This will start the server and you should see output indicating that the server is running.

## Building with the dockerfile

```bash
# Building the image locally
docker build -t websocket-server .

# Running the container with a name
docker run -p 8080:8080 --name websocket-server-container websocket-server

# Stoping the container
docker stop websocket-server-container
```