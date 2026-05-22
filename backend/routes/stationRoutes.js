const express = require('express');
const router = express.Router();
const stationController = require('../controllers/stationController');
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// CRUD
router.post('/', isAuthenticated, isAdmin, stationController.createStation);
router.get('/', stationController.getStations);
router.get('/:id', stationController.getStationById);
router.put('/:id',isAuthenticated, isAdmin, stationController.updateStation);
router.delete('/:id',isAuthenticated, isAdmin, stationController.deleteStation);
router.patch('/:id/deactivate',isAuthenticated, isAdmin, stationController.deactivateStation);

module.exports = router;