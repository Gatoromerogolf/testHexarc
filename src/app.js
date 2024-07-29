
// node-mysql-app/app.js

const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const mysql = require('mysql2');
const { conexion } = require("./db");
const path = require('path');
const session = require('express-session');

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


// Endpoint para validar credenciales :::::::::::::::::::::::::::::::::::::::::::::::::::
app.use(cookieParser()); // Configura el middleware para leer cookies


app.use(session({
    secret: 'mi-super-secreto', // Cambia esto por un secreto más seguro en producción
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Cambia esto a true si usas HTTPS
}));

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
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
          res.status(200).json({ 
            message: 'Login exitoso',
            user: {
              firstName: user.Nombre,
              lastName: user.Apellido,
              CUIT: user.CUIT,
              ingresado: user.ingresado 
            }
          }); 
      } else {
          res.status(401).send('Credenciales inválidas');
      }
  });
});

// Ruta para actualizar el campo "ingresado" del usuario:::::::::::::::::::::::::::::::
app.post('/api/updateIngresado', (req, res) => {
  const { username, CUIT } = req.body;
  const query = 'UPDATE usuarios SET ingresado = 1 WHERE username = ? AND CUIT = ?';

  conexion.query(query, [username, CUIT], (error, results) => {
    if (error) {
      console.error('Error al actualizar el campo ingresado:', error);
      res.status(500).json({ error: 'Error al actualizar el campo ingresado' });
      return;
    }
    res.json({ message: 'Campo ingresado actualizado correctamente' });
  });
});

// Ruta protegida que requiere autenticación :::::::::::::::::::::::::::::::::::::::::.
app.get('/protected', (req, res) => {
  if (req.session.user) {
      res.status(200).send(`Bienvenido ${req.session.user.username}`);
  } else {
      res.status(401).send('Necesitas iniciar sesión');
  }
});

// Ruta para obtener los registros de la tabla capitulos ::::::::::::::::::::
app.get('/capitulos', (req, res) => {
  const indice = parseInt(req.query.indice) || 0;
  const query = 'SELECT * FROM capitulos WHERE ID = ?';

  conexion.query(query, [indice], (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: 'Error al obtener los registros' });
        console.log("error servidor al obtener registros");
        return;
      }

      if (results.length > 0) {
        res.json(results);
      } else {
        res.status(404).json({ error: 'No se encontraron registros' });
      }
    });
  });

// Ruta para obtener los totales de la tabla totalcapitulos ::::::::::::::::::::
app.get('/totalCapitulos', (req, res) => {
  const CUIT = req.query.CUIT;
  const capitulo = req.query.capitulo;

  if (!CUIT || !capitulo) {
      res.status(400).json({ error: 'Faltan parámetros CUIT o capitulo' });
      return;
    }

  const query = 'SELECT * FROM totalcapitulos WHERE CUIT = ? AND capitulo = ?';

  conexion.query(query, [CUIT, capitulo], (error, results, fields) => {
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

// Ruta para obtener todos los registros de la tabla secciones ::::::::::::::::::::
app.get('/secciones', (req, res) => {
  const indice = parseInt(req.query.indice) || 0;
  const query = 'SELECT * FROM secciones WHERE seccion = ?';

  conexion.query(query, [indice], (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: 'Error al obtener los registros' });
        console.log("error servidor al obtener registros");
        return;
      }
  
      if (results.length > 0) {  // Verificar si hay al menos un registro
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
      } else {
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


// Inserción de registros en MySQL opcion 2 :::::::::::::::::::::::::::::::::::::
app.post('/insertar2', (req, res) => {
  if (!req.session.user){
      return res.status(401).json({ error: 'No estás autenticado' });
  }

  const { capitulo, seccion, score, respuesta } = req.body;
  const usuario = req.session.user.username; // Obtener el usuario de la sesión
  const CUIT = req.session.user.CUIT;

  if (!usuario) {
      return res.status(400).json({ error: 'Usuario no definido en la sesión' });
  }

  const respuestaJSON = JSON.stringify(respuesta);   // Convertir el array de respuesta a un string JSON  
  const nuevoResultado = 'INSERT INTO respuestas (CUIT, usuario, capitulo, seccion, score, respuesta) VALUES (?, ?, ?, ?, ?, ?)';
  const datosAPasar = [CUIT, usuario, capitulo, seccion, score, respuestaJSON];

  conexion.query(nuevoResultado, datosAPasar, function (error, lista) {
      if (error) {
          if (error.code === 'ER_DUP_ENTRY') {
              res.status(409).json({ error: 'Ya existe una respuesta para esta combinación de capitulo y seccion' });
          } else {
          console.log('Error:', error);
          res.status(500).json({ error: error.message });
      }
      } else {
          console.log(lista.insertId, lista.fieldCount);
          res.status(200).json({ success: true });
      }
  });
});

// Use PORT provided in environment or default to 3000
const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => console.log(`Server is listening on port ${port}`));
