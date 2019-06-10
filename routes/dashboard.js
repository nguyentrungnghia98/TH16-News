
const auth_admin = require("../middleware/auth_admin")
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var userRule = 'admin'
const User = require('../models/user.model');
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

    res.render('vwDashboard/dashboard', { layout: 'dashboard.handlebars', rule: userRule, posts, script: "dashboard-v2", style: "dashboard" });
  })
  router.get('/dashboard/profile', (req, res) => {
    res.render('vwDashboard/dashboard-profile', { layout: 'dashboard.handlebars', script: "profile", style: "profile" });
  })
  router.get('/dashboard/posts', (req, res) => {
    res.render('vwDashboard/list-posts', { layout: 'dashboard.handlebars', rule: userRule, posts, script: "list-posts", style: "list-posts", haveDataTable: true, haveEditor: true });
  })
  router.get('/dashboard/add-post', (req, res) => {
    res.render('vwDashboard/list-posts', { layout: 'dashboard.handlebars', rule: userRule, mode: 'add', posts, script: "list-posts", style: "list-posts", haveDataTable: true, haveEditor: true });
  })
  router.get('/dashboard/categories', (req, res) => {
    console.log('rule cate', userRule)
    if (userRule == "admin") {
      res.render('vwDashboard/categories-dashboard', { layout: 'dashboard.handlebars', rule: userRule, categories, script: "categories", style: "categories", haveDataTable: true });
    } else {
      res.render('vwDashboard/access-denied', { layout: 'dashboard.handlebars', rule: userRule });
    }
  })
  router.get('/dashboard/add-category', (req, res) => {
    if (userRule == "admin") {
      res.render('vwDashboard/categories-dashboard', { layout: 'dashboard.handlebars', rule: userRule, mode: "add", categories, script: "categories", style: "categories", haveDataTable: true });
    } else {
      res.render('vwDashboard/access-denied', { layout: 'dashboard.handlebars', rule: userRule });
    }
  })
  router.get('/dashboard/tags', (req, res) => {
    if (userRule == "admin") {
      res.render('vwDashboard/tags-dashboard', { layout: 'dashboard.handlebars', rule: userRule, tags, script: "tags", style: "tags", haveDataTable: true });
    } else {
      res.render('vwDashboard/access-denied', { layout: 'dashboard.handlebars', rule: userRule });
    }
  })
  router.get('/dashboard/add-tag', (req, res) => {
    if (userRule == "admin") {
      res.render('vwDashboard/tags-dashboard', { layout: 'dashboard.handlebars', rule: userRule, mode: "add", tags, script: "tags", style: "tags", haveDataTable: true });
    } else {
      res.render('vwDashboard/access-denied', { layout: 'dashboard.handlebars', rule: userRule });
    }
  })
  router.get('/dashboard/users',auth_admin, async (req, res) => { 
      try{
        let roles = [
          { code: 'writer', display: "Writer", link: "", loadDone: true },
          { code: 'editor', display: "Editor", link: "", loadDone: true },
          { code: 'admin', display: "Admin", link: "", loadDone: true },
        ]
        const result = await User.find({});
        if(!result) result = []
        const verifyUsers = result.filter(user => !user.isAccepted && user.role != "subscriber")
        const users = result.filter(user => user.isAccepted && user.role != "subscriber")
        res.render('vwDashboard/users', { layout: 'dashboard.handlebars', rule: req.user.role, roles,verifyUsers, users, script: "users", style: 'users' });
      }catch(err){
        console.log('err',err)
        res.render('vwDashboard/error', { layout: 'dashboard.handlebars' });
      }
  })
  router.get('/dashboard/*', function (req, res) {
    res.render('vwDashboard/dashboard-404', { layout: 'dashboard.handlebars', rule: userRule });
  });

  
}
