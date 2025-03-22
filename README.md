# Sodalite

This project aims to provide an interactive dashboard for students to collaborate and work together.

## Web Application

You can access the web application at the following link: [Sodalite Web App](https://blacklotus89898.github.io/Sodalite/)

## Features

- Collaborative dashboard
- Real-time updates
- Interactive components
- Drag-and-drop functionality
- Camera access to take pictures
- Video saving
- AI agent

## Running in Development

To run the project in development mode, use the following commands:

1. Clone the repository:

```bash
git clone https://github.com/blacklotus89898/Sodalite.git
```

2. Starting the frontend
``` bash
cd Sodalite/sodalite-web-front
npm i
npm run dev
```

3. Starting the backend
```bash
cd Sodalite/sodalite-web-back

# ws servr
cd websocketServer
npm i
npm start

# or fileserver
cd fileServer
npm i
node server.js

# or 
cd videoServer
npm i
node server.js
```
