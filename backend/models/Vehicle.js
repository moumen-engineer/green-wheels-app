const db = require('../config/db');

class Vehicle {
  static async migrate() {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        type ENUM('Vélo électrique', 'Vélo classique', 'Scooter électrique') NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        station_id INT NOT NULL,
        battery_level INT DEFAULT 100,
        status ENUM('available', 'rented', 'maintenance', 'unavailable') DEFAULT 'available',
        latitude DECIMAL(10,8),
        longitude DECIMAL(11,8),
        last_seen_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_station_id (station_id),
        INDEX idx_status (status),
        INDEX idx_type (type),
        FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  static async getAll(filters = {}) {
    let query = `
      SELECT v.*, s.name as station_name, s.address as station_address,
             CASE 
               WHEN v.status = 'available' THEN true 
               ELSE false 
             END as available
      FROM vehicles v
      LEFT JOIN stations s ON v.station_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.type && filters.type !== 'all') {
      query += ' AND v.type = ?';
      params.push(filters.type);
    }

    if (filters.status && filters.status !== 'all') {
      query += ' AND v.status = ?';
      params.push(filters.status);
    }

    if (filters.search) {
      query += ' AND (v.code LIKE ? OR v.type LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ' ORDER BY v.status DESC, v.type ASC, v.id ASC';
    
    const [rows] = await db.execute(query, params);
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.execute(
      `SELECT v.*, s.name as station_name, s.address as station_address,
              CASE 
                WHEN v.status = 'available' THEN true 
                ELSE false 
              END as available
       FROM vehicles v
       LEFT JOIN stations s ON v.station_id = s.id
       WHERE v.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async getByStation(station_id) {
    const [rows] = await db.execute(
      `SELECT * FROM vehicles WHERE station_id = ? AND status = 'available'`,
      [station_id]
    );
    return rows;
  }

  static async create(vehicleData) {
    const { code, type, price, station_id, battery_level, status, latitude, longitude } = vehicleData;
    const [result] = await db.execute(
      `INSERT INTO vehicles (code, type, price, station_id, battery_level, status, latitude, longitude, last_seen_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [code, type, price, station_id, battery_level || 100, status || 'available', latitude || null, longitude || null]
    );
    return this.getById(result.insertId);
  }

  static async update(id, vehicleData) {
    const { type, price, station_id, battery_level, status, latitude, longitude } = vehicleData;
    await db.execute(
      `UPDATE vehicles 
       SET type = COALESCE(?, type),
           price = COALESCE(?, price),
           station_id = COALESCE(?, station_id),
           battery_level = COALESCE(?, battery_level),
           status = COALESCE(?, status),
           latitude = COALESCE(?, latitude),
           longitude = COALESCE(?, longitude),
           last_seen_at = NOW()
       WHERE id = ?`,
      [type, price, station_id, battery_level, status, latitude, longitude, id]
    );
    return this.getById(id);
  }

  static async updateStatus(id, status) {
    await db.execute(
      'UPDATE vehicles SET status = ?, last_seen_at = NOW() WHERE id = ?',
      [status, id]
    );
  }

  static async updateBattery(id, battery_level) {
    await db.execute(
      'UPDATE vehicles SET battery_level = ?, last_seen_at = NOW() WHERE id = ?',
      [battery_level, id]
    );
  }

  static async delete(id) {
    const [result] = await db.execute('DELETE FROM vehicles WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Vehicle;