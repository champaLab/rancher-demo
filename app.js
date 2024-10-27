const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.get("/", function (req, res) {
  res.send("Hello World");
});

app.listen(4500, () => {
  console.log("Server is running on port 4500");
});
