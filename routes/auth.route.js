const User = require('../models/user.model');
const bcrypt = require('bcrypt');
//const passport = require('passport')
const { auth_login, auth_login_page } = require('../middleware/auth_login')
var async = require('asyncawait/async');
var await = require('asyncawait/await');



function routeSuccess(req,res){
  var {getPathName} = require("../middleware/auth_admin")
  let prePathName = getPathName()
  console.log('pathname',prePathName)
  if(!req.user.role) return res.redirect('/select-role');
  if(req.user.role == 'subscriber' || req.user.role == 'guest'){
    res.redirect('/');
  }else{
    if(prePathName){
        res.redirect(prePathName);
        prePathName = null
    }else{
      res.redirect('/dashboard');
    }
  }
  // if(req.user.role == 'subscriber' || req.user.role == 'guest'){
  //   if(req.user.role == 'subscriber'){
  //     if(!req.user.dateExpired){
  //       res.redirect('/account-expired');
  //     }else{
  //       const now = new Date()
  //       const dateExpired = new Date(req.user.dateExpired)
  //       if(now > dateExpired) {
  //         res.redirect('/account-expired');
  //       }else{
  //         res.redirect('/');
  //       }
  //     }
      
  //   } else{
  //     res.redirect('/');
  //   }
  // }else{
  //   if(req.user.isAccepted){
  //     if(prePathName){
  //       res.redirect(prePathName);
  //       prePathName = null
  //     }else{
  //       res.redirect('/dashboard');
  //     }
  //   }else{
  //     res.redirect('/require-permisstion')
  //   }
  // }
}
module.exports = (router, passport) => {


  router.get('/register',auth_login_page,async (req, res) => {
    
    let error = await req.flash('signupMessage')[0]
    console.log('flash',error)
    res.render('register', { layout: 'login.handlebars',message:error , script: "register", style: "login" });
  })

  router.post('/register', passport.authenticate('local-signup', {
    failureRedirect: "/register",
    failureFlash: true
  }), function (req, res) {
    routeSuccess(req,res)
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
    .post(async (req, res, next) => {
      console.log('user',req.user, req.body.role )
      if(!req.user) return res.status(403).json({
        success: false,
        message: "Permisstion denied!"
      });
      if (!req.body.role) return res.status(403).json({
        success: false,
        message: "role is undefined!"
      });
      try{
        let user = await User.findById(req.user._id)
        user.role = req.body.role
        user.isAccepted = false
        await user.save()
        res.redirect('/')
      }catch(err){
        console.log('err',err)
        res.status(403).json({
          err
        });
      }
    })

    
  router.get('/account-expired', async (req, res, next) => {
    res.render('account-expired', { layout: 'login.handlebars', style: "pending-accept" });
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
    .get(auth_login_page,async (req, res) => {
      let message = await req.flash('loginMessage')[0]
      res.render('login', { layout: 'login.handlebars',message, script: "login", style: "login" });
    })
    .post(passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
      function (req, res) {
        console.log('login sucesss')
        routeSuccess(req,res)
      });

  // Login with facebook    
  router.get('/login/fb', passport.authenticate('facebook', {
    scope: ['email']
  }));

  router.get('/login/fb/cb',
    passport.authenticate('facebook', { failureRedirect: '/login', failureFlash: true  }),
    function (req, res) {
      routeSuccess(req,res)
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