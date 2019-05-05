const express = require("express");
const router = express.Router();
const {posts, users, categories, tags} = require("../server/defaultData")
let navCategories
function calNavCategories(){
  if(!navCategories){
    navCategories = []
    categories.forEach(cate => {
      let tmp = cate
      tmp.childCategories = []
      categories.forEach(el=>{
        if(el.id != cate.id && el.parent_categories){
          for(let parent of  el.parent_categories){
            if(parent.id == tmp.id ){
              tmp.childCategories.push(el)
              break;
            }
          }
        }
      })
      if(!tmp.parent_categories || tmp.parent_categories.length == 0){
        navCategories.push(tmp)
      }
    })
  }
}


router.get('/',(req,res)=>{
  calNavCategories()
  res.render('index',{posts,navCategories,havPartical:true});
})

router.get('/Technology', (req, res) => {
  calNavCategories()
  res.render('category', {posts,navCategories, categoryName: "technogoly", style: "category"})
})

router.get('/postDetail', (req, res) => {
  calNavCategories()
  res.render('post-detail', {posts, navCategories, post_0: posts[0], post_1: posts[1], post_2:posts[2], post_3: posts[3], post_4: posts[4], categoryName: "Technology" ,  style: "post-detail"})
})


router.get('/profile', (req, res) => {
  res.render('profile', {style:"profile"})
})

router.get('/contact', (req, res) => {
  calNavCategories()
  res.render('contact', {navCategories,style:"contact"})
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