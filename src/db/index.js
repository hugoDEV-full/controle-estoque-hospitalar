const mysql = require('mysql2/promise');

let pool;

function createPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'estoque_hospital',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      timezone: 'Z',
      dateStrings: true,
    });
  }
  return pool;
}

function getDbPool() {
  if (!pool) {
    return createPool();
  }
  return pool;
}

module.exports = { createPool, getDbPool };


