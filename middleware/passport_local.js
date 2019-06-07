const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

module.exports = function (app, passport_local) {
    app.use(passport_local.initialize());
    app.use(passport_local.session());

    const ls = new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        // passReqToCallback: true,
        // session: false
    }, async (email, password, done) => {
        const user = await User.findOne({ email: email }) 
        try {
            console.log(password);

            if (!user) { // Nếu không tìm thấy email
                console.log("Khong tim thay email")
                return done(null, false, { message: 'invalid email !!!' });
            }
               
            console.log(user.password);
            const ret = await bcrypt.compare(password, user.password);
           // console.log(ret);
            if (ret) { // Nếu tìm thấy email của user va dung mat khau
                return done(null, user);
            } 
                 
            console.log("sai mat khau")  
            return done(null, false, { message: 'invalid password' });  
        } catch (err) {
            return done(err, false);
        };
    });

    passport_local.use(ls);

    passport_local.serializeUser((user, done) => {
        return done(null, user);
    });

    passport_local.deserializeUser((user, done) => {
        return done(null, user)
    });
} 