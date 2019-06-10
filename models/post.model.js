const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


const PostSchema = new Schema({
    name: String,
    priority: Number,
    slug: String,
    short_description: String,
    content: String,
    status: Number,
    thumb: String,
    views: {type: Number, default: 200},
    created_at: { type: Date, default: Date.now },
    creator: {type: String, default: "Simon"}
});

module.exports = mongoose.model('Post', PostSchema);