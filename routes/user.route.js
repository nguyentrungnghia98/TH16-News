const User = require('../models/user.model');
const bcrypt = require('bcrypt');
//const passport = require('passport')
const auth_login = require('../middleware/auth_login')



module.exports = (router, passport_local, passport_facebook) => {

    // register

    router.get('/register', async (req, res, next) => {
        res.render('register');
    })

    router.post('/register', async (req, res, next) => {

        const user = new User(req.body);
        // user.name = req.body.name;
        // user.email = req.body.email;
        // user.password = req.body.password;
        // user.picture = req.body.picture;
        // user.rule = req.body.rule;

        try {                       // before function user.save() is called, middleware function pre.save() in usermodle has been called
            await user.save();      // to check user.password isModified? and decide to hash it or not?
            res.status(201).send(user);
        } catch (err) {
            res.status(400).send(err);
        }
    });


    // Login
    router.get('/login', async (req, res, next) => {
        res.render('login', { layout: 'login.handlebars', script: "login", style: "login" });
    });

    // login with passport_local
    router.post('/login/local', async (req, res, next) => {
        passport_local.authenticate('local', async (err, user, info) => {
            if (err)
                // res.jon({err: "bi loi"})
                return next(err);

            if (!user) {
                return res.json({ err: "Tim khong thay" })
                //return res.render('login', { layout: 'login.handlebars', script: "login", style: "login", err_message: info.message });
            }

            req.logIn(user, err => {
                if (err)
                    return next(err);

                //return res.redirect('/');
                return res.json({
                    success: "true",
                    message: "Dang nhap thanh cong !!!",
                    user
                });
            });
        })(req, res, next);
    }) 

    // // login with passport_facebook
    router.get('/login/fb', passport_facebook.authenticate('facebook'));

    router.get('/login/fb/cb',
        passport_facebook.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/login'
        })
    )
    // Get list users

    router.get('/users', auth_login, async (req, res, next) => {

        try {
            const users = await User.find({});

            if (!users) {
                return res.status(404).send();
            }

            res.send(users);
        } catch (err) {
            res.status(500).send;
        }

    });

    // profile
    router.get('/users/me', auth_login, async (req, res, next) => {

        // res.send(Object(req.user));
        const user = await User.findById(req.user._id);
        try {
            res.send(user)
        } catch (e) {
            res.json({ err: "Tim ko thay profile" })
        }

    })

    // Update
    router.patch('/users/me/update', auth_login, async (req, res, next) => {
        const updates = Object.keys(req.body)
        console.log(updates);
        const allowedUpdates = ['name', 'email', 'password', 'rule', 'picture']
        const isValidOperation = updates.every((element) => allowedUpdates.includes(element))

        if (!isValidOperation) {
            console.log('sai cu phap')
            return res.status(400).send({ error: 'Invalid updates!' })
        }

        try {
            // const user_temp = new User(Object(req.user));
            let user = await User.findById(req.user._id);
            updates.forEach((element) => user[element] = req.body[element])
            console.log(user);
            await user.save();
            req.user = user;
            res.send(req.user)

        } catch (e) {
            res.status(400).send(e)
        }
    })

    router.delete('/users/me', auth_login, async (req, res, next) => {
        try {
            let user = await User.findById(req.user._id);
            if (!user) return res.json({ message: "Khong tim thay User nay!!!" })
            console.log(user);
            await user.remove()
            console.log("đã xóa --------------", user);
            res.send(req.user);
        } catch (e) {
            res.json({ delete: "false" }).status(500).send()
        }
    })

    // logout
    router.post('/logout', auth_login, (req, res, next) => {
        req.logOut();
        res.json({ logout: "success" })
        res.redirect('/login');
    })

}