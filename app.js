const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.get("/", function (req, res) {
  res.send("Hello World");
});

app.get("/v1", function (req, res) {
  res.send("Hello World v1");
});

app.listen(1122, () => {
  console.log("Server is running on port 4500");
});
