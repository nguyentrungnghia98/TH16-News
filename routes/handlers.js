const express = require("express");
const router = express.Router();
const {posts, users, categories, tags} = require("../server/defaultData")
router.get('/',(req,res)=>{
  res.render('index',{posts});
})
router.get('/login',(req,res)=>{
  res.render('login',{layout: 'login.handlebars',  script:"login",style:"login"});
})
router.get('/dashboard',(req,res)=>{
  res.render('dashboard',{layout: 'dashboard.handlebars', posts, script:"dashboard-v2",style:"dashboard"});
})
router.get('/dashboard/profile',(req,res)=>{
  res.render('dashboard-profile',{layout: 'dashboard.handlebars', script:"profile",style:"profile"});
})
router.get('/dashboard/posts',(req,res)=>{
  res.render('list-posts',{layout: 'dashboard.handlebars', posts, script:"list-posts",style:"list-posts", haveDataTable:true,haveEditor:true});
})
router.get('/dashboard/add-post',(req,res)=>{
  res.render('list-posts',{layout: 'dashboard.handlebars', mode:'add', posts, script:"list-posts",style:"list-posts", haveDataTable:true,haveEditor:true});
})
router.get('/dashboard/categories',(req,res)=>{
  res.render('categories-dashboard',{layout: 'dashboard.handlebars', categories, script:"categories",style:"categories", haveDataTable:true});
})
router.get('/dashboard/add-category',(req,res)=>{
  res.render('categories-dashboard',{layout: 'dashboard.handlebars',mode:"add", categories, script:"categories",style:"categories", haveDataTable:true});
})
router.get('/dashboard/tags',(req,res)=>{
  res.render('tags-dashboard',{layout: 'dashboard.handlebars', tags, script:"tags",style:"tags", haveDataTable:true});
})
router.get('/dashboard/add-tag',(req,res)=>{
  res.render('tags-dashboard',{layout: 'dashboard.handlebars',mode:"add", tags, script:"tags",style:"tags", haveDataTable:true});
})
router.get('/dashboard/users',(req,res)=>{
  let roles= [
    {code:'admin',display:"Admin",link:"",loadDone:true},
    {code:'write',display:"Write",link:"",loadDone:true},
    {code:'read',display:"Read",link:"",loadDone:true},
  ]
  res.render('users',{layout: 'dashboard.handlebars',roles, users, script:"users", style:'users'});
})
router.get('/dashboard/*', function(req, res){
  res.render('dashboard-404',{layout: 'dashboard.handlebars'});
});
module.exports = router;