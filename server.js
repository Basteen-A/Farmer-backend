const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const db = require('./config/db');

app.use(cors());
app.use(express.json());

// Middleware to mount routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint to verify server status
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 3000;

// Database connection check
async function startServer() {
  try {
    const connection = await db.getConnection();
    console.log('Database connected successfully');
    connection.release(); // Release the connection back to the pool

    // Start the server only after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1); // Exit with failure code if DB connection fails
  }
}

// Start the server with DB check
startServer();