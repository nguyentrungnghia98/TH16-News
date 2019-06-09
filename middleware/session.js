const session = require('express-session');

module.exports = function (app) {
    app.use(session({
        secret: '1612419_1612426',
        // resave: true,
        // saveUninitialized: true 
        //cookie: {maxAge: 3600000} // 1 hour
    }))
}