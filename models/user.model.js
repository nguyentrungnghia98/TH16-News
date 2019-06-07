const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const bcrypt = require('bcrypt')

const UserSchema = new Schema({
    rule: {type: String, requrie: true},
    // id: {type: ObjectId, unique: true},
    email: {type: String, unique: true, lowercase: true},
    picture: String,
    name: String,
    password: String
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