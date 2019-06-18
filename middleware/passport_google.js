const googleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');
const { googleApp } = require('../config/config')
const {host} = require("../config/config")
module.exports = function (app, passport) {

    passport.use(new googleStrategy({
        clientID: googleApp.clientID,
        clientSecret: googleApp.clientSecret,
        callbackURL: `${host}/login/google/cb`,
        passReqToCallback : true 
      },
      (req,accessToken, refreshToken, profile, done) => {
        //console.log('profile',profile,profile._json)
        User.findOne({
            'email': profile._json.email 
        }, function (err, user) {
            if (err) {
                console.log('err save', err)
                return done(null, false, req.flash('loginMessage', 'Get data error!'));
            }
            if (!user) {
                user = new User({
                    name: profile._json.name,
                    email: profile._json.email,
                    provider: 'google',
                    googleId: profile.id,
                    isAccepted: false
                });
                user.save(function (err) {
                    if (err) {
                        console.log('err save', err)
                        return done(null, false, req.flash('loginMessage', 'Save data error!'));
                    } else {

                        return done(err, user);
                    }
                });
            } else {
              if(!user.googleId){
                return done(null,false,req.flash('loginMessage', 'That email is already taken.'));
              }else{
                return done(err, user);
              }
            }
        });
    }
    ))

}