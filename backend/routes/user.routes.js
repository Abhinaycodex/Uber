const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const usercontroller = require('../controller/usercontroller');


router.post('/register', [
    body('fullname.firstname').isLength({min: 3}).withMessage('First name is too short'),
    body('fullname.lastname').isLength({min: 3}).withMessage('Last name is too short'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min: 6}).withMessage('Password is too short'),
], usercontroller.registerUser);




module.exports = router;