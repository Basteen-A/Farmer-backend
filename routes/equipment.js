const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Get all equipment
router.get('/', (req, res) => {
    db.query('SELECT * FROM equipment', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Add new equipment
router.post('/', (req, res) => {
    const { name, cost_per_hour } = req.body;
    db.query('INSERT INTO equipment (name, cost_per_hour) VALUES (?, ?)', 
        [name, cost_per_hour], 
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.json({ message: 'Equipment added' });
        }
    );
});

module.exports = router;
