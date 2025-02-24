const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || 'sql12.freesqldatabase.com',
  user: process.env.DATABASE_USER || 'sql12764417',
  password: process.env.DATABASE_PASSWORD || 'S9QRgVZAhd',
  database: process.env.DATABASE_NAME || 'sql12764417',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;