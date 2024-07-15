
const mysql = require("mysql2");
// Config dotnev
require("dotenv").config();

// Replace the hard-coded values with the env variables
connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
});
connection.connect((err) => {
  if (err) {
    console.error("CONNECT FAILED", err.code);
  } else console.log("CONNECTED");
});

module.exports = { connection };
