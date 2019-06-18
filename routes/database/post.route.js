const Post = require('../../models/post.model');
const auth_api = require('../../middleware/auth_api')
const Category = require('../../models/category.model');
const Tag = require('../../models/tag.model');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
const mongoose = require("mongoose");
const { ObjectID } = require("mongodb");
const auth_user = require('../../middleware/auth_user')
module.exports = router => {

  router
    .route('/api/post')
    .get(async (req, res, next) => {
      try {
        const posts = await Post.find({});

        if (!posts) {
          return res.status(404).send();
        }
        res.send(posts);
      } catch (err) {
        res.status(500).json({ err });
      }
    })
    // Create new category
    .post(auth_api, async (req, res, next) => {
      try {
        const post = new Post(req.body);
        post.status = 'draft'
        post.categories = []
        let categories = JSON.parse(req.body.categories)
        if (categories && categories.length > 0) {
          //check if category is new
          for (let i = 0; i < categories.length; i++) {
            if (categories[i].isNew) {
              let category = await Category.findOne({name : categories[i].name})
              if(!category){
                category = new Category({
                  _id: new mongoose.Types.ObjectId(),
                  name: categories[i].name
                })
                await category.save()
              }
              categories[i] = category
            }
            post.categories.push(ObjectID(categories[i]._id)) 
          }
        }
        post.tags = []
        let tags = JSON.parse(req.body.tags)
        if (tags && tags.length > 0) {
          for (let i = 0; i < tags.length; i++) {
            if (tags[i].isNew) {
              let tag = await Tag.findOne({name : tags[i].name})
                if(!tag){
                  tag = new Tag({
                    _id: new mongoose.Types.ObjectId(),
                    name: tags[i].name
                  })
                  await tag.save()
                }
              tags[i] = tag
            }
            post.tags.push(ObjectID(tags[i]._id)) 
          }
        }
        post.createBy = ObjectID(req.user._id)
        await post.save()
        res.send(post)
      } catch (err) {
        console.log('err',err)
        res.status(500).json({ err });
      }
    })
    .delete(auth_api, (req, res, next) => {
      let items = JSON.parse(req.body.items)
      console.log('items', items)
      if (!items || items.length == 0) {
        res.status(403).json({
          error: 'ids is empty'
        })
      } else {
        Post.remove({ '_id': { '$in': items } }, (err, result) => {
          if (err) return res.status(403).json({
            err
          })
          res.json({
            success: true,
            result
          })
        })
      }
    })

  router
  .route('/api/replycomment/:id')
  .post(auth_user, async (req, res, next) => { 
    console.log('Request Id:', req.params.id, req.body.index, req.body.content);
    if(!req.body.content) return res.status(403).send({ error: 'Content is null!' })
    let index = req.body.index
    try{
      let post = await Post.findById(req.params.id).populate('comments.user comments.replies.user');
      let comment = {
        content: req.body.content,
        commentAt: new Date(),
        user: ObjectID(req.user._id)
      }
      post.comments[index].replies.push(comment)
      await post.save()

      comment.user = req.user
      let length = post.comments[index].replies.length
      post.comments[index].replies[length -1 ] = comment
      res.send(post)
    }catch(err){
      console.log('err',err)
      res.status(500).json({ err });
    }
  })
  router
  .route('/api/comment/:id')
  .post(auth_user, async (req, res, next) => { 
    console.log('Request Id:', req.params.id);
    if(!req.body.content) return res.status(403).send({ error: 'Content is null!' })
    try{
      let post = await Post.findById(req.params.id).populate('comments.user comments.replies.user');
      let comment = {
        content: req.body.content,
        commentAt: new Date(),
        user: ObjectID(req.user._id)
      }
      post.comments.push(comment)
      await post.save()

      comment.user = req.user
      post.comments[post.comments.length -1 ] = comment
      res.send(post)
    }catch(err){
      console.log('err',err)
      res.status(500).json({ err });
    }
  })
  // Get post
  router
    .route('/api/post/:id')
    .get(async (req, res, next) => {
      try {
        const post = await Post.findById(req.params.id).populate('tags').populate('categories');
        if (!post) {
          return res.status(403).json({ message: "This post does not exist" });
        }
        res.send(post);
      } catch (err) {
        res.status(500).json({ err }); 
      }
    })
    // Update post
    .put(auth_api, async (req, res, next) => {
      console.log('Request Id:', req.params.id);
      const updates = Object.keys(req.body)
      console.log("Fields update ", updates);
      const allowedUpdates = ['name', 'comments', 'priority', 'isPremium','categories', 'tags', 'slug', 'short_description', 'content', 'status', 'thumb', 'views', 'publishAt', 'createBy','verifyBy','denyBy','note_deny']
      const isValidOperation = updates.every((element) => allowedUpdates.includes(element))

      if (!isValidOperation) {
        console.log('sai cu phap')
        return res.status(403).send({ error: 'Some updates fields are invalid!' })
      }

      try {
        let post = await Post.findById(req.params.id);
        if(post.status != req.body.status){
          if(req.body.status == 'denied'){
            post.denyBy = ObjectID(req.user._id)
            post.denyAt = new Date()
          }else{
            post.verifyBy = ObjectID(req.user._id)
            post.verifyAt = new Date()
          }
        }
        updates.forEach((element) => post[element] = req.body[element])
        if(req.body.categories){
          post.categories = []
          let categories = JSON.parse(req.body.categories)
          if (categories && categories.length > 0) {
            //check if category is new
            for (let i = 0; i < categories.length; i++) {
              if (categories[i].isNew) {
                let category = await Category.findOne({name : categories[i].name})
                if(!category){
                  category = new Category({
                    _id: new mongoose.Types.ObjectId(),
                    name: categories[i].name
                  })
                  await category.save()
                }
                categories[i] = category
              }
              post.categories.push(ObjectID(categories[i]._id)) 
            }
          }
        }
       if(req.body.tags){
        post.tags = []
        let tags = JSON.parse(req.body.tags)
        if (tags && tags.length > 0) {
          for (let i = 0; i < tags.length; i++) {
            if (tags[i].isNew) {
              let tag = await Tag.findOne({name : tags[i].name})
                if(!tag){
                  tag = new Tag({
                    _id: new mongoose.Types.ObjectId(),
                    name: tags[i].name
                  })
                  await tag.save()
                }
              tags[i] = tag
            }
            post.tags.push(ObjectID(tags[i]._id)) 
          }
        }
       }
        await post.save();
        res.send(post)

      } catch (err) {
        console.log('err',err)
        res.status(500).json({ err });
      }
    })

    // delete Post
    .delete(auth_api, async (req, res, next) => {
      try {
        let post = await Post.findById(req.params.id);
        if (!post) return res.status(403).json({ message: "Post not found" })
        console.log(post);
        await post.remove()
        console.log("đã xóa --------------");
        res.send(post);
      } catch (err) {
        res.status(500).json({ err });
      }
    })

}