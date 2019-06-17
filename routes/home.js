
var moment = require('moment');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Tag = require('../models/tag.model');
const Post = require('../models/post.model');
let navCategories
let posts
let categories
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
function getRelatePosts(post,posts){
  let relatePosts = []
  if(post.categories){
    for(let k = 0; k< post.categories.length; k++){
      if(relatePosts.length == 5)  break;
      let cate = post.categories[k]
      for(let j = 0; j< posts.length; j++){
        if(relatePosts.length == 5)  break;
        let item = posts[j]
        if(item.categories){
          for(let i = 0; i< item.categories.length; i++){
            let tmp = item.categories[i]
            if(tmp._id == cate._id){
              relatePosts.push(item)
              break;
            }
          }
        }
      }
    }
  }
  return relatePosts
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
var avoidCallTwoTime = 0
function increaseViewPost(post){
  avoidCallTwoTime ++
  if(avoidCallTwoTime % 2 != 0) return
  console.log('increaseViewPost was call')
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
      if((lastView.getDate() == now.getDate())&&(lastView.getMonth() == now.getMonth())&&(lastView.getFullYear() == now.getFullYear())){
        console.log('same date')
        post.view.views[post.view.views.length-1].count += 1
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
  let arr = [...posts]
  return arr.sort(function(a, b){return b.view.viewsWeek-a.view.viewsWeek}).slice(0,4);
}
function getMostView(posts){
  let arr = [...posts]
  return arr.sort(function(a, b){return b.view.total-a.view.total}).slice(0,10);
}
function getMostCategory(posts,categories){
  let arr = [...categories]
  for(let i = 0; i<arr.length; i++){
    let count=0
    let newPost = posts[0]
    for(let j = 0; j<posts.length; j++){
      let post = posts[j]
      if(post.categories && post.categories.length>0){
        for(let k = 0; k<post.categories.length; k++){
          let cate = post.categories[k]
          if(cate._id.toString() == arr[i]._id.toString()){
            count += post.view.total
            let newPostDate = new Date(newPost.created_at)
            let postDate = new Date(post.created_at)
            if(postDate > newPostDate){
              newPost = post
            }
            break;
          }
        }
      }
    }
    Object.assign(arr[i],{newPost:newPost })
    Object.assign(arr[i],{count})
  }
  return arr.sort(function(a, b){return b.count-a.count}).slice(0,10);
}
async function getPostAndCategory(){
  let task = []
  task.push(Post.find().populate('tags categories createBy').then(res=>{
    posts = res
    if(!posts) posts = []
  }))
  task.push(await Category.find({}).sort( { created_at: -1 } ).populate('parent_categories').then(res=>{
    categories = res;
    if(!categories) categories = []
  }))
  await Promise.all(task)
}
module.exports = (router) => {
  router.get('/',async (req, res) => {
    try{
      await getPostAndCategory()
      let popularCategories = getMostCategory(posts,categories)
      calNavCategories(categories)
      res.render('vwHome/index', { 
        mostViewWeek: getMostViewWeek(posts),
        mostView: getMostView(posts),
        popularCategories,
        posts: posts.slice(0,10), navCategories, user: req.user, havPartical: true });
    }catch(err){
      console.log('err',err)
      res.render('vwHome/error', { user:req.user });
    }  
    
  })

  router.get('/category/:id', async (req, res) => {
    try{
      console.log('id',req.params.id)
      let page = 1
      let limit = 10
      if(req.query && req.query.page){
        if(!isNaN(req.query.page) &&  req.query.page > 0 ) {
          page = req.query.page
        }else{
          page = 0
        }
      }

      if(!req.params.id) return res.render('404', { user: req.user });

      const posts = await Post.find().populate('tags categories createBy');
      if(!posts) posts = {}
      const categories = await Category.find({}).sort( { created_at: -1 } ).populate('parent_categories');
      if(!categories) categories = []
      let category = categories.find(cate=> cate._id == req.params.id)
      if(!category) return res.render('404', { user: req.user });
      let postsByCategory = posts.filter(post=>{
        let check = false
        for(let i = 0 ; i < post.categories.length; i++){
          if(category._id.toString() == post.categories[i]._id.toString()){
            check=true;
            break;
          }
        }
        return check
      })
      let postsByPage = []
      if(page > 0){
        for(let i = (page-1)*limit; i<postsByCategory.length; i++){
          if(postsByPage.length == limit) break;
          postsByPage.push(postsByCategory[i])
        }
      }

      let popularCategories = getMostCategory(posts,categories)
      calNavCategories(categories)
      let totalPage = 0
      if(postsByCategory.length){
        totalPage =  Math.floor(postsByCategory.length/limit)
        if(postsByCategory.length%limit != 0){
          totalPage+=1
        }
      } 
      res.render('vwHome/category', {mostView: getMostView(posts),popularCategories, posts: postsByPage,
        totalPage ,currentPage: page,
        user:req.user,  navCategories,customerPath:'../', category, style: "category" })
    }catch(err){
      console.log('err',err)
      res.render('vwHome/error', { user:req.user });
    }
    
  })
  router.get('/tag/:id', async (req, res) => {
    try{
      console.log('id tag',req.params.id)
      let page = 1
      let limit = 10
      if(req.query && req.query.page){
        if(!isNaN(req.query.page) &&  req.query.page > 0 ) {
          page = req.query.page
        }else{
          page = 0
        }
      }

      if(!req.params.id) return res.render('404', { user: req.user });

      const posts = await Post.find().populate('tags categories createBy');
      if(!posts) posts = {}
      const categories = await Category.find({}).sort( { created_at: -1 } ).populate('parent_categories');
      if(!categories) categories = []
      let tags = await Tag.find({}).sort( { created_at: -1 } )
      if(!tags) tags = []
      let tag = tags.find(el=> el._id == req.params.id)
      if(!tag) return res.render('404', { user: req.user });
      let postsByTag = posts.filter(post=>{
        let check = false
        for(let i = 0 ; i < post.tags.length; i++){
          if(tag._id.toString() == post.tags[i]._id.toString()){
            check=true;
            break;
          }
        }
        return check
      })
      let postsByPage = []
      if(page > 0){
        for(let i = (page-1)*limit; i<postsByTag.length; i++){
          if(postsByPage.length == limit) break;
          postsByPage.push(postsByTag[i])
        }
      }
      calNavCategories(categories)
      let totalPage = 0
      if(postsByTag.length){
        totalPage =  Math.floor(postsByTag.length/limit)
        if(postsByTag.length%limit != 0){
          totalPage+=1
        }
      } 
      res.render('vwHome/tag', {mostView: getMostView(posts),tags, posts: postsByPage,
        totalPage ,currentPage: page,
        user:req.user,  navCategories,customerPath:'../', tag, style: "category" })
    }catch(err){
      console.log('err',err)
      res.render('vwHome/error', { user:req.user });
    }
    
  })
  router.get('/post/:id',async (req, res) => {
    try{
      console.log('id',req.params.id)
      if(!req.params.id) return res.render('404', { user: req.user });
      let task = []
      task.push(Post.find().populate('tags categories createBy').populate('comments.user comments.replies.user').then(res=>{
        posts = res
        if(!posts) posts = []
      }))
      task.push(await Category.find({}).sort( { created_at: -1 } ).populate('parent_categories').then(res=>{
        categories = res;
        if(!categories) categories = []
      }))
      await Promise.all(task)
      let post = posts.find(el=> el._id == req.params.id)
      if(!post)  return res.render('404', { user: req.user });
      calNavCategories(categories)
      increaseViewPost(post)
      res.render('vwHome/post-detail', { user:req.user, posts: getMostView(posts), relatePosts: getRelatePosts(post,posts), navCategories,customerPath:'../', post, style: "post-detail" })
    }catch(err){
      console.log('err',err)
      res.render('vwHome/error', { user:req.user });
    }

    
  })


  router.get('/contact',async (req, res) => {
    try{
      const categories = await Category.find({}).sort( { created_at: -1 } ).populate('parent_categories');
      if(!categories) categories = []
      calNavCategories(categories)
      res.render('vwHome/contact', { navCategories, style: "contact" }) 
    }catch(err){
      console.log('err',err)
      res.render('vwHome/error', { user:req.user });
    }
    
  })
  
}
