
router
    .route("/category/:id")
    .get(getUser, (req, res, next) => {
        //5cf3f5f2a66abe460cadb890
        console.log('Request Id:', req.params.id);
        Category.findOne({ _id: ObjectID(req.params.id) }, (err, category) => {
            if (err) return next(err);
            if (category) {
                res.json({
                    results: {
                        object: category
                    }
                });
            } else {
                res.status(403).json({
                    success: false,
                    message: "category is not exist!"
                });
            }
        })
    })
    .put(getUser, (req, res, next) => {
        let data = {}
        if (req.body.name) data.name = req.body.name
        if (req.body.description) data.description = req.body.description
        if (req.body.image) data.list_image = req.body.image
        if (req.body.status) data.status = req.body.status
        if (Object.keys(data).length == 0) {
            res.status(403).json({
                success: false,
                message: "Request body failed!"
            });
        } else {
            Category.findByIdAndUpdate(req.params.id, data, { new: true }, (err, category) => {
                if (err) return next(res.status(500).json({
                    success: false,
                    message: err
                }));
                if (category) {
                    res.json({
                        results: {
                            object: category
                        }
                    });
                } else {
                    res.status(403).json({
                        success: false,
                        message: "category is not exist!"
                    });
                }
            })

        }
    })
    .delete(getUser, (req, res, next) => {
        Category.findByIdAndRemove(req.params.id, (err, result) => {
            if (err) return next(res.status(500).json({
                success: false,
                message: err
            }));
            res.json({
                success: true,
                message: result
            });
        })

    });