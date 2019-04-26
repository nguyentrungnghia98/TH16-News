
const path = require("path");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const expbs = require("express-handlebars");

const routes = require("../routes/handlers");
const helpers = require("../routes/helpers");
app.use(express.static(process.cwd() + "/public")); 
// const publicPath = path.join(__dirname, "../public");
app.engine("handlebars",expbs({
  defaultLayout:"main",
  helpers:helpers
}));

app.set('view engine','handlebars');
// app.use(express.static(publicPath));

app.use("/", routes);

const port =  3111;
http.listen(port, () => {
  console.log("Connect to server via port ", port);
});