//const User = require('../models/user.model')

const auth_login = (req, res, next) => {
  // const user = new User(Object(req.user))
  //   console.log(user);
    if (!req.user) {
        res.json('please authenticate!');
    } else next();
  }
  
module.exports = auth_login;