
const Tag = require('../../models/tag.model');
const auth_api = require('../../middleware/auth_api')
var async = require('asyncawait/async');
var await = require('asyncawait/await');
module.exports = router => {

  router
  .route('/api/tag')
  .get( async (req, res, next) => {
    try {
        const tags = await Tag.find({});
        if (!tags) {
            return res.status(404).send();
        } 

        res.send(tags);
    } catch (err) {
        res.status(500).json({err});
    }
  })
  .post( auth_api, async (req, res, next) => {

        const tag = new Tag(req.body);
        console.log('tag', tag)
        try {
            await tag.save()
            res.send(tag)
        } catch (err) {
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
      Tag.remove({'_id':{'$in':items}}, (err,result)=>{
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
    // Get tag
    router
    .route('/api/tag/:id')
    .get(async (req, res, next) => {
        try {
            const tag = await Tag.findById(req.params.id);
            if (!tag) {
              return  res.status(403).json({ message: "tag is undefined!" });
            } 

            res.send(tag);
        } catch (err) {
            res.status(500).json({err});
        }
    })
    .put(auth_api, async (req, res, next) => {
        console.log('Request Id:', req.params.id);
        const updates = Object.keys(req.body)
        console.log("Fields update ",updates);
        const allowedUpdates = ['description', 'name', 'name_vi', 'status', 'created_at']
        const isValidOperation = updates.every((element) => allowedUpdates.includes(element))

        if (!isValidOperation) {
            console.log('sai cu phap')
            return res.status(403).send({ error: 'Some updates fields are invalid!' })
        }

        try {
            let tag = await Tag.findById(req.params.id);
            updates.forEach((element) => tag[element] = req.body[element])
            console.log(tag);
            await tag.save();
            res.send(tag)

        } catch (err) {
          res.status(500).json({err});
        }
    })

    .delete( auth_api, async (req, res, next) => {
        try {
            let tag = await Tag.findById(req.params.id);
            if (!tag) return res.status(404).json({ message: "Category not found" })
            console.log(tag);
            await tag.remove()
            console.log("đã xóa --------------");
            res.send(tag);
        } catch (err) {
          res.status(500).json({err});
        }
    })
};