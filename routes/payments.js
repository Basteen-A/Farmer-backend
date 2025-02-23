const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Get all payments
router.get('/', (req, res) => {
    db.query('SELECT * FROM payments', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Create payment record
router.post('/', (req, res) => {
    const { user_id, amount, payment_method } = req.body;
    db.query('INSERT INTO payments (user_id, amount, payment_method, status) VALUES (?, ?, ?, "Pending")', 
        [user_id, amount, payment_method], 
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.json({ message: 'Payment record created' });
        }
    );
});

module.exports = router;
