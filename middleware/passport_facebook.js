const fbookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user.model');
const {facebookApp} = require('../config/config')
const {host} = require("../config/config")
module.exports = function (app, passport) {

    const fb_strategy = new fbookStrategy({
        clientID: facebookApp.clientID,
        clientSecret: facebookApp.clientSecret,
        callbackURL: `${host}/login/fb/cb`,
        profileFields: ['email','gender','locale','displayName'],
        passReqToCallback : true 
    },
        (req,accessToken, refreshToken, profile, done) => {
            console.log('profile',profile,profile._json)
          
            User.findOne({
              'email': profile._json.email 
          }, function(err, user) {
              if (err) {
                console.log('err save',err)
                  return done(null,false,req.flash('loginMessage', 'Get data error!'));
              }
              if (!user) {
                  user = new User({
                      name: profile._json.name,
                      email: profile._json.email,
                      provider: 'facebook',
                      facebookId: profile.id,
                      isAccepted: false
                  }); 
                  user.save(function(err) {
                      if (err){
                        console.log('err save',err)
                        return done(null,false,req.flash('loginMessage', 'Create user failed!'));
                      } else{
                        return done(err, user);
                      } 
                  });
              } else {
                  if(!user.facebookId){
                    return done(null,false,req.flash('loginMessage', 'That email is already taken.'));
                  }else{
                    return done(err, user);
                  }
                  //found user. Return
                  
              }
          });
        }
    );

    passport.use(fb_strategy);
}