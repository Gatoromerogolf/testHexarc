const mysql = require("mysql2");
// Config dotnev
require("dotenv").config();

// Crear un pool de conexiones usando la URL completa
const pool = mysql.createPool({
  uri: process.env.MYSQL_URL,        // Usar la URL completa desde la variable de entorno
  waitForConnections: true,          // Esperar conexiones si todas están en uso
  connectionLimit: 10,               // Número máximo de conexiones en el pool
  queueLimit: 0                      // Límite de la cola de solicitudes (0 = sin límite)
});

// Verificar la conexión inicial
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Falló la conexión a la BD", err.code);
    return;
  }
  console.log("Conectado a la BD a través del pool");

  // Liberar la conexión de vuelta al pool
  connection.release();
});

// Exportar el pool para que pueda ser utilizado en otras partes de la aplicación
module.exports = { pool };


// const mysql = require("mysql2");
// // Config dotnev
// require("dotenv").config();

// // Crear conexión usando la URL completa
// const conexion = mysql.createConnection(process.env.MYSQL_URL);

// conexion.connect((err) => {
//   if (err) {
//     console.error("CONNECT FAILED", err.code);
//     return;
//   }
// console.log("CONNECTED to the database");
// });

// module.exports = { conexion };



// Replace the hard-coded values with the env variables
// const connection = mysql.createConnection({
//   host: process.env.MYSQL_HOST,
//   port: process.env.MYSQL_PORT,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DB,
//   connectTimeout: 12000
// });
