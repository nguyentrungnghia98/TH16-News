
const auth_api = async (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ error: 'Permisstion require!' })
  } else {
    if (!req.user.isAccepted) {
      return res.status(403).json({ error: 'Permisstion require!' })
    }else{
      if(req.user.role == "subscriber"){
        return res.status(403).json({ error: 'Permisstion require!' })
      }else next();
    } 
  }
}


module.exports = auth_api;