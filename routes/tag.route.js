
const Tag = require('../models/tag.model');
const {auth_login} = require('../middleware/auth_login')
const auth_admin = require('../middleware/auth_admin')

module.exports = router => {

    // Create new Tag
    router.post('/tag',auth_login, auth_admin, async (req, res, next) => {

        const tag = new Tag(req.body);
        console.log('tag', tag)
        try {
            await tag.save()
            res.status(201).send(tag)
        } catch (err) {
            res.status(400).send(err)
        }
    
    });

    // Get list Tags
    router.get('/tags', async (req, res, next) => {
        try {
            const tags = await Tag.find({});

            if (!tags) {
                return res.status(404).send();
            } 

            res.send(tags);
        } catch (err) {
            res.status(500).send;
        }
    })

    // Get tag
    router.get('/tag/:id', async (req, res, next) => {
        try {
            const tag = await Tag.findById(req.params.id);

            if (!tag) {
                return res.status(404).send();
            } 

            res.send(tag);
        } catch (err) {
            res.status(500).send;
        }
    })

    // Update tag
    router.put('/tag/:id', auth_login, auth_admin, async (req, res, next) => {
        console.log('Request Id:', req.params.id);
        const updates = Object.keys(req.body)
        console.log("Fields update ",updates);
        const allowedUpdates = ['description', 'name', 'name_vi', 'status', 'created_at']
        const isValidOperation = updates.every((element) => allowedUpdates.includes(element))

        if (!isValidOperation) {
            console.log('sai cu phap')
            return res.status(400).send({ error: 'Some updates fields are invalid!' })
        }

        try {
            let tag = await Tag.findById(req.params.id);
            updates.forEach((element) => category[element] = req.body[element])
            console.log(tag);
            await tag.save();
            res.send(tag)

        } catch (e) {
            res.status(400).send(e)
        }
    })

    // delete tag
    router.delete('/tag/:id', auth_login, auth_admin, async (req, res, next) => {
        try {
            let tag = await Tag.findById(req.params.id);
            if (!tag) return res.status(404).json({ message: "Category not found" })
            console.log(tag);
            await tag.remove()
            console.log("đã xóa --------------");
            res.send(tag);
        } catch (e) {
            res.json({ delete: "false" }).status(500).send()
        }
    })
};