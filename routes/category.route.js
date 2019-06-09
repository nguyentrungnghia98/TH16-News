
const Category = require('../models/category.model');
const {auth_login} = require('../middleware/auth_login')
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
};