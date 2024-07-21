
const mysql = require("mysql2");
// Config dotnev
require("dotenv").config();

// Replace the hard-coded values with the env variables
// const connection = mysql.createConnection({
//   host: process.env.MYSQL_HOST,
//   port: process.env.MYSQL_PORT,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DB,
//   connectTimeout: 12000
// });

// Crear conexión usando la URL completa
const conexion = mysql.createConnection(process.env.MYSQL_URL);




conexion.connect((err) => {
  if (err) {
    console.error("CONNECT FAILED", err.code);
    return;
  }
console.log("CONNECTED to the database");
});

// Ejemplo de una consulta
conexion.query('SELECT * FROM capitulos', (err, results, fields) => {
  if (err) {
      console.error('Error in query:', err);
      return;
  }
  console.log('Query results:', results);
});

module.exports = { conexion };
