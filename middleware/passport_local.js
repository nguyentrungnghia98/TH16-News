const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
module.exports = function (app, passport) {
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
            if(user.provider){
              console.log(`user was registered via ${user.provider} !!!`)
              return done(null, false, { message: `user was registered via ${user.provider} !!!` });
            }  
            console.log('user password',user.password);
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

    passport.use(ls);

 
} 