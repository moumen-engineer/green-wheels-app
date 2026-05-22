const db = require('../config/db');

// CREATE
exports.createStation = async (req, res) => {
    try {
        const { name, address, latitude, longitude, total_slots, is_active } = req.body;

        // Validation
        if (!name || !address) {
            return res.status(400).json({ message: "Name and address are required" });
        }

        if (total_slots <= 0) {
            return res.status(400).json({ message: "Total slots must be > 0" });
        }

        const sql = `
            INSERT INTO stations (name, address, latitude, longitude, total_slots, is_active)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            name,
            address,
            latitude,
            longitude,
            total_slots,
            is_active
        ]);

        res.json({ message: "Station created successfully", id: result.insertId });

    } catch (err) {
        res.status(500).json(err);
    }
};


// READ ALL
exports.getStations = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM stations"
        );

        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
};


// READ ONE
exports.getStationById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(
            "SELECT * FROM stations WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Station not found" });
        }

        res.json(rows[0]);

    } catch (err) {
        res.status(500).json(err);
    }
};


// UPDATE
exports.updateStation = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, latitude, longitude, total_slots, is_active } = req.body;

        const sql = `
            UPDATE stations 
            SET name = ?, address = ?, latitude = ?, longitude = ?, total_slots = ?, is_active = ?
            WHERE id = ?
        `;

        await db.query(sql, [
            name,
            address,
            latitude,
            longitude,
            total_slots,
            is_active,
            id
        ]);

        res.json({ message: "Station updated successfully" });

    } catch (err) {
        res.status(500).json(err);
    }
};


// DELETE
exports.deleteStation = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query("DELETE FROM stations WHERE id = ?", [id]);

        res.json({ message: "Station deleted successfully" });

    } catch (err) {
        res.status(500).json(err);
    }
};


// DEACTIVATE (soft delete)
exports.deactivateStation = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(
            "UPDATE stations SET is_active = NOT is_active  WHERE id = ?",
            [id]
        );

        res.json({ message: "Station deactivated" });

    } catch (err) {
        res.status(500).json(err);
    }
};