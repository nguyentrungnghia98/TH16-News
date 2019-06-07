const User = require('../models/user.model')

const auth_admin = async (req, res, next) => {
   try {
      console.log(req.user._id)

      const user = await User.findById(req.user._id);
      console.log(user.rule);

      const isAdmin = user.rule === 'admin' ? true : false;

      if (!isAdmin) {
         res.json('you are not admin!');
      } else next();
      
   } catch (err) {
      return res.status(500).json({ err: "can't authenticate admin permissions" })
   }

}


module.exports = auth_admin;