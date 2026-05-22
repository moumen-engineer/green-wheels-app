const db = require("../config/db");

// #############################
//     USERS CRUD (Admin)
// #############################

// 1. Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const query = "SELECT id, full_name, email, phone, role, is_active, created_at FROM users";
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
};

// 2. Suspend / Activate user
exports.toggleUserStatus = async (req, res) => {
    try {
        const userId = req.params.id;
        const query = "UPDATE users SET is_active = NOT is_active WHERE id = ?";
        await db.query(query, [userId]);
        res.json({ message: "User status updated" });
    } catch (err) {
        res.status(500).json(err);
    }
};

// 3. Change role
exports.changeUserRole = async (req, res) => {
    try {
        const userId = req.params.id;
        const { role } = req.body;
        if (!["admin", "user"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }
        const query = "UPDATE users SET role = ? WHERE id = ?";
        await db.query(query, [role, userId]);
        res.json({ message: "Role updated" });
    } catch (err) {
        res.status(500).json(err);
    }
};

// 4. Delete user
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const query = "DELETE FROM users WHERE id = ?";
        await db.query(query, [userId]);
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json(err);
    }
};


// ===============================
// MAINTENANCE CRUD
// ===============================

// 1. Get all maintenance tasks
exports.getAllMaintenance = async (req, res) => {
    try {
        const query = `
            SELECT m.*, v.code AS vehicle_code, v.type AS vehicle_type
            FROM maintenance m
            JOIN vehicles v ON m.vehicle_id = v.id
            ORDER BY m.scheduled_date DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
};

// 2. Create maintenance task
exports.createMaintenance = async (req, res) => {
    try {
        const { vehicle_id, description, type, status, scheduled_date } = req.body;

        if (!vehicle_id || !description || !type || !status || !scheduled_date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate enums
        const validTypes = ['repair', 'cleaning', 'battery', 'other'];
        const validStatuses = ['pending', 'in progress', 'completed'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ message: "Invalid type. Must be: repair, cleaning, battery, other" });
        }
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status. Must be: pending, in progress, completed" });
        }

        const query = `
            INSERT INTO maintenance (vehicle_id, description, type, status, scheduled_date)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [vehicle_id, description, type, status, scheduled_date]);

        res.json({ message: "Maintenance created successfully", id: result.insertId });
    } catch (err) {
        res.status(500).json(err);
    }
};

// 3. Delete maintenance task
exports.deleteMaintenance = async (req, res) => {
    try {
        const maintenanceId = req.params.id;
        const query = "DELETE FROM maintenance WHERE id = ?";
        await db.query(query, [maintenanceId]);
        res.json({ message: "Maintenance deleted successfully" });
    } catch (err) {
        res.status(500).json(err);
    }
};

// 4. Update maintenance status
exports.updateMaintenanceStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;

        const validStatuses = ['pending', 'in progress', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const query = "UPDATE maintenance SET status = ? WHERE id = ?";
        await db.query(query, [status, id]);
        res.json({ message: "Status updated" });
    } catch (err) {
        res.status(500).json(err);
    }
};


// ===============================
// VEHICLE CRUD  (uses real DB columns: price, battery_level)
// ===============================

// 1. Get all vehicles
exports.getAllVehicles = async (req, res) => {
    try {
        const query = `
            SELECT v.*, s.name AS station_name
            FROM vehicles v
            LEFT JOIN stations s ON v.station_id = s.id
            ORDER BY v.id DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
};

// 2. Create vehicle
exports.createVehicle = async (req, res) => {
    try {
        const { code, type, price, station_id, battery_level, status, latitude, longitude } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!code || !type || !price || !station_id) {
            return res.status(400).json({ message: "code, type, price and station_id are required" });
        }

        const validTypes = ['scooter', 'bicycle', 'electric bicycle'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ message: "Invalid type. Must be: scooter, bicycle, electric bicycle" });
        }

        const query = `
            INSERT INTO vehicles (code, type, price, station_id, battery_level, status, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [
            code,
            type,
            parseFloat(price),
            parseInt(station_id),
            parseInt(battery_level) || 100,
            status || 'available',
            parseFloat(latitude) || null,
            parseFloat(longitude) || null,
        ]);

        res.status(201).json({ message: "Vehicle created successfully", id: result.insertId });
    } catch (err) {
        res.status(500).json(err);
    }
};

