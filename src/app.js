
// node-mysql-app/app.js

const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('mysql2');
const { conexion } = require("./db");
const path = require('path');
const session = require('express-session')

const app = express();

// Middleware para parsear el cuerpo de las solicitudes::::::::::::::::::::
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para servir archivos estáticos::::::::::::::::::::::::::::::
app.use(express.static(path.join(__dirname, '../public')));

// Ruta para servir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// // Ruta para servir el archivo login.html
// app.get('/login', (req, res) => {
//   res.sendFile(path.join(__dirname, '../public', 'login.html'));
// });


// Conexión a la base de datos::::::::::::::::::::::::::::::::::::::::::::::
// const conexion = mysql.createconexion({
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD
// });  

// Endpoint para validar credenciales :::::::::::::::::::::::::::::::::::::::::::::::::::
app.use(cookieParser()); // Configura el middleware para leer cookies
app.use(session({
    secret: 'mi-super-secreto', // Cambia esto por un secreto más seguro en producción
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Cambia esto a true si usas HTTPS
}));

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // Verificar las credenciales del usuario
  conexion.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
      if (err) {
          res.status(500).json({ error: 'Error en la base de datos' });
      } else if (results.length > 0) {
          const user = results[0]; // Accede a la primera fila de los resultados
          req.session.user = {
             username: user.username,
             firstName: user.Nombre,
             lastName: user.Apellido,
             CUIT: user.CUIT}; // Guarda el usuario como un objeto en la sesión
          // res.status(200).send('Login exitoso');
          res.status(200).json({ message: 'Login exitoso', user: { firstName: user.Nombre, lastName: user.Apellido, CUIT: user.CUIT, ingresado: user.ingresado } }); 
      } else {
          res.status(401).send('Credenciales inválidas');
      }
  });
});


// Ruta para obtener los registros de la tabla capitulos ::::::::::::::::::::
app.get('/capitulos', (req, res) => {
  // obtiene el indice de la consulta
  const indice = parseInt(req.query.indice) || 0;
  // console.log (`el indice leido en /secciones:  ${indice}`)
  const query = 'SELECT * FROM capitulos WHERE ID = ?';

  conexion.query(query, [indice], (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: 'Error al obtener los registros' });
        console.log("error servidor al obtener registros");
        return;
      }
  
      // Verificar si hay al menos un registro
      if (results.length > 0) {
        res.json(results);
      } else {
        res.status(404).json({ error: 'No se encontraron registros' });
      }
    });
  });

// Ruta para obtener los totales de la tabla totalcapitulos ::::::::::::::::::::
app.get('/totalCapitulos', (req, res) => {
  // obtiene el indice de la consulta
  const CUIT = req.query.CUIT;
  const capitulo = req.query.capitulo;

  if (!CUIT || !capitulo) {
      res.status(400).json({ error: 'Faltan parámetros CUIT o capitulo' });
      return;
    }

  console.log(`Recibido CUIT: ${CUIT}, capitulo: ${capitulo}`);

  const query = 'SELECT * FROM totalcapitulos WHERE CUIT = ? AND capitulo = ?';

  conexion.query(query, [CUIT, capitulo], (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: 'Error al obtener los registros' });
        console.log("error servidor al obtener registros");
        return;
      }
      console.log('Resultados de la consulta:', results);
      
      // Verificar si hay al menos un registro
      if (results.length > 0) {
        res.json(results);
      } else {
        res.status(404).json({ error: 'No se encontraron registros' });
      }
    });
  });

  
// Ruta para obtener todos los registros de la tabla secciones ::::::::::::::::::::
app.get('/secciones', (req, res) => {
  // obtiene el indice de la consulta
  const indice = parseInt(req.query.indice) || 0;
  // console.log (`el indice leido en /secciones:  ${indice}`)
  const query = 'SELECT * FROM secciones WHERE seccion = ?';

  conexion.query(query, [indice], (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: 'Error al obtener los registros' });
        console.log("error servidor al obtener registros");
        return;
      }
  
      // Verificar si hay al menos un registro
      if (results.length > 0) {
        res.json(results);
      } else {
        res.status(404).json({ error: 'No se encontraron registros' });
      }
    });
  });

// Ruta para obtener todos las preguntas de la tabla ::::::::::::::::::::
app.get('/preguntas', (req, res) => {
  const query = 'SELECT * FROM preguntas';

  conexion.query(query, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener los registros' });
      return;
    }
    res.json(results);
  });
});



// Ruta para buscar respuestas por cuit y capitulo.:::::::::::::::::::
app.get('/busca-respuesta-capitulo', (req, res) => {
  const { CUIT, capitulo } = req.query;

  if (!CUIT || !capitulo) {
      res.status(400).json({ error: 'Faltan parámetros requeridos' });
      console.log (`valores CUIT ${CUIT}, capitulo ${capitulo}`)
      console.log (`salio en error por aca`)
      return;
    }
  const query = 'SELECT * FROM respuestas WHERE cuit = ? AND capitulo = ?';
  const values = [CUIT, capitulo];

  conexion.query(query, values, (error, results, fields) => {
      if (error) {
        console.log ('primer error en el query')
        res.status(500).json({ error: 'Error al buscar el registro' });
        return;
      }
      if (results.length > 0) {
        res.json({ exists: true, records: results});
        // console.log('Resultados encontrados busca-respuesta-capitulo - despues json:', results);
      } else {
        // console.log (`no hay respuesta para CUIT ${CUIT} y capitulo ${capitulo} en busca-respuesta-capitulo`)
        res.json({ exists: false });
        }
      });
    });



// Ruta para obtener todos las respuestas de la tabla textorespuestas::::::::::::::::::::
app.get('/textorespuestas', (req, res) => {
  const query = 'SELECT * FROM textorespuestas';

  conexion.query(query, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener los registros' });
      return;
    }
    console.log ('lectura tabla texto:' , results )
    res.json(results);
  });
});



// Ruta para obtener todos las respuestas de la tabla textocheck::::::::::::::::::::
app.get('/textocheck', (req, res) => {
  const query = 'SELECT * FROM textocheck';

  conexion.query(query, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener los registros' });
      return;
    }
    res.json(results);
  });
});





app.get("/api/preguntas", (req, res) => {
  conexion.query("SELECT * FROM preguntas", (err, data) => {
    if (err) {
      console.error("Error in query:", err);
      res.status(500).json({ error: "Error fetching data from database" });
      return;
    }
    res.status(200).json({
      status: "success",
      length: data.length,
      data,
    });
  });
});

app.get("/api/respuestas", (req, res) => {
  conexion.query("SELECT * FROM respuestas", (err, data) => {
    if (err) {
      console.error("Error in query:", err);
      res.status(500).json({ error: "Error fetching data from database" });
      return;
    }
    res.status(200).json({
      status: "success",
      length: data.length,
      data,
    });
  });
});



app.listen(8080, () => console.log(`Server is listening on port ${8080}`));
