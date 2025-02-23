const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 8081;

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json()); // Support JSON requests
app.use(express.static("public"));

// File upload route (returns JSON response)
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }
    res.json({
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`,
    });
});

// Serve uploaded files
app.get("/uploads/:filename", (req, res) => {
    const filePath = path.join(__dirname, "uploads", req.params.filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ error: "File not found." });
    }
});

// Get list of uploaded files
app.get("/files", (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Unable to scan files." });
        }
        res.json(files);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
