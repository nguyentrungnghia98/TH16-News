const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


const CategorySchema = new Schema({
    // id: {type: ObjectId, unique: true},
    description: String,
    image: String,
    name: String,
    name_vi: String,
    slug: String,
    status: { type: Number, default: 1 },
    parent_categories: [{
      type:Schema.Types.ObjectId, ref: "Category"
    }], 
    count:Number,
    newPost: {
      type:Schema.Types.ObjectId, ref: "Post"
    },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', CategorySchema);