
const auth_user = async (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ error: 'Permisstion require!' })
  } else {
     next();
  }
}


module.exports = auth_user;