const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || 'sql303.infinityfree.com',
  user: process.env.DATABASE_USER || 'if0_38381839',
  password: process.env.DATABASE_PASSWORD || 'Basteen0713',
  database: process.env.DATABASE_NAME || 'if0_38381839_farmer',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;