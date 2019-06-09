const Post = require('../models/post.model');
const auth_login = require('../middleware/auth_login')
const auth_admin = require('../middleware/auth_admin')

module.exports = router => {

    // Create new category
    router.post('/post', auth_login, auth_admin, async (req, res, next) => {

        const post = new Post(req.body);

        try {
            await post.save()
            res.status(201).send(post)
        } catch (err) {
            res.status(400).send(err)
        }
    });

    // Get list posts
    router.get('/posts', async (req, res, next) => {
        try {
            const posts = await Post.find({});

            if (!posts) {
                return res.status(404).send();
            }

            res.send(posts);
        } catch (err) {
            res.status(500).send;
        }
    })

    // Get post
    router.get('/post/:id', async (req, res, next) => {
        try {
            const post = await Post.findById(req.params.id);

            if (!post) {
                return res.status(404).json({message: "This post does not exist"});
            }

            res.send(post);
        } catch (err) {
            res.status(500).send;
        }
    })

      // Update post
      router.put('/post/:id', auth_login, auth_admin, async (req, res, next) => {
        console.log('Request Id:', req.params.id);
        const updates = Object.keys(req.body)
        console.log("Fields update ",updates);
        const allowedUpdates = ['name', 'priority', 'slug', 'short_description', 'content', 'status', 'thumb', 'views', 'created_at', 'creator']
        const isValidOperation = updates.every((element) => allowedUpdates.includes(element))

        if (!isValidOperation) {
            console.log('sai cu phap')
            return res.status(400).send({ error: 'Some updates fields are invalid!' })
        }

        try {
            let post = await Post.findById(req.params.id);
            updates.forEach((element) => post[element] = req.body[element])
            console.log(post);
            await post.save();
            res.send(post)

        } catch (e) {
            res.status(400).send(e)
        }
    })

    // delete Post
    router.delete('/post/:id', auth_login, auth_admin, async (req, res, next) => {
        try {
            let post = await Post.findById(req.params.id);
            if (!post) return res.status(404).json({ message: "Post not found" })
            console.log(post);
            await post.remove()
            console.log("đã xóa --------------");
            res.send(post);
        } catch (e) {
            res.json({ delete: "false" }).status(500).send()
        }
    })

}