const db = require('../config/db');

exports.getEquipments = (req, res) => {
  db.query('SELECT * FROM equipments', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.addEquipment = (req, res) => {
  const { name, cost_per_hour } = req.body;
  db.query('INSERT INTO equipments (name, cost_per_hour) VALUES (?, ?)', 
    [name, cost_per_hour], 
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, name, cost_per_hour });
  });
};

exports.deleteEquipment = (req, res) => {
  db.query('DELETE FROM equipments WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Equipment deleted' });
  });
};
