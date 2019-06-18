const User = require('../models/user.model');
const bcrypt = require('bcrypt');
//const passport = require('passport')
const { auth_login, auth_login_page } = require('../middleware/auth_login')
var async = require('asyncawait/async');
var await = require('asyncawait/await');
const  {sendgrid_mail} = require('../config/config');
const randomstring = require('randomstring');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(sendgrid_mail.api_key)
const {host} = require("../config/config")

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
}
let forgetPass = {
  email: '',
  secretToken: '',
  allowedUpdatesPass: false
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

  // get email to sent secret token
  router.route('/verify/get-email')
    .get((req, res) => {
      res.render('vwHome/get-email', {layout: 'login.handlebars',customerPath:'../', style: 'get-email'});
    })
    .post(async (req, res, next) => {
      try {
        const {email } = req.body;

        // Find account with matching secret token
        const user = await User.findOne({ 'email': email });
        if (!user) {
          return res.status(500).json({
            message: 'User not found'
          });
        }else{
          if(user.facebookId ){
            return res.status(500).json({
              message: 'That email is already signup via facebook'
            });
          }
          if(user.googleId){
            return res.status(500).json({
              message: 'That email is already signup via google'
            });
          }
        }

        secretToken = randomstring.generate();
        console.log('secretToken', secretToken);
  
        const html = `Hi there,
        Please verify your email by typing the following token:
        <br/>
        Token: <b>${secretToken}</b>
        <br/>
        On the following page:
        <a href="${host}/verify/get-secretToken">${host}/verify/get-secretToken</a>
        <br/><br/>
        Have a pleasant day.` 
  
         // Send email
  
      const msg = {
        to: email,
        from: 'hoangnghia.binhthuan@gmail.com',
        subject: 'Forget password th16-news',
        //text: 'and easy to do anywhere, even with Node.js',
        html: html,
      };
      console.log('email',email)
      await sgMail.send(msg);

      // save info to change password
      forgetPass.email = email;
      forgetPass.secretToken = secretToken;

      res.json({
        success:true
      });
      } catch (error) {
        console.log('err',error)
        return res.status(500).json({
          message: error
        });
      }
    });

  // get secret token
  router.route('/verify/get-secretToken')
  .get((req, res) => {
    if(!forgetPass.email) {
      res.redirect('/verify/get-email');
      return;
    }
    res.render('vwHome/verify', { layout: 'login.handlebars', customerPath:'../', style: 'get-email'});
  })
  .post(async (req, res, next) => {
    try {

      const req_secretToken = req.body.secretToken; 
      console.log('req_secretToken', req_secretToken);
      if(req_secretToken != forgetPass.secretToken || forgetPass.secretToken === '') {
        return res.status(500).json({
          message: 'Secret token do not match!'
        });
      };
      
      forgetPass.allowedUpdatesPass = true;
      res.json({
        success: true
      });
    } catch (error) {
      console.log('err',error)
      return res.status(500).json({
        message: error
      });
    }
  })

  // Change password if email, secrectToken and allowedUpdatesPass are invalid
  router.route('/verify/updatePassword')
  .get((req, res) => {
    if(forgetPass.allowedUpdatesPass === false) {
      res.redirect('/verify/get-email');
      return;
    }
    res.render('vwHome/updatePassword', { layout: 'login.handlebars', customerPath:'../',style: 'get-email'});
  })
  .post(async (req, res, next) => {
    try {
      if(forgetPass.allowedUpdatesPass === false) {
          return res.status(500).json({
            message: 'You do not have permisstion to change password!'
          });
      }

      let user = await User.findOne({ 'email': forgetPass.email });
      if (!user) {
        return res.status(500).json({
          message: 'Cannot find user to change password!'
        });
      }

      const {newPassword} = req.body;

      user.password = newPassword;
      await user.save();

      forgetPass.email = '',
      forgetPass.secretToken = '';
      forgetPass.allowedUpdatesPass = false;

      res.json({
        success: true
      });
    } catch (error) {
      console.log('err',error)
      return res.status(500).json({
        message: error
      });
    }
  })
}