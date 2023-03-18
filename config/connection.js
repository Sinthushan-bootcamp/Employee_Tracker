const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'wilmott2',
      database: 'company_db'
    },
);

module.exports = db;