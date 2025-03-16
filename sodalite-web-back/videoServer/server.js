const express = require("express");
const multer = require("multer");
const cors = require("cors"); // Import the CORS middleware

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
    res.status(200).send("Video uploaded successfully!");
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
