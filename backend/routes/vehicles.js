const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const requireAuth = require('../middleware/requireAuth');

// Public routes
router.get('/', vehicleController.getVehicles);
router.get('/:id', vehicleController.getVehicleById);

// Admin only routes
router.post('/', requireAuth, vehicleController.createVehicle);
router.put('/:id', requireAuth, vehicleController.updateVehicle);
router.delete('/:id', requireAuth, vehicleController.deleteVehicle);

module.exports = router;