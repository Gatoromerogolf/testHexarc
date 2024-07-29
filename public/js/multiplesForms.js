/* Para manejar múltiples formularios y diferentes inserciones en la base de datos, no es necesario definir 15 rutas diferentes en app.js. En su lugar, puedes utilizar una sola ruta y pasar diferentes datos desde el cliente según el formulario que se esté enviando. Aquí tienes un enfoque general para manejar esto:

1. Configuración del Servidor (app.js)
Define una sola ruta que maneje las inserciones en la base de datos. Utiliza el cuerpo de la solicitud para determinar qué datos se están enviando y cómo deben ser insertados en la base de datos.*/

// app.js
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const conexion = mysql.createConnection({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

conexion.connect(function (err) {
  if (err) {
    console.log('No se pudo conectar:', err);
    throw err;
  } else {
    console.log('Conexión exitosa a la base hexarci');
  }
});

app.post('/insertar', (req, res) => {
  const { cuit, usuario, capitulo, pregunta, datos, puntaje, porciento } = req.body;
  
  const nuevoResultado = 'INSERT INTO a15 (clave, cuit, usuario, capitulo, pregunta, datos, puntaje, porciento) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)';
  const datosAPasar = [cuit, usuario, capitulo, pregunta, datos, puntaje, porciento];

  conexion.query(nuevoResultado, datosAPasar, function (error, lista) {
    if (error) {
      console.log('Error:', error);
      res.status(500).json({ error: error.message });
    } else {
      console.log(lista.insertId, lista.fieldCount);
      res.status(200).json({ success: true });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

/* 2. Lado del Cliente (Frontend)
En cada formulario, recolecta los datos específicos y envíalos al servidor utilizando la ruta /insertar. Aquí tienes un ejemplo de cómo podría verse un formulario y la función para enviar los datos:*/


  <script>
    async function enviarFormulario() {
      const cuit = "20114512894"; // Puedes obtener estos valores dinámicamente de tus formularios
      const usuario = "ruben";
      const capitulo = "A";
      const pregunta = 15;
      const datos = document.getElementById('respuesta').value; // Ejemplo de obtención de datos del formulario
      const puntaje = 100;  // Ejemplo de puntaje calculado
      const porciento = "50%";  // Ejemplo de porcentaje calculado

      const body = { cuit, usuario, capitulo, pregunta, datos, puntaje, porciento };

      try {
        const response = await fetch('/insertar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        const result = await response.json();
        if (result.success) {
          alert("Datos insertados correctamente");
        } else {
          throw new Error(result.error || 'Error desconocido');
        }
      } catch (error) {
        console.log('Error:', error);
        alert("Hubo un error al insertar los datos: " + error.message);
      }
    }
  </script>

/*
<body>
  <form onsubmit="enviarFormulario(); return false;">
    <label for="respuesta">Respuesta:</label>
    <input type="text" id="respuesta" name="respuesta">
    <button type="submit">Enviar</button>
  </form>
</body>
*/

/*
Explicación
1. - Servidor (app.js):

. Configura una única ruta '/insertar' para manejar todas las inserciones en la base de datos.
. Extrae los datos del cuerpo de la solicitud ('req.body') y los usa para realizar la inserción en la base de datos.


2. - Cliente (HTML y JavaScript):

. En cada formulario, recolecta los datos necesarios y envíalos al servidor mediante una solicitud 'fetch' a la ruta '/insertar'.
. La función 'enviarFormulario' se llama cuando se envía el formulario, recolecta los datos y hace la solicitud 'fetch'.

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Manejo de múltiples formularios
Si tienes múltiples formularios, puedes adaptar la función enviarFormulario para recolectar datos específicos de cada formulario. Por ejemplo, puedes pasar un identificador de formulario a la función y usarlo para obtener los valores correctos.*/

<!DOCTYPE html>
<html>
<head>
  <title>Formularios Múltiples</title>
  <script>
    async function enviarFormulario(formId) {
      const cuit = "20114512894"; // Puedes obtener estos valores dinámicamente de tus formularios
      const usuario = "ruben";
      const capitulo = formId; // Ejemplo de obtención de capitulo dinámicamente
      const pregunta = 15;
      const datos = document.getElementById(`respuesta-${formId}`).value; // Ejemplo de obtención de datos del formulario
      const puntaje = 100;  // Ejemplo de puntaje calculado
      const porciento = "50%";  // Ejemplo de porcentaje calculado

      const body = { cuit, usuario, capitulo, pregunta, datos, puntaje, porciento };

      try {
        const response = await fetch('/insertar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        const result = await response.json();
        if (result.success) {
          alert("Datos insertados correctamente");
        } else {
          throw new Error(result.error || 'Error desconocido');
        }
      } catch (error) {
        console.log('Error:', error);
        alert("Hubo un error al insertar los datos: " + error.message);
      }
    }
  </script>
</head>
<body>
  <form onsubmit="enviarFormulario('A'); return false;">
    <label for="respuesta-A">Respuesta A:</label>
    <input type="text" id="respuesta-A" name="respuesta-A">
    <button type="submit">Enviar A</button>
  </form>

  <form onsubmit="enviarFormulario('B'); return false;">
    <label for="respuesta-B">Respuesta B:</label>
    <input type="text" id="respuesta-B" name="respuesta-B">
    <button type="submit">Enviar B</button>
  </form>
</body>
</html>

/*  Con este enfoque, puedes manejar múltiples formularios y diferentes inserciones en la base de datos utilizando una sola ruta en tu servidor y adaptando el código del cliente para recolectar y enviar los datos correctos para cada formulario.  */
