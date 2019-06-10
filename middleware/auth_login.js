const auth_login = (req, res, next) => {
  console.log('middle login', req.user);
  if (!req.user) {
    res.redirect('/login');
  } else {
    next();
  }
}
const auth_login_page = (req, res, next) => {
  console.log('middle login', req.user);
  if (req.user) {
      res.redirect('/');
  } else next();
}
module.exports = {
  auth_login,
  auth_login_page
};