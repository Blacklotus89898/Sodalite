const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

// Enable CORS for all requests
app.use(cors());

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save files in the "uploads" directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Use timestamped file names
    },
});

const upload = multer({ storage });

// Endpoint to handle video uploads
app.post("/upload", upload.single("video"), (req, res) => {
    console.log("Received file:", req.file);
    
    // Send the filename back to the client
    res.status(200).json({ message: "Video uploaded successfully!", filename: req.file.filename });
});

// Endpoint to stream the uploaded video
app.get("/stream/:filename", (req, res) => {
    const { filename } = req.params;
    const videoPath = path.join(__dirname, "uploads", filename);

    // Check if the file exists
    if (!fs.existsSync(videoPath)) {
        return res.status(404).send("Video file not found.");
    }

    const videoStat = fs.statSync(videoPath);
    const videoStream = fs.createReadStream(videoPath);

    res.writeHead(200, {
        "Content-Type": "video/webm", // Change to the appropriate mime type if necessary
        "Content-Length": videoStat.size,
        "Accept-Ranges": "bytes", // Allow for byte-range requests
    });

    videoStream.pipe(res);
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
