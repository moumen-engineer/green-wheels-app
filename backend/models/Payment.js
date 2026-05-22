const db = require('../config/db');

class Payment {
  static async migrate() {
    // First ensure users table exists with correct column type
    await db.execute(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        subscription_id INT DEFAULT NULL,
        ride_id INT DEFAULT NULL,
        amount DECIMAL(10,2) NOT NULL,
        method VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        paid_at TIMESTAMP NULL DEFAULT NULL,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Try to add foreign key if users table exists
    try {
      await db.execute(`
        ALTER TABLE payments 
        ADD CONSTRAINT payments_ibfk_1 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      `);
    } catch (err) {
      // Foreign key might already exist or users table doesn't exist yet
      console.log('Foreign key constraint note:', err.message);
    }
  }

  static async create({ user_id, subscription_id, ride_id, amount, method, status }) {
    const paid_at = status === 'completed' ? new Date() : null;
    
    const [result] = await db.execute(
      `INSERT INTO payments (user_id, subscription_id, ride_id, amount, method, status, paid_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, subscription_id || null, ride_id || null, amount, method, status, paid_at]
    );
    
    // Get the inserted payment
    const [payments] = await db.execute(
      'SELECT * FROM payments WHERE id = ?',
      [result.insertId]
    );
    
    if (!payments || payments.length === 0) {
      throw new Error('Failed to create payment - record not found after insert');
    }
    
    return payments[0];
  }

  static async getUserPayments(user_id) {
    const [rows] = await db.execute(
      'SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC',
      [user_id]
    );
    return rows;
  }

  static async getPaymentById(payment_id) {
    const [rows] = await db.execute(
      'SELECT * FROM payments WHERE id = ?',
      [payment_id]
    );
    return rows && rows.length > 0 ? rows[0] : null;
  }

  static async updateStatus(payment_id, status) {
    const paid_at = status === 'completed' ? new Date() : null;
    await db.execute(
      'UPDATE payments SET status = ?, paid_at = COALESCE(?, paid_at) WHERE id = ?',
      [status, paid_at, payment_id]
    );
  }
}

module.exports = Payment;