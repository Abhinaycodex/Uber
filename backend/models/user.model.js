const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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

userSchema.methods.generateToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
}

userSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
}

const UserModel = mongoose.model('user', userSchema);

export default UserModel;