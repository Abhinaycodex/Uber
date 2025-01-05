const UserModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blackListToken.model');



module.exports.registerUser = async (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    // console.log(req.body)
    const {fullname, email, password} = req.body;

    const hashedPassword = await UserModel.hashPassword(password);

    const user = await  userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email: email,
        password:hashedPassword 
    });

    const token = user.generateToken();

    res.status(201).json({user, token});
}
 
module.exports.loginUser = async (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;

    const user = await UserModel.findOne({email}).select('+password');
    if(!user) {
        return res.status(401).json({message: 'User not found'});
    }


    const isMatch = await user.matchPassword(password);
    if(!isMatch) {
        return res.status(400).json({message: 'Invalid credentials'});
    }

    const token = user.generateToken();

    res.cookie("token", token);
    res.status(200).json({user, token});
}

module.exports.getUserprofile = async (req, res, next) => {
    res.status(200).json(req.user);
}

module.exports.logoutUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];
    res.clearCookie("token");

    await blacklistTokenModel.create({token});
    res.status(200).json({message: 'Logged out successfully'});
}
