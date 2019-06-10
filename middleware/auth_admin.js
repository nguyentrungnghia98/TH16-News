
const auth_admin = async (req, res, next) => {
  if (!req.user) {
    res.redirect('/login');
  } else {
    if (!req.user.isAccepted) {
      res.redirect('/require-permisstion');
    }else{
      if(req.user.role == "subscriber"){
        res.redirect('/permisstion-denied');
      }else next();
    } 
  }
}


module.exports = auth_admin;