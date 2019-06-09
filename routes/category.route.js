
const Category = require('../models/category.model');
const auth_login = require('../middleware/auth_login')
const auth_admin = require('../middleware/auth_admin')

module.exports = router => {

    // Create new category
    router.post('/category',auth_login, auth_admin, async (req, res, next) => {

        const category = new Category(req.body);

        try {
            await category.save()
            res.status(201).send(category)
        } catch (err) {
            res.status(400).send(err)
        }
    
    });

    // Get list categories
    router.get('/categories', async (req, res, next) => {
        try {
            const categories = await Category.find({});

            if (!categories) {
                return res.status(404).send();
            } 

            res.send(categories);
        } catch (err) {
            res.status(500).send;
        }
    })

    // Get category
    router.get('/category/:id', async (req, res, next) => {
        try {
            const category = await Category.findById(req.params.id);

            if (!category) {
                return res.status(404).send();
            } 

            res.send(category);
        } catch (err) {
            res.status(500).send;
        }
    })

    // Update category
    router.put('/category/:id', auth_login, auth_admin, async (req, res, next) => {
        console.log('Request Id:', req.params.id);
        const updates = Object.keys(req.body)
        console.log("Fields update ",updates);
        const allowedUpdates = ['description', 'image', 'name', 'name_vi', 'slug', 'status', 'created_at']
        const isValidOperation = updates.every((element) => allowedUpdates.includes(element))

        if (!isValidOperation) {
            console.log('sai cu phap')
            return res.status(400).send({ error: 'Some updates fields are invalid!' })
        }

        try {
            let category = await Category.findById(req.params.id);
            updates.forEach((element) => category[element] = req.body[element])
            console.log(category);
            await category.save();
            res.send(category)

        } catch (e) {
            res.status(400).send(e)
        }
    })

    // delete category
    router.delete('/category/:id', auth_login, auth_admin, async (req, res, next) => {
        try {
            let category = await Category.findById(req.params.id);
            if (!category) return res.status(404).json({ message: "Category not found" })
            console.log(category);
            await category.remove()
            console.log("đã xóa --------------");
            res.send(category);
        } catch (e) {
            res.json({ delete: "false" }).status(500).send()
        }
    })
};