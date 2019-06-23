
const path = require("path");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const bodyParser = require("body-parser");
const expbs = require("express-handlebars");
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser")
const { port, database } = require("../config/config");
const passport = require('passport');
const session = require('express-session');
var flash    = require('connect-flash');
const router = express.Router();

app.use(express.static("public")); 


const helpers = require("../routes/helpers");
app.engine("handlebars",expbs({
  defaultLayout:"main",
  helpers:helpers
}));
app.set('view engine','handlebars');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: '1612419_1612426',
  resave: true,
  saveUninitialized: true ,
  cookie: {maxAge: 3600000*24} // 24 hour
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// require('../middleware/session')(app);
require('../middleware/passport_local')(app, passport);
require('../middleware/passport_facebook')(app, passport);
require('../middleware/passport_google')(app, passport);


require("../routes/dashboard")(router);
require("../routes/home")(router);
require("../routes/auth.route")(router, passport);
require("../routes/database/category.route")(router);
require("../routes/database/tag.route")(router);
require("../routes/database/post.route")(router);
require("../routes/database/user.route")(router);
app.use("/", router);

mongoose.connect(
  database,
  { useNewUrlParser: true,
    // useCreateIndex: true,
    //useFindAndModify: false
  },
  err => {
      if (err) {
          console.log(err);
      } else {
          console.log("Connected to the database");
      }
  }
);
//mongoose.set('useCreateIndex', true)


//deploy heroku cannot use https
if(port != 4200){
  http.listen(port, () => {
    console.log("Connect to server via port ", port);
  }); 
}else{
  var fs = require('fs')
  var https = require('https')
  https.createServer({
    key: fs.readFileSync('./config/server.key'),
    cert: fs.readFileSync('./config/server.cert')
  }, app)
  .listen(port, () => {
       console.log("Connect to server via port ", port);
     }); 
}
 
