//const User = require('../models/user.model')

const auth_login = (req, res, next) => {
  // const user = new User(Object(req.user))
     console.log('middle login',req.user);
    if (!req.user) {
       // res.json('please authenticate!');
       res.redirect('/login');
    } else {
      if(!req.user.isAccepted){
        res.redirect('/require-permisstion');
      }else next();
    }
}
const auth_login_page = (req, res, next) => {
  // const user = new User(Object(req.user))
     console.log('middle login',req.user);
    if (req.user) {
       if(!req.user.isAccepted){
        res.redirect('/require-permisstion');
      }else 
          res.redirect('/');
    } else next();
}
module.exports = {
  auth_login,
  auth_login_page
};