const db = require('../config/db');

const User = {
  create: async (username, password, isAdmin = 0) => {
    const [result] = await db.query(
      'INSERT INTO users (username, password, is_admin) VALUES (?, ?, ?)',
      [username, password, isAdmin]
    );
    return result;
  },
  findByUsername: async (username) => {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  },
  getAll: async (search = '') => {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE username LIKE ? AND is_admin = 0',
      [`%${search}%`]
    );
    return rows;
  },
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result;
  }
};

module.exports = User;