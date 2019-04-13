const express = require("express");
const router = express.Router();
const {posts} = require("../server/defaultData")
router.get('/',(req,res)=>{
  res.render('index',{posts});
})

module.exports = router;