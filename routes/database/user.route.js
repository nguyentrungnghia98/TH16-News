const User = require('../../models/user.model');
const auth_api = require('../../middleware/auth_api');
const  {sendgrid_mail} = require('../../config/config');
const randomstring = require('randomstring');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(sendgrid_mail.api_key)
var async = require('asyncawait/async');
var await = require('asyncawait/await');
const { ObjectID } = require("mongodb");
module.exports = router => {

  // Use to Manage password changes
  let forgetPass = {
    email: '',
    secretToken: '',
    allowedUpdatesPass: false
  }
 
  router.route('/api/user')
    .get(async (req, res, next) => {
      try {
        const users = await User.find({});
        if (!users) {
          return  res.status(403).json({ message: "users is undefined!" });
        }
        res.send({
          success:true,
          users
        });
      } catch (err) {
        res.status(500).json({err});
      }
    })
    .post(auth_api, async (req, res, next) => {

      const user = new User(req.body);
      try {
        await user.save()
        res.send({
          success:true,
          user
        });
      } catch (err) {
        res.status(500).json({err});
      }
    });


  // Get user
  router.route('/api/user/:id')
    .get(async (req, res, next) => {
      if(!req.params.id) return res.status(403).json({ message: "id is undefined!" });
      try {
        const user = await User.findById(req.params.id);

        if (!user) {
          return res.status(500).json({ message: "This user does not exist" });
        }
        res.send({
          success:true,
          user
        });
      } catch (err) {
        res.status(500).json({err});
      }
    })
    .put(auth_api, async (req, res, next) => {
      console.log('Request Id:', req.params.id);
      if(!req.params.id) return res.status(403).json({ message: "id is undefined!" });
      const updates = Object.keys(req.body)
      console.log("Fields update ", updates);
      const allowedUpdates = ['role', 'email','dateExpired', 'avatar','managerCategories', 'name', 'password', 'provider', 'isAccepted', 'isDenied', 'facebookId', 'googleId']
      const isValidOperation = updates.every((element) => allowedUpdates.includes(element))

      if (!isValidOperation) {
        console.log('sai cu phap')
        return res.status(403).json({ error: 'Some updates fields are invalid!' })
      }

      try {
        let user = await User.findById(req.params.id);
        updates.forEach((element) => user[element] = req.body[element])
        if(updates.includes('managerCategories')){
          user.managerCategories = []
          let managerCategories = req.body.managerCategories?JSON.parse(req.body.managerCategories):null
          if(managerCategories && managerCategories.length >0){
            user.managerCategories = managerCategories.map(cate => ObjectID(cate))
          }
        }
        console.log(user);
        await user.save();
        res.send({
          success:true,
          user
        });

      } catch (err) {
        console.log('err',err)
        res.status(500).json({err});
      }
    })
    .delete(auth_api, async (req, res, next) => {
      try {
        let user = await User.findById(req.params.id);
        if (!user) return res.status(403).json({ message: "User not found" })
        console.log(user);
        await user.remove()
        console.log("đã xóa --------------");
        res.send({
          success:true,
        });
      } catch (e) {
        res.status(500).json({err});
      }
    })

  // get email to sent secret token
  router.route('/verify/get-email')
    .get((req, res) => {
      res.render('vwHome/get-email', {layout: 'forgetPassword.handlebars', style: 'get-email'});
    })
    .post(async (req, res, next) => {
      try {
        const {email } = req.body;

        // Find account with matching secret token
        const user = await User.findOne({ 'email': email });
        if (!user) {
          req.flash('error', ' User not found.');
          res.redirect('/verify/get-email');
          return;
        }

        secretToken = randomstring.generate();
        console.log('secretToken', secretToken);
  
        const html = `Hi there,
        Please verify your email by typing the following token:
        <br/>
        Token: <b>${secretToken}</b>
        <br/>
        On the following page:
        <a href="https://localhost:4200/verify/get-secretToken">https://localhost:4200/verify/get-secretToken</a>
        <br/><br/>
        Have a pleasant day.` 
  
         // Send email
  
      const msg = {
        to: 'hoangnghia.bthuan@gmail.com',
        from: 'hoangnghia.binhthuan@gmail.com',
        subject: 'Forget password th16-news',
        //text: 'and easy to do anywhere, even with Node.js',
        html: html,
      };
  
      sgMail.send(msg);

      // save info to change password
      forgetPass.email = email;
      forgetPass.secretToken = secretToken;

      res.redirect('/verify/get-secretToken');
      } catch (error) {
        next(error);
      }
    });

  // get secret token
  router.route('/verify/get-secretToken')
  .get((req, res) => {
    res.render('vwHome/verify', { layout: 'forgetPassword.handlebars',style: 'verify'});
  })
  .post(async (req, res, next) => {
    try {
     
      const req_secretToken = req.body.secretToken; 
      console.log('req_secretToken', req_secretToken);
      if(req_secretToken != forgetPass.secretToken || forgetPass.secretToken === '') {
          res.redirect('/verify/get-secretToken')
          return;
      };
      
      forgetPass.allowedUpdatesPass = true;

      req.flash('success', 'Now you can update your password.');
      res.redirect('/verify/updatePassword');
    } catch (error) {
      next(error);
    }
  })

  // Change password if email, secrectToken and allowedUpdatesPass are invalid
  router.route('/verify/updatePassword')
  .get((req, res) => {
    res.render('vwHome/updatePassword', { layout: 'forgetPassword.handlebars',style: 'updatePassword'});
  })
  .post(async (req, res, next) => {
    try {
      if(forgetPass.allowedUpdatesPass === false) {
          res.redirect('/verify/get-email');
          return;
      }

      let user = await User.findOne({ 'email': forgetPass.email });
      if (!user) {
        req.flash('error', ' User not found.');
        res.redirect('/verify/get-email');
        return;
      }

      const {newPassword, confirmPassword} = req.body;
     
      if(newPassword !== confirmPassword) {
          res.redirect('/verify/updatePassword')
          return;
      };

      user.password = newPassword;
      await user.save();

      forgetPass.email = '',
      forgetPass.secretToken = '';
      forgetPass.allowedUpdatesPass = false;
    
      req.flash('success', 'Now you may login.');
      res.redirect('/login');
    } catch (error) {
      next(error);
    }
  })

}