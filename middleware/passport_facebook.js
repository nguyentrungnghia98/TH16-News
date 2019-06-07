const fbookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user.model');

module.exports = function (app, passport_facebook) {

    app.use(passport_facebook.initialize());
    app.use(passport_facebook.session());

    const fb_strategy = new fbookStrategy({
        clientID: "353645022016635",
        clientSecret: "96f15d9d932b634acc3bcc67adf4218c",
        callbackURL: "https://localhost:4200/login/fb/cb"
    },
        (accessToken, refreshToken, profile, cb) => {
            console.log('profile',profile);
        }
    );

    passport_facebook.use(fb_strategy);

    passport_facebook.serializeUser((user, done) => {
        // done(null, user._id)
        console.log('serializeUser',_id)
        done(null, user._id)
    });

    passport_facebook.deserializeUser((_id, done) => {
        // User.findById(_id, (err, user) => {
        //     done(null, user)
        // })
        console.log('deserializeUser',_id)
        done(null,_id)
    })
}