const express = require("express");
const path = require("path");

const app = express();

app.listen(3000, () => {
  console.log("Application is running on port 3000...");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
