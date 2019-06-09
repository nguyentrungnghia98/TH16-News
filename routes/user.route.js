const User = require('../models/user.model');
const bcrypt = require('bcrypt');
//const passport = require('passport')
const {auth_login, auth_login_page} = require('../middleware/auth_login')
var async = require('asyncawait/async');
var await = require('asyncawait/await');


module.exports = (router, passport) => {

    // register

    // router.get('/register', async (req, res, next) => {
    //     res.render('register');
    // })

    router.post('/register', async (req, res, next) => {
        console.log('register',req.body)
        const user = new User(req.body);
  
        try {                       
            await user.save();  
            res.redirect('/require-permisstion');    
            //res.status(201).send(user);
        } catch (err) {
          if(err.code == 11000){
            res.redirect('/login?error=DUPLICATE_EMAIL_REGISTER');
          }else{
            res.redirect('/login?error=REGISTER_FAILED');
          }
          
          //  res.status(403).send(err);
        }
    });

    // Pending accept permisstion 
     router.get('/require-permisstion', async (req, res, next) => {
      res.render('pending-accept', { layout: 'login.handlebars', style: "pending-accept" });
    })

    // Login
    router
      .route('/login')
      .get(auth_login_page,(req, res) => {
          res.render('login', { layout: 'login.handlebars', script: "login", style: "login" });
      })
      .post(passport.authenticate('local',{ failureRedirect: '/login?error=local' }),
      function(req, res) {
        console.log('login sucesss')
        res.redirect('/');
      });


    router.get('/login/fb', passport.authenticate('facebook', {
      scope:['email']
    }));

    // router.get('/login/fb/cb',
    // passport.authenticate('facebook', { failureRedirect: '/login',  successRedirect: '/', }));
    router.get('/login/fb/cb',
    passport.authenticate('facebook', { failureRedirect: '/login?error=facebook' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    });
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
    router.get('/logout', (req, res, next) => {
        req.logOut();
        //res.json({ logout: "success" })
        res.redirect('/login');
    })

}