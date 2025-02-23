const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findByUsername(username);
  
  if (user && user.password === password) { // Use proper hashing in production
    const token = jwt.sign(
      { id: user.id, isAdmin: user.is_admin },
      'your_secret_key',
      { expiresIn: '1h' }
    );
    res.json({ token, isAdmin: user.is_admin, userId: user.id }); // Include userId
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

router.post('/signup', async (req, res) => {
  const { username, password, isAdmin } = req.body;
  try {
    await User.create(username, password, isAdmin);
    res.json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Username already exists' });
  }
});

module.exports = router;