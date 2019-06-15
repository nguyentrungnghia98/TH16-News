const User = require('../../models/user.model');
const auth_api = require('../../middleware/auth_api')
var async = require('asyncawait/async');
var await = require('asyncawait/await');
module.exports = router => {

  // Create new category
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
      const allowedUpdates = ['role', 'email', 'avatar', 'name', 'password', 'provider', 'isAccepted', 'isDenied', 'facebookId', 'googleId']
      const isValidOperation = updates.every((element) => allowedUpdates.includes(element))

      if (!isValidOperation) {
        console.log('sai cu phap')
        return res.status(403).json({ error: 'Some updates fields are invalid!' })
      }

      try {
        let user = await User.findById(req.params.id);
        updates.forEach((element) => user[element] = req.body[element])
        console.log(user);
        await user.save();
        res.send({
          success:true,
          user
        });

      } catch (e) {
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