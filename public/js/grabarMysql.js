// // Paso 1: Configuración del Servidor con Node.js
// // En tu archivo app.js (lado del servidor), configuras y exportas la conexión a la base de datos:
// // app.js
// const mysql = require('mysql');

// const conexion = mysql.createConnection({
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD
// });

// conexion.connect(function (err) {
//   if (err) {
//     console.log('No se pudo conectar:', err);
//     throw err;
//   } else {
//     console.log('Conexión exitosa a la base hexarci');
//   }
// });

// module.exports = conexion;

// // ::::::::::::::::::::::::::::::::::::::::::::::::::

// // Paso 2: Crear una Ruta API para Insertar Datos
// // Luego, creas una ruta en tu servidor para manejar las solicitudes de inserción de datos desde el cliente. Puedes usar Express.js para esto:

// // server.js
// const express = require('express');
// const bodyParser = require('body-parser');
// const conexion = require('./app.js'); // Ajusta la ruta según sea necesario

// const app = express();
// app.use(bodyParser.json());

// app.post('/insertar', (req, res) => {
//   const { respuestas } = req.body;
//   const nuevoResultado = 'INSERT INTO a15 (clave, cuit, usuario, capitulo, pregunta, datos, puntaje, porciento) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)';
//   const valores = 100;  // Ejemplo de puntaje
//   const porcientoFormateado = "50%";  // Ejemplo de porcentaje formateado
//   const datosAPasar = ["20114512894", "ruben", "A", 15, respuestas, valores, porcientoFormateado];

//   conexion.query(nuevoResultado, datosAPasar, function (error, lista) {
//     if (error) {
//       console.log('Error:', error);
//       res.status(500).json({ error: error.message });
//     } else {
//       console.log(lista.insertId, lista.fieldCount);
//       res.status(200).json({ success: true });
//     }
//   });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Servidor escuchando en el puerto ${PORT}`);
// });

// // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// // Paso 3: Lado del Cliente (Frontend)
// // En el lado del cliente (navegador), usas fetch para hacer una solicitud a la ruta API que creaste en el servidor:

// <!DOCTYPE html>
// <html>
// <head>
//   <title>Formulario</title>
//   <script>
//     function continuar() {
//       cerrarAlerta();  // Opcional, depende de si quieres cerrar la alerta antes de cambiar la página
//       alert("entro en continuar");

//       grabarResultados('respuestaEjemplo').then(() => {
//         alert("ahora llama al menu-a");
//         window.location.href = (JSON.parse(localStorage.getItem('idioma'))) == 1 ? "Menu-A.html" : "Menu-A-en.html";
//       }).catch((error) => {
//         console.error('Error en grabarResultados:', error);
//         alert("Hubo un error al grabar los resultados: " + error.message);
//       });
//     }

//     async function grabarResultados(respuestas) {
//       alert("entro en grabar resultados");
//       try {
//         const response = await fetch('/insertar', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ respuestas })
//         });

//         const result = await response.json();
//         if (result.success) {
//           alert("no hay error");
//         } else {
//           throw new Error(result.error || 'Error desconocido');
//         }
//       } catch (error) {
//         console.log('Error:', error);
//         alert("estamos en el error: " + error.message);
//         throw error; // Rechaza la promesa en caso de error
//       }
//     }
//   </script>
// </head>
// <body>
//   <button onclick="continuar()">Continuar</button>
// </body>
// </html>


//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

/*Explicación:
Servidor (app.js y server.js):

- app.js configura la conexión a la base de datos y la exporta.
- server.js configura un servidor Express y define una ruta API /insertar para manejar solicitudes de inserción.

Cliente (index.html):

Usa JavaScript del lado del cliente para enviar datos al servidor a través de una solicitud fetch a la ruta /insertar.
Con esta separación clara, tu código puede manejar correctamente la inserción de datos en la base de datos MySQL desde una aplicación web.*/