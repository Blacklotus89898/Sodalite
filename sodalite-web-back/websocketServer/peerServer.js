const express = require("express");
const { PeerServer } = require("peer");
const cors = require("cors");

const app = express();
const PORT = 9000;


// GOOD server, enable treat unsecure as secure on browser for the webpage, and server ip address
// ✅ Enable CORS
app.use(cors({ origin: "*" }));

// ✅ Start Express Server
const server = app.listen(PORT, () => {
  console.log(`✅ Express server running at http://localhost:${PORT}`); //change to your server IP
});

// ✅ Start PeerJS Signaling Server on a Different Port
const peerServer = PeerServer({
  port: 9001, // PeerJS runs on a separate port
  path: "/peerjs",
  allow_discovery: true,
  proxied: true,
});

console.log(`✅ PeerJS signaling server running at ws://localhost:9001/peerjs`);
