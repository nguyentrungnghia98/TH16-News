const User = require('../models/user.model');
const bcrypt = require('bcrypt');
//const passport = require('passport')
const { auth_login, auth_login_page } = require('../middleware/auth_login')
var async = require('asyncawait/async');
var await = require('asyncawait/await');


module.exports = (router, passport) => {

  router.post('/register', async (req, res, next) => {
    console.log('register', req.body)
    const user = new User(req.body);

    try {
      await user.save();
      res.redirect('/require-permisstion');
      //res.status(201).send(user);
    } catch (err) {
      if (err.code == 11000) {
        res.redirect('/login?error=DUPLICATE_EMAIL_REGISTER');
      } else {
        res.redirect('/login?error=REGISTER_FAILED');
      }

      //  res.status(403).send(err);
    }
  });

  router.post('/register', passport.authenticate('local-signup', {
    failureRedirect: '/register',
    failureFlash: true
  }), function (req, res) {
    console.log('register sucesss', req.user)
    if (!req.user.role) res.redirect('/select-role');
    if (req.user.role == 'subscriber') {
      res.redirect('/');
    } else {
      if (req.user.isAccepted) {
        res.redirect('/dashboard');
      } else {
        res.redirect('/require-permisstion')
      }
    }
  });

  // router.post('/register', async (req, res, next) => {
  //     console.log('register',req.body)
  //     const user = new User(req.body);

  //     try {                       
  //         await user.save();  
  //         //res.redirect('/require-permisstion');   
  //         res.redirect('/select-role');  
  //         //res.status(201).send(user);
  //     } catch (err) {
  //       if(err.code == 11000){
  //         res.redirect('/login?error=DUPLICATE_EMAIL_REGISTER');
  //       }else{
  //         res.redirect('/login?error=REGISTER_FAILED');
  //       }

  //       //  res.status(403).send(err);
  //     }
  // });

  router.route('/select-role')
    .get(auth_login, async (req, res, next) => {
      res.render('select-role', { layout: 'login.handlebars', style: "select-role", script: 'select-role' });
    })
    .post((req, res, next) => {
      console.log('user', req.user, req.body.role)
      if (!req.user) return res.status(403).json({
        success: false,
        message: "Permisstion denied!"
      });
      if (!req.body.role) return res.status(403).json({
        success: false,
        message: "role is undefined!"
      });

      User.findByIdAndUpdate(req.user._id, {
        $set: {
          role: req.body.role
        }
      }, (err, user) => {
        if (err) return res.status(403).json({
          err
        });
        res.json({
          success: true,
          user
        });
      });
    })
  // Pending accept permisstion 
  router.get('/require-permisstion', async (req, res, next) => {
    res.render('pending-accept', { layout: 'login.handlebars', style: "pending-accept" });
  })
  router.get('/permisstion-denied', async (req, res, next) => {
    res.render('permisstion-denied', { layout: 'login.handlebars', style: "permisstion-denied" });
  })

  // Login
  router
    .route('/login')
    .get(auth_login_page, (req, res) => {
      res.render('login', { layout: 'login.handlebars', script: "login", style: "login" });
    })
    .post(passport.authenticate('local', { failureRedirect: '/login?error=local' }),
      function (req, res) {
        console.log('login sucesss')
        res.redirect('/');
      });

  // Login with facebook    
  router.get('/login/fb', passport.authenticate('facebook', {
    scope: ['email']
  }));

  router.get('/login/fb/cb',
    passport.authenticate('facebook', { failureRedirect: '/login?error=facebook' }),
    function (req, res) {
      console.log('req', req.user)
      if (!req.user.role) res.redirect('/select-role');
      if (req.user.role == 'subscriber') {
        res.redirect('/');
      } else {
        if (req.user.isAccepted) {
          res.redirect('/dashboard');
        } else {
          res.redirect('/require-permisstion')
        }
      }

    });

  // Login with google    
  router.get('/login/google', passport.authenticate('google', {
    scope: ['email']
  }))

  router.get('/login/google/cb',
    passport.authenticate('google', { failureRedirect: '/login?error=google' }),
    function (req, res) {
      console.log('req', req.user)
      if (!req.user.role) res.redirect('/select-role');
      if (req.user.role == 'subscriber') {
        res.redirect('/');
      } else {
        if (req.user.isAccepted) {
          res.redirect('/dashboard');
        } else {
          res.redirect('/require-permisstion')
        }
      }
  })

  router.get('/users', auth_login, async (req, res, next) => {

    try {
      const users = await User.find({});
      if (!users) {
        return res.status(500).send('Cannot get user');
      }
      res.send(users);
    } catch (err) {
      res.status(500).send(err);
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