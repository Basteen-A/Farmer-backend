const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || 'bw75y1qbnq5pdsswl5bc-mysql.services.clever-cloud.com',
  user: process.env.DATABASE_USER || 'urpglkc75qmjzfy0',
  password: process.env.DATABASE_PASSWORD || 'zIMEAqJZubZcOMeJ4mWm',
  database: process.env.DATABASE_NAME || 'bw75y1qbnq5pdsswl5bc',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
