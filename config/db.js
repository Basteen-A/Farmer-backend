const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || 'sql106.infinityfree.com',
  user: process.env.DATABASE_USER || 'if0_37346247',
  password: process.env.DATABASE_PASSWORD || 'Basteen1307',
  database: process.env.DATABASE_NAME || 'if0_38381839_farmer',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;