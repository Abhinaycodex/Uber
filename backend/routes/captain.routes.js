const captainController = require('../controller/captain.controller');
const express = require('express');
const router = express.Router();
const { body } = require("express-validator");
const authMiddleware = require('../middleware/auth.middleware');
const Ride = require('../models/ride.model');

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate').isLength({ min: 3 }).withMessage('Plate must be at least 3 characters long'),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage('Invalid vehicle type')
], captainController.registerCaptain);

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], captainController.loginCaptain);


router.get('/profile', authMiddleware.authCaptain, captainController.getProfile);

router.get('/logout', authMiddleware.authCaptain, captainController.logoutCaptain);

// Add feedback route
router.post('/rides/feedback', async (req, res) => {
    try {
        const { rideId, rating, feedback } = req.body;
        
        // Update the ride with feedback
        const updatedRide = await Ride.findByIdAndUpdate(
            rideId,
            {
                rating,
                feedback,
                feedbackSubmitted: true
            },
            { new: true }
        );

        if (!updatedRide) {
            return res.status(404).json({
                success: false,
                message: 'Ride not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Feedback submitted successfully',
            data: updatedRide
        });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting feedback',
            error: error.message
        });
    }
});

module.exports = router;