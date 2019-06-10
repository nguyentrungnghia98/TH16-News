
const auth_admin = require("../middleware/auth_admin")

var userRule = 'admin'
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

    res.render('dashboard', { layout: 'dashboard.handlebars', rule: userRule, posts, script: "dashboard-v2", style: "dashboard" });
  })
  router.get('/dashboard/profile', (req, res) => {
    res.render('dashboard-profile', { layout: 'dashboard.handlebars', script: "profile", style: "profile" });
  })
  router.get('/dashboard/posts', (req, res) => {
    res.render('list-posts', { layout: 'dashboard.handlebars', rule: userRule, posts, script: "list-posts", style: "list-posts", haveDataTable: true, haveEditor: true });
  })
  router.get('/dashboard/add-post', (req, res) => {
    res.render('list-posts', { layout: 'dashboard.handlebars', rule: userRule, mode: 'add', posts, script: "list-posts", style: "list-posts", haveDataTable: true, haveEditor: true });
  })
  router.get('/dashboard/categories', (req, res) => {
    console.log('rule cate', userRule)
    if (userRule == "admin") {
      res.render('categories-dashboard', { layout: 'dashboard.handlebars', rule: userRule, categories, script: "categories", style: "categories", haveDataTable: true });
    } else {
      res.render('access-denied', { layout: 'dashboard.handlebars', rule: userRule });
    }
  })
  router.get('/dashboard/add-category', (req, res) => {
    if (userRule == "admin") {
      res.render('categories-dashboard', { layout: 'dashboard.handlebars', rule: userRule, mode: "add", categories, script: "categories", style: "categories", haveDataTable: true });
    } else {
      res.render('access-denied', { layout: 'dashboard.handlebars', rule: userRule });
    }
  })
  router.get('/dashboard/tags', (req, res) => {
    if (userRule == "admin") {
      res.render('tags-dashboard', { layout: 'dashboard.handlebars', rule: userRule, tags, script: "tags", style: "tags", haveDataTable: true });
    } else {
      res.render('access-denied', { layout: 'dashboard.handlebars', rule: userRule });
    }
  })
  router.get('/dashboard/add-tag', (req, res) => {
    if (userRule == "admin") {
      res.render('tags-dashboard', { layout: 'dashboard.handlebars', rule: userRule, mode: "add", tags, script: "tags", style: "tags", haveDataTable: true });
    } else {
      res.render('access-denied', { layout: 'dashboard.handlebars', rule: userRule });
    }
  })
  router.get('/dashboard/users', (req, res) => {
    if (userRule == "admin") {
      let roles = [
        { code: 'admin', display: "Admin", link: "", loadDone: true },
        { code: 'write', display: "Write", link: "", loadDone: true },
        { code: 'read', display: "Read", link: "", loadDone: true },
      ]
      res.render('users', { layout: 'dashboard.handlebars', rule: userRule, roles, users, script: "users", style: 'users' });
    } else {
      res.render('access-denied', { layout: 'dashboard.handlebars', rule: userRule });
    }
  })
  router.get('/dashboard/*', function (req, res) {
    res.render('dashboard-404', { layout: 'dashboard.handlebars', rule: userRule });
  });

  
}
