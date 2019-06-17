const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


const PostSchema = new Schema({
    name: String,
    priority: Number,
    slug: String,
    short_description: String,
    content: String,
    status: {type: String, default: 'draft'}, // draft , denied, verified, //published 
    thumb: String,
    view: {
      views: [{
        count: {type: Number},
        viewAt: {type: Date }, 
      }],
      viewsWeek:{type: Number, default: 0},
      total: {type: Number, default: 0},
    },
    note_deny: String,
    publishAt:Date, 
    isPremium: {type: Boolean, default: false},
    comments: [{
      user: {
        type:Schema.Types.ObjectId, ref: "User"
      },
      replies:[{
        user: {
          type:Schema.Types.ObjectId, ref: "User"
        }, 
        content: String,
        commentAt:  { type: Date, default: Date.now },
      }],
      content: String,
      commentAt:  { type: Date, default: Date.now },
    }],
    createBy: {
      type:Schema.Types.ObjectId, ref: "User"
    },
    verifyAt: Date,
    verifyBy: {
      type:Schema.Types.ObjectId, ref: "User"
    }, 
    denyAt: Date,
    denyBy: {
      type:Schema.Types.ObjectId, ref: "User"
    },
    categories:[{
      type:Schema.Types.ObjectId, ref: "Category"
    }],
    tags:[{
      type:Schema.Types.ObjectId, ref: "Tag"
    }],
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', PostSchema);