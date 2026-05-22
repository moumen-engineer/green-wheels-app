const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController');
const { isAuthenticated } = require('../middleware/auth');

// POST /api/rides - Create a ride
router.post('/', isAuthenticated, rideController.createRide);

// GET /api/rides/me - Get current user's rides
router.get('/me', isAuthenticated, rideController.getUserRides);

// GET /api/rides/stats - Get user's ride statistics
router.get('/stats', isAuthenticated, rideController.getRideStats);

// PUT /api/rides/:rideId/cancel - Cancel a ride
router.put('/:rideId/cancel', isAuthenticated, rideController.cancelRide);

module.exports = router;