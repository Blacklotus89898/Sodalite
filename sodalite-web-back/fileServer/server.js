const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

// graphic design
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();
const port = 8081;
const logFilePath = path.join(__dirname, "server.log");

// Logger function
const logger = (message) => {
    const logMessage = `${new Date().toISOString()} - ${message}\n`;
    console.log(logMessage.trim());
    if (!fs.existsSync(logFilePath)) {
        fs.writeFileSync(logFilePath, "", "utf8"); // Create or clear the log file on start
    }
    fs.appendFileSync(logFilePath, logMessage, "utf8");
};

// ### Local file interface 
// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    logger("Uploads directory created.");
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

// In-memory message store
const messages = [];

// GraphQL schema
const schema = buildSchema(`
  type Message {
    id: ID!
    content: String!
  }

  type Query {
    hello: String!
    message: String!
    allMessages: [Message!]!
  }

  type Mutation {
    addMessage(content: String!): Message!
    clearMessages: Boolean!
  }
`);

// Resolvers
const resolvers = {
  hello: () => "👋 Hello, GraphQL!",
  message: () => "📨 This is a GraphQL message endpoint!",
  allMessages: () => messages,
  addMessage: ({ content }) => {
    const newMessage = { id: String(messages.length + 1), content };
    messages.push(newMessage);
    return newMessage;
  },
  clearMessages: () => {
    messages.length = 0;
    return true;
  },
};


// Setup Express middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// GraphQL endpoint
app.use("/graphql", graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: true,
}));

// File upload route
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        logger("Upload failed: No file provided.");
        return res.status(400).json({ error: "No file uploaded." });
    }
    logger(`File uploaded: ${req.file.filename}`);
    res.json({
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`,
    });
});

// Serve uploaded files
app.get("/uploads/:filename", (req, res) => {
    const filePath = path.join(__dirname, "uploads", req.params.filename);
    if (fs.existsSync(filePath)) {
        logger(`File accessed: ${req.params.filename}`);
        res.sendFile(filePath);
    } else {
        logger(`File not found: ${req.params.filename}`);
        res.status(404).json({ error: "File not found." });
    }
});

// Get list of uploaded files
app.get("/files", (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            logger("Error reading uploaded files.");
            return res.status(500).json({ error: "Unable to scan files." });
        }
        logger("File list requested.");
        res.json(files);
    });
});

// Delete file route
app.delete("/files/:filename", (req, res) => {
    const filePath = path.join(__dirname, "uploads", req.params.filename);
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                logger(`Error deleting file: ${req.params.filename}`);
                return res.status(500).json({ error: "Error deleting file." });
            }
            logger(`File deleted: ${req.params.filename}`);
            res.json({ message: "File deleted successfully." });
        });
    } else {
        logger(`File not found for deletion: ${req.params.filename}`);
        res.status(404).json({ error: "File not found." });
    }
});

app.listen(port, () => {
    fs.writeFileSync(logFilePath, "", "utf8"); // Clear the log file on restart
    logger(`Server running at http://localhost:${port}`);
});
