const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
var morgan = require("morgan");
const env = require("dotenv").config();

const app = express();
app.use(cors());
app.use(morgan("combined"));

app.use("/", express.static("uploads"));

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: path.resolve(`${process.env.PWD}/uploads/`),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + path.extname(file.originalname)); // Unique filename with original extension
  },
});

const upload = multer({ storage });

// Ensure the uploads directory exists
const fs = require("fs");
const connection = require("./utils/db_config");
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Hello World",
    key: process.env.KEY || "default_value",
  });
});

app.get("/v1", (req, res) => {
  res.send("Hello World v1");
});

// File upload endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
  if (req.file) {
    try {
      const sql = "INSERT INTO files (path) VALUES (?)";
      const param = [req.file.filename];
      const result = await connection.query(sql, param);

      res.json({
        message: "File uploaded successfully",
        file: req.file,
        result,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  } else {
    res.status(400).json({ error: "No file uploaded" });
  }
});

app.listen(3377, "0.0.0.0", () => {
  console.log(process.env.DB_HOST);
  console.log(parseInt(process.env.DB_PORT));
  console.log(process.env.DB_USER);
  console.log(process.env.DB_PASSWORD);
  console.log(process.env.DB_SCHEMA);
  console.log("Server is running on port 3377");
});
