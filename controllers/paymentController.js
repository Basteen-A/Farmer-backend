const db = require('../config/db');

exports.makePayment = (req, res) => {
  const { userId, amount, method } = req.body;
  db.query('INSERT INTO payments (user_id, amount, payment_method, status) VALUES (?, ?, ?, "completed")', 
    [userId, amount, method], 
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Payment successful' });
  });
};
