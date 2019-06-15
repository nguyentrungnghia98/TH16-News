const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
module.exports = function (app, passport) {
    const ls = new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback : true 
        // passReqToCallback: true,
        // session: false
    }, async (req,email, password, done) => {
        const user = await User.findOne({ email: email }) 
        try {
            console.log(password);

            if (!user) { // Nếu không tìm thấy email
                console.log("Khong tim thay email")
                return done(null, false,  req.flash('loginMessage', 'Email was not exist!'));
            }
            if(user.provider){
              console.log(`user was registered via ${user.provider} !!!`)
              return done(null, false,  req.flash('loginMessage', `user was registered via ${user.provider}!`));
            }  
            console.log('user password',user.password);
            const ret = await bcrypt.compare(password, user.password);
           // console.log(ret);
            if (ret) { // Nếu tìm thấy email của user va dung mat khau
                return done(null, user);
            } 
                 
            console.log("sai mat khau")  
            
            return done(null, false, req.flash('loginMessage', 'Invalid password!'));  
        } catch (err) {
            return done(err, false);
        };
    });


  const local_signup =  new localStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true 
  },
  function(req, email, password, done) {

      // asynchronous
      // User.findOne wont fire unless data is sent back
      console.log('rester req',req.body)
      process.nextTick(function() {
      User.findOne({ email :  email }, function(err, user) {
          if (err)
              return done(err);
          if (user) { 
              console.log('That email is already taken.')
              return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
          } else {
              var newUser = new User({
                email,
                password,
                name: req.body.name,
                role: req.body.role,
              });
              // save the user
              newUser.save(function(err) {
                  if (err)
                      throw err;
                  return done(null, newUser);
              });
          }

      });    
    });  
  });  
 

    passport.use(ls);
    passport.use('local-signup',local_signup)

    passport.serializeUser((user, done) => {
      console.log('serializeUser',user)
      return done(null, user._id);
    });
    
    passport.deserializeUser(async (_id, done) => {
      console.log('deserializeUser',_id)
      const user = await User.findOne({ _id })
      return done(null, user)
    });
 
} 