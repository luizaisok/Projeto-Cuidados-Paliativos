const path = require('path');
require('dotenv').config({ 
    path: path.join(__dirname, '../../database/env/.env') 
});

const mysql = require('mysql2/promise');

console.log('User:', process.env.MYSQL_USER);
console.log('Pass:', process.env.MYSQL_PASS);
console.log('Host:', process.env.MYSQL_HOST);
console.log('DB:', process.env.DB_NAME);

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
