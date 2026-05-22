const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const adminController = require("../controllers/adminController");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// All routes protected

// ===============================
// DASHBOARD STATS
// ===============================
router.get("/dashboard/stats", isAuthenticated, isAdmin, adminController.getDashboardStats);

// ===============================
// USER MANAGEMENT ROUTES
// ===============================

router.get("/users", isAuthenticated, isAdmin, adminController.getAllUsers);

router.patch("/users/:id/status", isAuthenticated, isAdmin, adminController.toggleUserStatus);

router.patch("/users/:id/role", isAuthenticated, isAdmin, adminController.changeUserRole);

router.delete("/users/:id", isAuthenticated, isAdmin, adminController.deleteUser);


// ===============================
// MAINTENANCE ROUTES
// ===============================

// Get all maintenance
router.get("/maintenance", isAuthenticated, isAdmin, adminController.getAllMaintenance);

// Create maintenance
router.post("/maintenance", isAuthenticated, isAdmin, adminController.createMaintenance);

// Delete maintenance
router.delete( "/maintenance/:id", isAuthenticated, isAdmin, adminController.deleteMaintenance);

// Update maintenance status
router.patch("/maintenance/:id/status",isAuthenticated, isAdmin, adminController.updateMaintenanceStatus);


// ===============================
// VEHICLE ROUTES
// ===============================

// Get all vehicles
router.get("/vehicles", isAuthenticated, isAdmin, adminController.getAllVehicles);

// Create vehicle
router.post("/vehicles", isAuthenticated, isAdmin, upload.single("image"), adminController.createVehicle);

// Update vehicle
router.put("/vehicles/:id", isAuthenticated, isAdmin, adminController.updateVehicle);

// Delete vehicle
router.delete("/vehicles/:id", isAuthenticated, isAdmin, adminController.deleteVehicle);


// ===============================
// RESERVATIONS ROUTES
// ===============================

// Get all reservations
router.get("/reservations", isAuthenticated, isAdmin, adminController.getAllReservations);

// Get details
router.get("/reservations/:id", isAuthenticated, isAdmin, adminController.getReservationById);

// Cancel reservation
router.patch("/reservations/:id/cancel", isAuthenticated, isAdmin, adminController.cancelReservation);


module.exports = router;