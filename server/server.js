
const path = require("path");
const express = require("express");
const app = express();
const http = require("http").createServer(app);

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

const port = process.env.PORT || 3100;
http.listen(port, () => {
  console.log("Connect to server via port ", port);
});