
var moment = require('moment');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Tag = require('../models/tag.model');
const Post = require('../models/post.model');
let navCategories
function calNavCategories(categories) {
    navCategories = []
    categories.forEach(cate => {
      let tmp = cate
      tmp.childCategories = []
      categories.forEach(el => {
        if (el._id != cate._id && el.parent_categories) {
          for (let parent of el.parent_categories) {
            if (parent.id == tmp._id) {
              tmp.childCategories.push(el)
              break;
            }
          }
        }
      })
      if (!tmp.parent_categories || tmp.parent_categories.length == 0) {
        navCategories.push(tmp)
      }
    })
}
function calViewWeek(views){
  let count = 0
  let now = moment()
  for(let i = views.length - 1 ; i >= 0;i--){
    let time = moment(views[i].viewAt)
    if(now.diff(time,'days')<=7){
      count+= views[i].count
    }else{
      break;
    }
  }
  return count
}
function increaseViewPost(post){
  try{
    let views = post.view.views
    if(!views || views.length == 0){
      post.view.views = [{
        count: 1,
        viewAt: new Date()
      }]
      post.view.total = 1
      post.view.viewsWeek = 1
      post.save()
    }else{
      let last = post.view.views[post.view.views.length-1]
      let lastView = new Date(last.viewAt)
      console.log('lastView',lastView)
      let now = new Date()
      if((lastView.getDate() == now.getDate())&&(lastView.getMonth() == now.getMonth())&&(lastView.getFullYear() == now.getFullYear)){
        post.view.views[post.view.views.length].count += 1
      }else{
        post.view.views.push({
          count: 1,
          viewAt: new Date()
        })
      }
      post.view.total += 1
      post.view.viewsWeek = calViewWeek(post.view.views)
      post.save()
    }
  }catch(err){
    console.log('err',err)
  }
}
function getMostViewWeek(posts){

}
function getMostView(posts){
  let arr = [...posts]
  return arr.sort
}
module.exports = (router) => {
  router.get('/',async (req, res) => {
    try{
      const categories = await Category.find({}).sort( { created_at: -1 } ).populate('parent_categories');
      if(!categories) categories = []
      const posts = await Post.find({}).sort( { created_at: -1 } ).populate('tags categories createBy');
      if(!posts) posts = []
      calNavCategories(categories)
      res.render('vwHome/index', { posts, navCategories, user: req.user, havPartical: true });
    }catch(err){
      console.log('err',err)
      res.render('vwHome/error', { user:req.user });
    }  
    
  })

  router.get('/Technology', (req, res) => {
    calNavCategories()
    res.render('vwHome/category', { posts, navCategories, categoryName: "technogoly", style: "category" })
  })

  router.get('/post/:id',async (req, res) => {
    try{
      console.log('id',req.params.id)
      if(!req.params.id) return res.render('404', { user: req.user });
      const posts = await Post.find().populate('tags categories createBy');
      if(!posts) posts = {}
      let post = posts.find(el=> el._id == req.params.id)
      const categories = await Category.find({}).sort( { created_at: -1 } ).populate('parent_categories');
      if(!categories) categories = []
      calNavCategories(categories)
      increaseViewPost(post)
      res.render('vwHome/post-detail', { posts, navCategories,customerPath:'../', post, style: "post-detail" })
    }catch(err){
      console.log('err',err)
      res.render('vwHome/error', { user:req.user });
    }

    
  })

  // Chua tao profile.handlebar
  router.get('/profile', (req, res) => {
    res.render('vwHome/profile', { style: "profile" })
  })

  router.get('/contact', (req, res) => {
    calNavCategories()
    res.render('vwHome/contact', { navCategories, style: "contact" })
  })
  
}
