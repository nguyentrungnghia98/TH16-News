const express = require("express");
const router = express.Router();
const {posts} = require("../server/defaultData")

router.get('/',(req,res)=>{
  res.render('index',{posts, style: "home"});
})

router.get('/Technology', (req, res) => {
  res.render('category', {posts, categoryName: "technogoly", style: "category"})
})

router.get('/postName', (req, res) => {
  res.render('post-detail', {posts,post_0: posts[0], post_1: posts[1], post_2:posts[2], post_3: posts[3], post_4: posts[4], categoryName: "Technology" ,  style: "post-detail"})
})

router.get('/test', (req, res) => {
  res.render('test', {posts})
})

router.get('/profile', (req, res) => {
  res.render('profile', {style:"profile"})
})

router.get('/contact', (req, res) => {
  res.render('contact', {style:"contact"})
})

module.exports = router;