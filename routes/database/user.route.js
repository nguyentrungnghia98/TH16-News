const User = require('../../models/user.model');
const auth_api = require('../../middleware/auth_api');
const auth_user = require('../../middleware/auth_user')
const  {sendgrid_mail} = require('../../config/config');
const randomstring = require('randomstring');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(sendgrid_mail.api_key)
var async = require('asyncawait/async');
var await = require('asyncawait/await');
const { ObjectID } = require("mongodb");
const bcrypt = require('bcrypt');
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
  //change password
  router.route('/api/password/:id')
  .put(auth_user, async (req, res, next) => {
    console.log('Request Id:', req.params.id);
    if(!req.params.id) return res.status(403).json({ message: "id is undefined!" });
    const updates = Object.keys(req.body)
    const allowedUpdates = ['currentPassword','newPassword']
    const isValidOperation = updates.every((element) => allowedUpdates.includes(element))

    if (!isValidOperation) {
      console.log('sai cu phap')
      return res.status(403).json({ error: 'Some updates fields are invalid!' })
    }

    try {
      let user = await User.findById(req.params.id);
      const ret = await bcrypt.compare(req.body.currentPassword, user.password); 
      if (ret) { 
          user.password == req.body.newPassword
      } else{
        return res.status(500).json({
          message: 'Current password not match!'
        });
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
    .put(auth_user, async (req, res, next) => {
      console.log('Request Id:', req.params.id);
      if(!req.params.id) return res.status(403).json({ message: "id is undefined!" });
      const updates = Object.keys(req.body)
      const allowedUpdates = ['role', 'email','dateExpired', 'avatar','managerCategories','phone','address','facebookLink', 'name', 'password', 'provider', 'isAccepted', 'isDenied', 'facebookId', 'googleId']
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

}