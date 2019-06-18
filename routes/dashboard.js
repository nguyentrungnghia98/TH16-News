
const {auth_admin} = require("../middleware/auth_admin")
var async = require('asyncawait/async');
var await = require('asyncawait/await');
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Tag = require('../models/tag.model');
const Post = require('../models/post.model');
module.exports = (router) => {
  router.get('/dashboard',auth_admin, (req, res) => {

    res.render('vwDashboard/dashboard', { layout: 'dashboard.handlebars',user:req.user, rule: req.user.role, script: "dashboard-v2", style: "dashboard" });
  })
  router.get('/dashboard/profile',auth_admin, (req, res) => {
    res.render('vwDashboard/dashboard-profile', { layout: 'dashboard.handlebars',user:req.user, rule: req.user.role, script: "profile", style: "profile" });
  })
  router.get('/dashboard/posts',auth_admin,async (req, res) => {
    //query status
    console.log('query',req.query)
    let status = 'draft'
    try{
      let posts = []
      const allPosts = await Post.find({}).sort( { created_at: -1 } ).populate('tags categories createBy verifyBy denyBy');
      if(req.query && req.query.status){
        if(req.query.status == 'denied' || req.query.status == 'verified') status = req.query.status
      }
      let filterByStatus = allPosts.filter(post=> post.status == status)
      if(req.user.role!='admin'){
        if(req.user.role == 'writer'){
          posts = filterByStatus.filter(post => {
            if(post.createBy){
              return post.createBy._id.toString() == req.user._id.toString()
            }else{
              return false
            }
          })
        }else{
          //editor
          if(status == 'draft'){
            if(req.user.managerCategories && req.user.managerCategories.length >0){
              posts = filterByStatus.filter(post => {
                let check = false
                if(!post.categories || post.categories.length == 0) return true
                post.categories.forEach(cate => {
                  req.user.managerCategories.forEach(manager =>{
                    if(manager.toString() == cate._id.toString()){
                      check = true
                    }
                  })
                })
                console.log('check',check, )
                return check
              })
            }else{
              posts = []
            }
          }else{
            posts = filterByStatus.filter(post => {
              if(post.createBy){
                return post.createBy._id.toString() == req.user._id.toString()
              }else{
                return false
              }
            })
          }
        }
      }else{
        posts = filterByStatus
      }
      res.render('vwDashboard/list-posts', { layout: 'dashboard.handlebars',status, user:req.user, rule: req.user.role, posts, script: "list-posts", style: "list-posts", haveDataTable: true});
    }catch(err){
      console.log('err',err)
      res.render('vwDashboard/error', { layout: 'dashboard.handlebars',user:req.user, rule: req.user.role });
    }
  })
  router.get('/dashboard/add-post',auth_admin, async (req, res) => {

    if(!req.user || req.user.role == 'editor') return res.render('vwDashboard/access-denied', { layout: 'dashboard.handlebars' ,user:req.user, rule: req.user.role});
    try{
      let categories
      let tags
      let task = []
      task.push(Tag.find({}).sort( { created_at: -1 } ).then(res=>{
        tags = res
        if(!tags) tags = []
      }))
      task.push( Category.find({ }).sort( { created_at: -1 } ).then(res=>{
        categories = res;
        if(!categories) categories = []
      }))
      await Promise.all(task)
      res.render('vwDashboard/add-post', { layout: 'dashboard.handlebars',user:req.user, rule: req.user.role,  categories, tags, script: "add-post", style: "add-post",  haveEditor: true });
    }catch(err){
      console.log('err',err)
      res.render('vwDashboard/error', { layout: 'dashboard.handlebars',user:req.user, rule: req.user.role, });
    }  
  })
  router.get('/dashboard/post/:id',auth_admin,  async (req, res) => {
    try{
      console.log('id',req.params.id)
      if(!req.params.id) return res.render('vwDashboard/dashboard-404', { layout: 'dashboard.handlebars',customerPath:'../', rule: req.user.role });
      let categories
      let tags
      let post 
      let task = []
      task.push(Post.findById( req.params.id).populate('tags categories createBy verifyBy denyBy').then(res=>{
        post = res
        if(!post) post = {}
      }))
      task.push(Tag.find({}).sort( { created_at: -1 } ).then(res=>{
        tags = res
        if(!tags) tags = []
      }))
      task.push( Category.find({ }).sort( { created_at: -1 } ).then(res=>{
        categories = res;
        if(!categories) categories = []
      }))
      await Promise.all(task)
      res.render('vwDashboard/edit-post', { layout: 'dashboard.handlebars', customerPath:'../', user:req.user, rule: req.user.role,categories, tags, post, script: "edit-post", style: "add-post", haveDatepicker:true, haveEditor: true });
    }catch(err){
      console.log('err',err)
      res.render('vwDashboard/error', { layout: 'dashboard.handlebars',customerPath:'../', user:req.user, rule: req.user.role });
    }
    
  })
  router.get('/dashboard/categories',auth_admin, async (req, res) => {
      
    try{
      const categories = await Category.find({}).sort( { created_at: -1 } ).populate('parent_categories');
      if(!categories) categories = []
      parent_categories = categories.filter(cate=> !cate.parent_categories || cate.parent_categories.length == 0)
      if(!parent_categories) parent_categories = []
      res.render('vwDashboard/categories-dashboard', { layout: 'dashboard.handlebars',user:req.user, rule: req.user.role, categories, parent_categories, script: "categories", style: "categories", haveDataTable: true });
    }catch(err){
      console.log('err',err)
      res.render('vwDashboard/error', { layout: 'dashboard.handlebars',user:req.user, rule: req.user.role });
    }
  })
  router.get('/dashboard/manager-categories',auth_admin, async (req, res) => {
      
    try{
      let user = await User.findById(req.user._id).populate('managerCategories')
      const categories = user.managerCategories
      parent_categories = categories.filter(cate=> !cate.parent_categories || cate.parent_categories.length == 0)
      if(!parent_categories) parent_categories = []
      res.render('vwDashboard/manager-categories', { layout: 'dashboard.handlebars',readMode:true, user:req.user, rule: req.user.role, categories, parent_categories, script: "categories", style: "categories", haveDataTable: true });
    }catch(err){
      console.log('err',err)
      res.render('vwDashboard/error', { layout: 'dashboard.handlebars',user:req.user, rule: req.user.role });
    }
  })
  router.get('/dashboard/tags',  auth_admin, async (req, res) => {
   
    try{
      const tags = await Tag.find({}).sort( { created_at: -1 } );
      if(!tags) tags = []
      res.render('vwDashboard/tags-dashboard', { layout: 'dashboard.handlebars',user:req.user, rule: req.user.role, tags, script: "tags", style: "tags", haveDataTable: true });
    }catch(err){
      console.log('err',err)
      res.render('vwDashboard/error', { layout: 'dashboard.handlebars' ,user:req.user, rule: req.user.role});
    }
  })

  router.get('/dashboard/users',auth_admin, async (req, res) => { 
      try{
        let roles = [
          { code: 'writer', display: "Writer", link: "", loadDone: true },
          { code: 'editor', display: "Editor", link: "", loadDone: true },
          { code: 'admin', display: "Admin", link: "", loadDone: true },
        ]


        let categories
        let result
        let task = []
        task.push(User.find({}).sort( { created_at: -1 } ).populate('managerCategories').then(res=>{
          result = res
          if(!result) result = [] 
        }))
        task.push( Category.find({ }).sort( { created_at: -1 } ).then(res=>{
          categories = res;
          if(!categories) categories = []
        }))
        await Promise.all(task)
        const verifyUsers = result.filter(user => !user.isAccepted && user.role != "subscriber")
        const users = result.filter(user => user.isAccepted && user.role != "subscriber")
        res.render('vwDashboard/users', { layout: 'dashboard.handlebars',user:req.user, rule: req.user.role, roles,verifyUsers, users,categories, script: "users", style: 'users' });
      }catch(err){
        console.log('err',err)
        res.render('vwDashboard/error', { layout: 'dashboard.handlebars' ,user:req.user, rule: req.user.role});
      }
  })
  router.get('/dashboard/subscribers',auth_admin, async (req, res) => { 
    try{
      const users = await User.find({role:'subscriber'}).sort( { created_at: -1 } );
      if(!users) users = [] 
      res.render('vwDashboard/subscribers', { layout: 'dashboard.handlebars',user:req.user, rule: req.user.role, users, script: "subscribers", style: 'subscribers', haveDataTable: true,haveDatepicker:true });
    }catch(err){
      console.log('err',err)
      res.render('vwDashboard/error', { layout: 'dashboard.handlebars' ,user:req.user, rule: req.user.role});
    }
})
  router.get('/dashboard/*',auth_admin, function (req, res) {
    res.render('vwDashboard/dashboard-404', { layout: 'dashboard.handlebars',user:req.user, rule: req.user.role });
  });

  
}
