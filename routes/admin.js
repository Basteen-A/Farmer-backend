const express = require('express');
const router = express.Router();
const db = require('../config/db');
const User = require('../models/user');
const TractorField = require('../models/tractorField');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.use(verifyToken);
router.use(verifyAdmin);

router.get('/users', async (req, res) => {
  const { search } = req.query;
  const users = await User.getAll(search);
  res.json(users);
});

router.delete('/users/:id', async (req, res) => {
  await User.delete(req.params.id);
  res.json({ message: 'User deleted' });
});

router.get('/fields', async (req, res) => {
  const fields = await TractorField.getAll();
  res.json(fields);
});

router.post('/fields', async (req, res) => {
  const { name, costPerHour } = req.body;
  await TractorField.create(name, costPerHour);
  res.json({ message: 'Field added successfully' });
});

router.delete('/fields/:id', async (req, res) => {
  await TractorField.delete(req.params.id);
  res.json({ message: 'Field deleted successfully' });
});

router.post('/bill', async (req, res) => {
  const { userId, field, time, cost, startTime, stopTime } = req.body;
  try {
    await db.query(
      'INSERT INTO bills (user_id, field_name, time, cost, status, start_time, stop_time) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, field, time, cost, 'pending', startTime, stopTime]
    );
    res.json({ message: 'Bill created' });
  } catch (error) {
    console.error('Error creating bill:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/bill/status', async (req, res) => {
  const { billId, status } = req.body;
  try {
    await db.query(
      'UPDATE bills SET status = ? WHERE id = ?',
      [status, billId]
    );
    res.json({ message: 'Bill status updated' });
  } catch (error) {
    console.error('Error updating bill status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/bills', async (req, res) => {
  try {
    const [bills] = await db.query(
      'SELECT b.*, u.username, COALESCE(b.time, 0) as time, COALESCE(b.cost, 0) as cost, ' +
      'b.start_time, b.stop_time, b.created_at FROM bills b JOIN users u ON b.user_id = u.id'
    );
    const formattedBills = bills.map(bill => ({
      ...bill,
      time: Number(bill.time),
      cost: Number(bill.cost),
    }));
    console.log('Bills data sent:', formattedBills);
    res.json(formattedBills);
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/bill/pay', async (req, res) => {
  const { billId, method } = req.body;
  try {
    await db.query(
      'UPDATE bills SET status = ?, payment_method = ? WHERE id = ?',
      ['paid', method, billId]
    );
    res.json({ message: 'Payment recorded' });
  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;