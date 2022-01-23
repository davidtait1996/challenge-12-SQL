require('dotenv').config();
const mysql = require('mysql2');


const db = mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME
  },
  console.log('connected to the company database')
);


module.exports = db;