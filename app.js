const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
var morgan = require("morgan");

const app = express();
app.use(cors());
app.use(morgan("combined"));

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with original extension
  },
});

const upload = multer({ storage });

// Ensure the uploads directory exists
const fs = require("fs");
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/v1", (req, res) => {
  res.send("Hello World v1");
});

// File upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  if (req.file) {
    res.json({
      message: "File uploaded successfully",
      file: req.file,
    });
  } else {
    res.status(400).json({ error: "No file uploaded" });
  }
});

app.listen(1122, () => {
  console.log("Server is running on port 1122");
});
