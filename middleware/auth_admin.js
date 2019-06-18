var prePathName = undefined 
function getPathName(){
  console.log('func',prePathName)
  return prePathName
}
const auth_admin = async (req, res, next) => {

  if (!req.user) {
    res.redirect('/login');
    prePathName = req.originalUrl
  } else {
    prePathName = null
    if (!req.user.isAccepted) {
      res.redirect('/require-permisstion');
    }else{
      if(req.user.role == "subscriber"){
        res.redirect('/permisstion-denied');
      }else next();
    } 
  }
  console.log('middle pre',prePathName)
}


module.exports = {auth_admin, getPathName: getPathName};