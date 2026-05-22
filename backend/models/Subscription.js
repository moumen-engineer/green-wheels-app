const db = require('../config/db');

class Subscription {
  static async migrate() {
    // Create the subscriptions table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        period VARCHAR(50) NOT NULL,
        description TEXT,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_title (title)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Check if subscriptions exist, if not insert them
    const [existing] = await db.execute('SELECT COUNT(*) as count FROM subscriptions');
    if (existing[0].count === 0) {
      const subscriptions = [
        ['Horaire', 200, '/heure', 'Idéal pour les courts trajets'],
        ['Journalier', 750, '/jour', 'Parfait pour une journée d\'exploration'],
        ['Mensuel', 5000, '/mois', 'Pour les trajets quotidiens'],
        ['Annuel', 40000, '/an', 'L\'offre la plus avantageuse']
      ];

      for (const [title, price, period, description] of subscriptions) {
        await db.execute(
          'INSERT INTO subscriptions (title, price, period, description) VALUES (?, ?, ?, ?)',
          [title, price, period, description]
        );
      }
    }
  }

  static async getAll() {
    const [rows] = await db.execute('SELECT * FROM subscriptions ORDER BY id ASC');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.execute('SELECT * FROM subscriptions WHERE id = ?', [id]);
    return rows[0];
  }
}

module.exports = Subscription;