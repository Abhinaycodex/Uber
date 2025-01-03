const UserModel = require('../models/user.model');

module.exports.createUser = async ({
    firstname,lastname, email, password}) => {
        if(!firstname || !email || !password) {
            throw new Error('Please provide all the required fields');
        }

    const user = await UserModel.create({
        fullname:{
            firstname,
            lastname,
        },
        email,
        password
    });

    return user;
};
