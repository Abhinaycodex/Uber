const express = require('express');
const captainController = require('../controller/captain.controller');
const router = express.Router();
const {body} = require('express-validator');

router.post('/register',[
    body('fullname.firstname').isLength({min: 3}).withMessage('First name is too short'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min: 6}).withMessage('Password is too short'),
    body('vehicle.color').isLength({min: 3}).withMessage('Color is too short'),
    body('vehicle.plateNumber').isLength({min: 3}).withMessage('Plate number is too short'),
    body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'bike']).withMessage('Invalid vehicle type'),
    body('vehicle.capacity').isIn([1, 2]).withMessage('Invalid capacity'),

],
captainController.registerCaptain);


module.exports = router;