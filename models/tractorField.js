const db = require('../config/db');

const TractorField = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM tractor_fields');
    return rows;
  },
  create: async (name, costPerHour) => {
    const [result] = await db.query(
      'INSERT INTO tractor_fields (name, cost_per_hour) VALUES (?, ?)',
      [name, costPerHour]
    );
    return result;
  },
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM tractor_fields WHERE id = ?', [id]);
    return result;
  }
};

module.exports = TractorField;