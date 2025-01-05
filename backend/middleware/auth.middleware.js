const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.authUser = async (req, res, next) => {
    
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if(!token) {
        return res.status(401).json({message: 'Not authorized to access this route'});
    }

    const isBlacklistToken = await UserModel.findOne( { token } );

    if(isBlacklistToken) {
        return res.status(401).json({message: 'Not authorized to access this route'});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const User = await UserModel.findById(decoded.id);

        req.user= User;
        return next();
    }
    catch(err) {
        return res.status(401).json({message: 'Not authorized to access this route'});
    }
}