const mongoose = require('mongoose')
const Schema = mongoose.Schema;
//const ObjectId = Schema.Types.ObjectId;

const TagSchema = new Schema({
    description: String,
    name: String,
    name_vi: String,
    status: { type: Number, default: 1 },
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Tag', TagSchema);