const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    fullname: {
        firstname:{
            type: String,
            required: true,
            trim: true,
            min:[3, 'Too short'],
        },
        lastname:{
            type: String,
            min:[3, 'Too short'],
        }  
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        min:[6, 'Too short'],
        select: false
    },
    socketid: {
        type: String,
    }, 
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.generateToken = function () {
    const token = jwt.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: '24h'});
    return token;
}

userSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
}
    
const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;