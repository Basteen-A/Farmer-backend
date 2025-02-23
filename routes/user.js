const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/bills', async (req, res) => {
  try {
    console.log('User bills endpoint hit by user:', req.user.id);
    const userId = req.user.id;
    const [bills] = await db.query(
      'SELECT b.*, u.username, COALESCE(b.time, 0) as time, COALESCE(b.cost, 0) as cost, ' +
      'b.start_time, b.stop_time, b.created_at, b.status, b.payment_method ' +
      'FROM bills b JOIN users u ON b.user_id = u.id WHERE b.user_id = ?',
      [userId]
    );
    const formattedBills = bills.map(bill => ({
      ...bill,
      time: Number(bill.time),
      cost: Number(bill.cost),
    }));
    console.log('User bills data sent:', formattedBills);
    res.json(formattedBills);
  } catch (error) {
    console.error('Error fetching user bills:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/pay/initiate', async (req, res) => {
  const { billId } = req.body;
  const userId = req.user.id;

  try {
    console.log('Initiating payment for billId:', billId, 'userId:', userId);
    const [bill] = await db.query(
      'SELECT cost FROM bills WHERE id = ? AND user_id = ? AND status = "pending"',
      [billId, userId]
    );
    if (!bill.length) {
      console.log('Bill not found or already paid for billId:', billId);
      return res.status(404).json({ error: 'Bill not found or already paid' });
    }

    // Return transactionId (using billId for simplicity)
    res.json({
      transactionId: billId, // Use billId as a placeholder; ideally, generate a unique ID
      amount: bill[0].cost,
      currency: 'INR',
    });
  } catch (error) {
    console.error('Error initiating payment:', error);
    res.status(500).json({ error: 'Payment initiation failed' });
  }
});

// Optional: Add verification endpoint if using a webhook or manual check later
router.post('/pay/verify', async (req, res) => {
  const { billId, paymentId } = req.body; // Expect paymentId from UPI app if integrated
  const userId = req.user.id;

  try {
    await db.query(
      'UPDATE bills SET status = ?, payment_method = ?, payment_id = ? WHERE id = ? AND user_id = ?',
      ['completed', 'UPI', paymentId || 'manual', billId, userId]
    );
    res.json({ message: 'Payment successful' });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

module.exports = router;