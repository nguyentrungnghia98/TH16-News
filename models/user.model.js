const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const bcrypt = require('bcrypt')
var async = require('asyncawait/async');
var await = require('asyncawait/await');

const UserSchema = new Schema({ 
    role: {type: String, requrie: true},
    // id: {type: ObjectId, unique: true},
    email: {type: String, lowercase: true},
    avatar: String,
    name: String, 
    password: String,
    provider: String,
    phone:String,
    facebookLink: String,
    isAccepted: Boolean,
    isDenied:Boolean,
    address: String,
    facebookId: String,
    googleId:String, 
    dateExpired: { type: Date, default: Date.now },
    managerCategories: [{
      type:Schema.Types.ObjectId, ref: "Category"
    }],
    created_at: { type: Date, default: Date.now },
});

//hash password before save user if the password is changed

UserSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
        console.log('da hash')
    }

    next()
})

module.exports = mongoose.model('User', UserSchema);

