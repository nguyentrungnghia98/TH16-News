const fbookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user.model');
const {facebookApp} = require('../config/config')

module.exports = function (app, passport) {

    const fb_strategy = new fbookStrategy({
        clientID: facebookApp.clientID,
        clientSecret: facebookApp.clientSecret,
        callbackURL: "https://localhost:4200/login/fb/cb",
        profileFields: ['email', 'gender', 'locale', 'displayName']
    },
        (accessToken, refreshToken, profile, done) => {
            //console.log('profile',profile,profile._json)

            User.findOne({
                'facebookId': profile.id
            }, function (err, user) {
                if (err) {
                    console.log('err save', err)
                    return done(null, false, { message: "find error" });
                }
                if (!user) {
                    user = new User({
                        name: profile._json.name,
                        email: profile._json.email,
                        provider: 'facebook',
                        facebookId: profile.id,
                        isAccepted: false
                    });
                    user.save(function (err) {
                        if (err) {
                            console.log('err save', err)
                            return done(null, false, { message: "Save user failed" });
                        } else {

                            return done(err, user);
                        }
                    });
                } else {
                    //found user. Return
                    return done(err, user);
                }
            });
        }
    );

    passport.use(fb_strategy);
}