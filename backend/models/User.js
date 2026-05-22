const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async migrate() {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(10) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        reset_token VARCHAR(255) DEFAULT NULL,
        reset_token_expires DATETIME DEFAULT NULL,
        UNIQUE KEY uq_users_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    const alters = [
      `ALTER TABLE users MODIFY COLUMN password_hash VARCHAR(255) NOT NULL`,
      `ALTER TABLE users ADD COLUMN reset_token VARCHAR(255) DEFAULT NULL`,
      `ALTER TABLE users ADD COLUMN reset_token_expires DATETIME DEFAULT NULL`,
    ];
    for (const sql of alters) {
      try {
        await db.execute(sql);
      } catch (err) {
        if (!err.message.includes('Duplicate column')) throw err;
      }
    }
  }

  // Find user by email
  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  }

  // Find user by ID — never expose password_hash
  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT id, full_name, email, phone, role, is_active, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  // Find user by valid (non-expired) reset token
  static async findByResetToken(token) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
      [token]
    );
    return rows[0] || null;
  }

  // Create new user
  static async create({ full_name, email, password, phone, role = 'user' }) {
    const hashedPassword = await bcrypt.hash(password, 12);
    const [result] = await db.execute(
      `INSERT INTO users (full_name, email, phone, password_hash, role, is_active)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [full_name, email, phone, hashedPassword, role]
    );
    return { id: result.insertId, full_name, email, phone, role };
  }

  // Compare plain password against stored bcrypt hash
  static async comparePassword(plainPassword, hash) {
    return bcrypt.compare(plainPassword, hash);
  }

  // Save reset token + expiry timestamp
  static async saveResetToken(email, token, expires) {
    await db.execute(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
      [token, expires, email]
    );
  }

  // Update password and clear reset token fields
  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await db.execute(
      'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
      [hashedPassword, id]
    );
  }
}

module.exports = User;