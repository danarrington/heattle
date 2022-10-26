const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("static"));

app.get("/", (req, res) => {
  return res.sendFile(path.resolve("./static/index.html"));
});

app.listen(port, () => {
  console.log(`Heattle app listening on port ${port}`);
});
