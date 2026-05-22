const db = require('../config/db');

class Ride {
  static async create({ user_id, vehicle_id, start_station_id, started_at, duration_min, base_price, final_price }) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Create the ride
      const [result] = await conn.execute(
        `INSERT INTO rides (user_id, vehicle_id, start_station_id, started_at, duration_min, base_price, final_price, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'not_started')`,
        [user_id, vehicle_id, start_station_id, started_at, duration_min, base_price, final_price]
      );

      // 2. Update vehicle status to reserved
      await conn.execute(
        `UPDATE vehicles SET status = 'reserved', last_seen_at = NOW() WHERE id = ?`,
        [vehicle_id]
      );

      await conn.commit();

      const [rows] = await conn.execute(
        `SELECT r.*, v.code AS vehicle_code, v.type AS vehicle_type, v.price AS vehicle_price,
                s.name AS station_name
         FROM rides r
         JOIN vehicles v ON r.vehicle_id = v.id
         LEFT JOIN stations s ON r.start_station_id = s.id
         WHERE r.id = ?`,
        [result.insertId]
      );

      return rows[0];
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  static async getById(id) {
    const [rows] = await db.execute(
      `SELECT r.*, v.code AS vehicle_code, v.type AS vehicle_type,
              s.name AS station_name, u.full_name AS user_name
       FROM rides r
       JOIN vehicles v ON r.vehicle_id = v.id
       JOIN users u ON r.user_id = u.id
       LEFT JOIN stations s ON r.start_station_id = s.id
       WHERE r.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async getUserRides(user_id) {
    const [rows] = await db.execute(
      `SELECT r.*, v.code AS vehicle_code, v.type AS vehicle_type,
              s.name AS station_name
       FROM rides r
       JOIN vehicles v ON r.vehicle_id = v.id
       LEFT JOIN stations s ON r.start_station_id = s.id
       WHERE r.user_id = ?
       ORDER BY r.started_at DESC`,
      [user_id]
    );
    return rows;
  }

  // FIXED: Get user rides with limit - NO PARAMETERIZED LIMIT
  static async getUserRidesLimited(user_id, limit = 10) {
    try {
      // Convert limit to integer and ensure it's safe
      const safeLimit = parseInt(limit, 10);
      const finalLimit = isNaN(safeLimit) ? 10 : Math.min(safeLimit, 100); // Max 100 records
      
      // Use string concatenation for LIMIT (safe because we validated it's a number)
      const query = `
        SELECT r.*, 
               v.code AS vehicle_code, 
               v.type AS vehicle_type,
               v.price AS vehicle_price,
               s.name AS start_station_name,
               s.address AS start_station_address
        FROM rides r
        JOIN vehicles v ON r.vehicle_id = v.id
        LEFT JOIN stations s ON r.start_station_id = s.id
        WHERE r.user_id = ?
        ORDER BY r.started_at DESC
        LIMIT ${finalLimit}
      `;
      
      const [rows] = await db.execute(query, [user_id]);
      return rows;
    } catch (err) {
      console.error('Error in getUserRidesLimited:', err);
      // Fallback: Get all rides and limit in JavaScript
      const allRides = await this.getUserRides(user_id);
      return allRides.slice(0, limit);
    }
  }

  // FIXED: Get ride statistics for user
  static async getUserStats(user_id) {
    try {
      const [rows] = await db.execute(
        `SELECT 
          COUNT(*) as total_rides,
          SUM(CASE WHEN status IN ('in_progress', 'not_started') THEN 1 ELSE 0 END) as active_rides,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_rides,
          SUM(CASE WHEN status = 'not_started' THEN 1 ELSE 0 END) as upcoming_rides,
          SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_rides,
          COALESCE(SUM(final_price), 0) as total_spent
        FROM rides
        WHERE user_id = ?`,
        [user_id]
      );
      return rows[0];
    } catch (err) {
      console.error('Error in getUserStats:', err);
      return {
        total_rides: 0,
        active_rides: 0,
        completed_rides: 0,
        upcoming_rides: 0,
        cancelled_rides: 0,
        total_spent: 0
      };
    }
  }

  static async findById(id) {
    return await this.getById(id);
  }

  static async cancel(id) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      
      // Get the ride details first
      const [ride] = await conn.execute(
        'SELECT vehicle_id, status FROM rides WHERE id = ?',
        [id]
      );
      
      if (!ride[0]) {
        throw new Error('Ride not found');
      }
      
      if (ride[0].status !== 'not_started') {
        throw new Error('Cannot cancel ride that has already started or completed');
      }
      
      // Update ride status to cancelled
      await conn.execute(
        'UPDATE rides SET status = "cancelled" WHERE id = ?',
        [id]
      );
      
      // Update vehicle status back to available
      await conn.execute(
        'UPDATE vehicles SET status = "available" WHERE id = ?',
        [ride[0].vehicle_id]
      );
      
      await conn.commit();
      return true;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
}

module.exports = Ride;