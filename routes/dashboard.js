
const auth_admin = require("../middleware/auth_admin")
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var userRule = 'admin'
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Tag = require('../models/tag.model');
const Post = require('../models/post.model')
module.exports = (router) => {

  const { posts, users, categories, tags } = require("../server/defaultData")
  // Admin
  router
    .route("/dashboard/update-rule")
    .post((req, res, next) => {

      userRule = req.body.rule
      console.log('userRule', userRule)
      res.json({
        success: true,
        message: "Update rule user success!"
      });
    })
  router.get('/dashboard',auth_admin, (req, res) => {

    res.render('vwDashboard/dashboard', { layout: 'dashboard.handlebars', rule: req.user.role, posts, script: "dashboard-v2", style: "dashboard" });
  })
  router.get('/dashboard/profile',auth_admin, (req, res) => {
    res.render('vwDashboard/dashboard-profile', { layout: 'dashboard.handlebars', script: "profile", style: "profile" });
  })
  router.get('/dashboard/posts',auth_admin, (req, res) => {
    res.render('vwDashboard/list-posts', { layout: 'dashboard.handlebars', rule: req.user.role, posts, script: "list-posts", style: "list-posts", haveDataTable: true, haveEditor: true });
  })
  router.get('/dashboard/add-post', auth_admin, (req, res) => {
    res.render('vwDashboard/list-posts', { layout: 'dashboard.handlebars', rule: req.user.role, mode: 'add', posts, script: "list-posts", style: "list-posts", haveDataTable: true, haveEditor: true });
  })
  router.get('/dashboard/categories', auth_admin, async (req, res) => {
    try{
      const categories = await Category.find({}).sort( { created_at: -1 } );
      if(!categories) categories = []
      res.render('vwDashboard/categories-dashboard', { layout: 'dashboard.handlebars', rule: req.user.role, categories, script: "categories", style: "categories", haveDataTable: true });
    }catch(err){
      console.log('err',err)
      res.render('vwDashboard/error', { layout: 'dashboard.handlebars' });
    }
  })
  // router.get('/dashboard/add-category', (req, res) => {
  //   if (userRule == "admin") {
  //     res.render('vwDashboard/categories-dashboard', { layout: 'dashboard.handlebars', rule: req.user.role, mode: "add", categories, script: "categories", style: "categories", haveDataTable: true });
  //   } else {
  //     res.render('vwDashboard/access-denied', { layout: 'dashboard.handlebars', rule: req.user.role });
  //   }
  // })
  router.get('/dashboard/tags', auth_admin, (req, res) => {
    if (userRule == "admin") {
      res.render('vwDashboard/tags-dashboard', { layout: 'dashboard.handlebars', rule: req.user.role, tags, script: "tags", style: "tags", haveDataTable: true });
    } else {
      res.render('vwDashboard/access-denied', { layout: 'dashboard.handlebars', rule: req.user.role });
    }
  })
  // router.get('/dashboard/add-tag', (req, res) => {
  //   if (userRule == "admin") {
  //     res.render('vwDashboard/tags-dashboard', { layout: 'dashboard.handlebars', rule: req.user.role, mode: "add", tags, script: "tags", style: "tags", haveDataTable: true });
  //   } else {
  //     res.render('vwDashboard/access-denied', { layout: 'dashboard.handlebars', rule: req.user.role });
  //   }
  // })
  router.get('/dashboard/users',auth_admin, async (req, res) => { 
      try{
        let roles = [
          { code: 'writer', display: "Writer", link: "", loadDone: true },
          { code: 'editor', display: "Editor", link: "", loadDone: true },
          { code: 'admin', display: "Admin", link: "", loadDone: true },
        ]
        const result = await User.find({}).sort( { created_at: -1 } );
        if(!result) result = []
        const verifyUsers = result.filter(user => !user.isAccepted && user.role != "subscriber")
        const users = result.filter(user => user.isAccepted && user.role != "subscriber")
        res.render('vwDashboard/users', { layout: 'dashboard.handlebars', rule: req.user.role, roles,verifyUsers, users, script: "users", style: 'users' });
      }catch(err){
        console.log('err',err)
        res.render('vwDashboard/error', { layout: 'dashboard.handlebars' });
      }
  })
  router.get('/dashboard/*',auth_admin, function (req, res) {
    res.render('vwDashboard/dashboard-404', { layout: 'dashboard.handlebars', rule: req.user.role });
  });

  
}
