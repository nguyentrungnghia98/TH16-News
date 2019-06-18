
const Category = require('../../models/category.model');
const auth_api = require('../../middleware/auth_api')
const { ObjectID } = require("mongodb");
var async = require('asyncawait/async');
var await = require('asyncawait/await');
module.exports = router => {
    console.log('category route')
    // Create new category
    router
    .route('/api/category')
    .get( async (req, res, next) => {
      try {
          const categories = await Category.find({});

          if (!categories) {
              return res.status(404).send();
          } 
         res.send(categories);
      } catch (err) {
          res.status(500).json({err});
      }
    })
    .post( auth_api, async (req, res, next) => {
        const category = new Category(req.body);
        category.parent_categories = null
        let parent_categories =  req.body.parent_categories?JSON.parse(req.body.parent_categories):null
        if(parent_categories && parent_categories.length >0){
          category.parent_categories = parent_categories.map(cate => ObjectID(cate))
        }
        try {
            await category.save()
            res.send(category)
        } catch (err) {
            console.log('err',err)
            res.status(500).json({err});
        }
    })
    .delete(auth_api, (req, res, next) => {
      let items = JSON.parse(req.body.items)
      console.log('items',items)
      if(!items || items.length == 0){ 
        res.status(403).json({
          error:'ids is empty'
        })
      }else{
        Category.remove({'_id':{'$in':items}}, (err,result)=>{
          if(err) return res.status(403).json({
            err
          })
          res.json({
            success:true,
            result
          })
        })
      }
    })

 
    

    // Get category
    router
    .route('/api/category/:id')
    .get(async (req, res, next) => {
        try {
            const category = await Category.findById(req.params.id);

            if (!category) {
              return  res.status(403).json({ message: "category is undefined!" });
            } 

            res.send(category);
        } catch (err) {
            res.status(500).json({err});
        }
    })

    .put( auth_api, async (req, res, next) => {
        console.log('Request Id:', req.params.id);
        const updates = Object.keys(req.body)
        console.log("Fields update ",updates);
        const allowedUpdates = ['description', 'image', 'name', 'name_vi', 'slug', 'status', 'created_at','parent_categories']
        const isValidOperation = updates.every((element) => {
          console.log('element',element,allowedUpdates.includes(element))
          return allowedUpdates.includes(element)
        })

        if (!isValidOperation) {
            console.log('sai cu phap')
            return res.status(403).send({ error: 'Some updates fields are invalid!' })
        }

        try {
            let category = await Category.findById(req.params.id);
            updates.forEach((element) => category[element] = req.body[element])

            if(updates.includes('parent_categories')){
              category.parent_categories = null
              let parent_categories = req.body.parent_categories?JSON.parse(req.body.parent_categories):null
              if(parent_categories && parent_categories.length >0){
                category.parent_categories = parent_categories.map(cate => ObjectID(cate))
              }
            }
            
            console.log(category);
            await category.save();
            res.send(category)

        } catch (e) {
          console.log('err',e)
          res.status(500).json({e});
        }
    })
    .delete( auth_api, async (req, res, next) => {
        try {
            let category = await Category.findById(req.params.id);
            if (!category) return res.status(404).json({ message: "Category not found" })
            console.log(category);
            await category.remove()
            console.log("đã xóa --------------");
            res.send(category);
        } catch (e) {
          res.status(500).json({e});
        }
    })
};