// 3. Update vehicle
exports.updateVehicle = async (req, res) => {
    try {
        const vehicleId = req.params.id;
        const { code, type, price, station_id, battery_level, status, latitude, longitude } = req.body;

        const validStatuses = ['available', 'reserved', 'in_use', 'under_maintenance'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const query = `
            UPDATE vehicles SET
                code = COALESCE(?, code),
                type = COALESCE(?, type),
                price = COALESCE(?, price),
                station_id = COALESCE(?, station_id),
                battery_level = COALESCE(?, battery_level),
                status = COALESCE(?, status),
                latitude = COALESCE(?, latitude),
                longitude = COALESCE(?, longitude)
            WHERE id = ?
        `;
        await db.query(query, [
            code || null,
            type || null,
            price ? parseFloat(price) : null,
            station_id ? parseInt(station_id) : null,
            battery_level !== undefined ? parseInt(battery_level) : null,
            status || null,
            latitude !== undefined ? parseFloat(latitude) : null,
            longitude !== undefined ? parseFloat(longitude) : null,
            vehicleId,
        ]);

        res.json({ message: "Vehicle updated successfully" });
    } catch (err) {
        res.status(500).json(err);
    }
};

// 4. Delete vehicle
exports.deleteVehicle = async (req, res) => {
    try {
        const vehicleId = req.params.id;
        const query = "DELETE FROM vehicles WHERE id = ?";
        await db.query(query, [vehicleId]);
        res.json({ message: "Vehicle deleted successfully" });
    } catch (err) {
        res.status(500).json(err);
    }
};


// ===============================
// RESERVATIONS (rides) CRUD
// ===============================

// 1. Get all rides (used as reservations)
exports.getAllReservations = async (req, res) => {
    try {
        const query = `
            SELECT
                r.*,
                u.full_name AS user_name,
                v.code AS vehicle_name,
                s.name AS station_name
            FROM rides r
            JOIN users u ON r.user_id = u.id
            JOIN vehicles v ON r.vehicle_id = v.id
            LEFT JOIN stations s ON r.start_station_id = s.id
            ORDER BY r.id DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
};

// 2. Cancel reservation
exports.cancelReservation = async (req, res) => {
    try {
        const reservationId = req.params.id;

        // Get the ride to find vehicle_id
        const [rides] = await db.query("SELECT vehicle_id FROM rides WHERE id = ?", [reservationId]);
        if (rides.length > 0) {
            // Free the vehicle back to available
            await db.query("UPDATE vehicles SET status = 'available' WHERE id = ? AND status = 'reserved'", [rides[0].vehicle_id]);
        }

        await db.query("UPDATE rides SET status = 'cancelled' WHERE id = ?", [reservationId]);
        res.json({ message: "Reservation cancelled" });
    } catch (err) {
        res.status(500).json(err);
    }
};

// 3. Get reservation details
exports.getReservationById = async (req, res) => {
    try {
        const reservationId = req.params.id;
        const query = `
            SELECT
                r.*,
                u.full_name AS user_name,
                v.code AS vehicle_name,
                s.name AS station_name
            FROM rides r
            JOIN users u ON r.user_id = u.id
            JOIN vehicles v ON r.vehicle_id = v.id
            LEFT JOIN stations s ON r.start_station_id = s.id
            WHERE r.id = ?
        `;
        const [rows] = await db.query(query, [reservationId]);
        res.json(rows[0] || null);
    } catch (err) {
        res.status(500).json(err);
    }
};


// ===============================
// DASHBOARD STATS
// ===============================

exports.getDashboardStats = async (req, res) => {
    try {
        // Vehicle stats by status
        const [[vehicleStats]] = await db.query(`
            SELECT
                COUNT(*) AS total,
                SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) AS available,
                SUM(CASE WHEN status = 'reserved' THEN 1 ELSE 0 END) AS reserved,
                SUM(CASE WHEN status = 'in_use' THEN 1 ELSE 0 END) AS in_use,
                SUM(CASE WHEN status = 'under_maintenance' THEN 1 ELSE 0 END) AS under_maintenance
            FROM vehicles
        `);

        // User count
        const [[userStats]] = await db.query(`SELECT COUNT(*) AS total FROM users WHERE role = 'user'`);

        // Revenue stats
        const [[revenueStats]] = await db.query(`
            SELECT
                COALESCE(SUM(CASE WHEN MONTH(created_at) = MONTH(NOW()) AND YEAR(created_at) = YEAR(NOW()) THEN amount ELSE 0 END), 0) AS monthly_revenue,
                COALESCE(SUM(amount), 0) AS total_revenue
            FROM payments WHERE status = 'completed'
        `);

        // Active rides
        const [[rideStats]] = await db.query(`
            SELECT
                COUNT(*) AS total,
                SUM(CASE WHEN status = 'not_started' THEN 1 ELSE 0 END) AS not_started,
                SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
                SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled
            FROM rides
        `);

        // Recent rides
        const [recentRides] = await db.query(`
            SELECT r.id, r.status, r.started_at, r.final_price,
                   u.full_name AS user_name,
                   v.code AS vehicle_code, v.type AS vehicle_type,
                   s.name AS station_name
            FROM rides r
            JOIN users u ON r.user_id = u.id
            JOIN vehicles v ON r.vehicle_id = v.id
            LEFT JOIN stations s ON r.start_station_id = s.id
            ORDER BY r.started_at DESC
            LIMIT 5
        `);

        // Station data
        const [stations] = await db.query(`
            SELECT s.id, s.name, s.total_slots, s.available_slots,
                   COUNT(v.id) AS vehicle_count,
                   SUM(CASE WHEN v.status = 'available' THEN 1 ELSE 0 END) AS available_vehicles
            FROM stations s
            LEFT JOIN vehicles v ON v.station_id = s.id
            WHERE s.is_active = 1
            GROUP BY s.id, s.name, s.total_slots, s.available_slots
            ORDER BY vehicle_count DESC
        `);

        // Monthly revenue (last 6 months)
        const [monthlyRevenue] = await db.query(`
            SELECT
                DATE_FORMAT(created_at, '%b') AS month,
                MONTH(created_at) AS month_num,
                COALESCE(SUM(amount), 0) AS revenue,
                COUNT(*) AS count
            FROM payments
            WHERE status = 'completed'
              AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY MONTH(created_at), DATE_FORMAT(created_at, '%b')
            ORDER BY month_num ASC
        `);

        // Vehicle type distribution
        const [vehicleTypes] = await db.query(`
            SELECT type, COUNT(*) AS count FROM vehicles GROUP BY type
        `);

        res.json({
            vehicles: vehicleStats,
            users: userStats.total,
            revenue: revenueStats,
            rides: rideStats,
            recentRides,
            stations,
            monthlyRevenue,
            vehicleTypes,
        });
    } catch (err) {
        console.error("Dashboard stats error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};