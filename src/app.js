// node-mysql-app/app.js

const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const mysql = require('mysql2');
const { conexion } = require("./db");
const path = require('path');
const session = require('express-session');
const MySQLStore = require ('express-mysql-session')(session);
const ExcelJS = require('exceljs')

const app = express();

// Middleware para parsear el cuerpo de las solicitudes::::::::::::::::::::
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para servir archivos estáticos::::::::::::::::::::::::::::::
app.use(express.static(path.join(__dirname, '../public')));

// Endpoint para validar credenciales :::::::::::::::::::::::::::::::::::::::::::::::::::
app.use(cookieParser()); // Configura el middleware para leer cookies

// const options = {
//   host: viaduct.proxy.rlwy.net,
//   port: 21820,
//   user: root,
//   password: oJVNwXXIFCKCZKWKijLUSccbRQnIjqTC,
//   database: railway
// }
const options = {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB
};

const sessionStore = new MySQLStore(options);

app.use(session({
    secret: process.env.SESSION_SECRET, // Cambia esto por un secreto más seguro en producción
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Cambia esto a true si usas HTTPS
}));

// Ruta para servir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});


app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  conexion.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
      if (err) {
          res.status(500).json({ error: 'Error en la base de datos' });
      } else if (results.length > 0) {
          const user = results[0]; // Accede a la primera fila de los resultados
          req.session.user = {
            id: user.id,
            username: user.username,
            firstName: user.Nombre,
            lastName: user.Apellido,
            empresa: user.Empresa,
            CUIT: user.CUIT}; // Guarda el usuario como un objeto en la sesión
          res.status(200).json({ 
            message: 'Login exitoso',
            user: {
              id: user.id,
              username: user.username,
              firstName: user.Nombre,
              lastName: user.Apellido,
              empresa: user.Empresa,
              CUIT: user.CUIT,
              ingresado: user.ingresado 
            }
          }); 
          updateLoginTimestamp(user.id);
      } else {
          res.status(401).send('Credenciales inválidas');
      }
  });

  function updateLoginTimestamp(id) {  // Función para actualizar el timestamp en el login
    const query = 'UPDATE users SET visita = NOW() WHERE id = ?';
    conexion.query(query, [id], (error, results) => {
      if (error) {
        console.error('Error al actualizar el timestamp:', error);
      } else {
        console.log('Timestamp actualizado correctamente para el usuario ID:', id);
      }
    });
  }


});

// Ruta para actualizar el campo "ingresado" del usuario:::::::::::::::::::::::::::::::
app.post('/api/updateIngresado', (req, res) => {
  const { username, CUIT } = req.body;
  console.log (`llego a la api usuario ${username}, cuit ${CUIT}`)
  const query = 'UPDATE users SET ingresado = 1 WHERE username = ? AND CUIT = ?';

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
      if (results.length > 0) {
        res.json(results);
      } else {
        res.status(404).json({ error: 'No se encontraron registros' });
      }
    });
  });

  // Ruta para actualizar la tabla capitulos con los totales.:::::::::::::::::::
app.post('/total-Capitulo', (req, res) => {
  if (!req.session.user){
      return res.status(401).json({ error: 'No estás autenticado' });
  }

  const { capitulo, maximo, score, porcentaje } = req.body;
  const usuario = req.session.user.username; // Obtener el usuario de la sesión
  const CUIT = req.session.user.CUIT; // Obtiene el cuit

  if (!usuario) {
      return res.status(400).json({ error: 'Usuario no definido en la sesión' });
  }

  const nuevoTotal = 'INSERT INTO totalcapitulos (CUIT, capitulo, maximo, score, porcentaje) VALUES (?, ?, ?, ?, ?)';
  const datosAPasar = [CUIT, capitulo, maximo, score, porcentaje];

  conexion.query(nuevoTotal, datosAPasar, function (error, lista) {
      if (error) {
          if (error.code === 'ER_DUP_ENTRY') {
              console.log('Ya existe una respuesta para esta combinación de CUIT y Capitulo - sigue normal');                // Manejar el error de duplicación
          } else {
          console.log('Error:', error);
          res.status(500).json({ error: error.message });
      }
      } else {
          // console.log(lista.insertId, lista.fieldCount);
          res.status(200).json({ success: true });
      }
  });
});

// Ruta para obtener toda la lista de precios ::::::::::::::::::::
app.get('/leeListaPrecios', (req, res) => {
  const query = 'SELECT * FROM listaprecios';

  conexion.query(query, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener los registros' });
      return;
    }
    res.json(results);
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

// Ruta para saber si existe respuesta para la seccion ::::::::::::::::::::
app.get('/busca-respuesta', (req, res) => {
  const { CUIT, capitulo, seccion } = req.query;

  if (!CUIT || !capitulo || !seccion) {
      res.status(400).json({ error: 'Faltan parámetros requeridos' });
      console.log (`valores CUIT ${CUIT}, capitulo ${capitulo}, seccion ${seccion}`)
      console.log (`salio en error por aca`)
      return;
    }
  const query = 'SELECT * FROM respuestas WHERE cuit = ? AND capitulo = ? AND seccion = ?';
  const values = [CUIT, capitulo, seccion];

  conexion.query(query, values, (error, results, fields) => {
      if (error) {
          console.log ('primer error en el query')
        res.status(500).json({ error: 'Error al buscar el registro' });
        return;
      }

      if (results.length > 0) {
          res.json({ exists: true, record: results[0] });  //devuelve registro completo
        } else {
          // console.log (`no hay respuesta para seccion ${seccion} en busca-respuesta`)
          res.json({ exists: false });
        }
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
    // console.log ('lectura tabla texto:' , results )
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

// Ruta para obtener todos las preguntas de la tabla ::::::::::::::::::::
app.get('/preguntas', (req, res) => {
  const query = 'SELECT * FROM preguntas ORDER BY Capitulo, Seccion, Numero';

  conexion.query(query, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener los registros' });
      return;
    }
    res.json(results);
  });
});

// Ruta para obtener todos las respuestas de la tabla ::::::::::::::::::::
app.get('/respuestas', (req, res) => {
  const query = 'SELECT * FROM respuestas';
  conexion.query(query, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener los registros' });
      return;
    }
    res.json(results);
  });
});

// Inserción de registros en MySQL opcion 2 :::::::::::::::::::::::::::::::::::::
app.post('/insertar2', (req, res) => {
  if (!req.session.user){
      return res.status(401).json({ error: 'No estás autenticado' });
  }

  const { capitulo, seccion, maximo, score, porcentaje, respuesta } = req.body;
  const usuario = req.session.user.username; // Obtener el usuario de la sesión
  const CUIT = req.session.user.CUIT;

  if (!usuario) {
      return res.status(400).json({ error: 'Usuario no definido en la sesión' });
  }

  const respuestaJSON = JSON.stringify(respuesta);// Convertir el array de respuesta a un string JSON   
  const nuevoResultado = 'INSERT INTO respuestas (CUIT, usuario, capitulo, seccion, maximo, score, porcentaje, respuesta) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const datosAPasar = [CUIT, usuario, capitulo, seccion, maximo, score, porcentaje, respuestaJSON];

  conexion.query(nuevoResultado, datosAPasar, function (error, lista) {
      if (error) {
          if (error.code === 'ER_DUP_ENTRY') {
              res.status(409).json({ error: 'Ya existe una respuesta para esta combinación de capitulo y seccion' });
          } else {
          console.log('Error:', error);
          res.status(500).json({ error: error.message });
      }
      } else {
          // console.log(lista.insertId, lista.fieldCount);
          res.status(200).json({ success: true });
      }
  });
});

// Grabacion de Parciales  ::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.post('/grabaParciales', (req, res) => {
  if (!req.session.user){
      return res.status(401).json({ error: 'No estás autenticado' });
  }
  const { capitulo, seccion, numero, pregunta, respuesta, parcial} = req.body;
  const usuario = req.session.user.username; // Obtener el usuario de la sesión
  const CUIT = req.session.user.CUIT;

  if (!usuario) {
      return res.status(400).json({ error: 'Usuario no definido en la sesión' });
  }

  const respuestaJSON = JSON.stringify(respuesta);   // Convertir el array de respuesta a un string JSON  
  const nuevoParcial = 'INSERT INTO parciales (CUIT, usuario, capitulo, seccion, numero, pregunta, respuesta, parcial) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const datosAPasar = [CUIT, usuario, capitulo, seccion, numero, pregunta, respuestaJSON, parcial];

  conexion.query(nuevoParcial, datosAPasar, function (error, lista) {
      if (error) {
          if (error.code === 'ER_DUP_ENTRY') {
              res.status(409).json({ error: 'Ya existe una respuesta para esta combinación de capitulo y seccion' });
          } else {
          console.log('Error:', error);
          res.status(500).json({ error: error.message });
      }
      } else {
          res.status(200).json({ success: true });
      }
  });
});

// Ruta para generar y descargar el archivo Excel
app.get('/descargar-excel', async (req, res) => {
  try {

    // Acceder al usuario de la sesión
    const usuario = req.session.user?.username;

    if (!usuario) {
      res.status(401).send('Usuario no autenticado');
      return;
    }

    // Consulta a la base de datos
    const query = 'SELECT * FROM parciales WHERE usuario = ?';
    conexion.query(query, [usuario], async (error, results, fields) => {
      if (error) {
        console.error('Error al consultar la base de datos:', error);
        res.status(500).send('Error al consultar la base de datos');
        return;
      }

      // Crear un nuevo libro de trabajo
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Respuestas');

      results = results.map(row => ({
        ...row,
        score: parseFloat(row.score),
        porcentaje: parseFloat(row.porcentaje)
      }));      

      // Configurar las columnas (esto debería coincidir con la estructura de tu tabla)
      worksheet.columns = [
        { header: 'CUIT', key: 'CUIT', width: 20 },
        { header: 'Usuario', key: 'usuario', width: 25 },
        { header: 'Cap', key: 'capitulo', width: 5 },
        { header: 'Sec', key: 'seccion', width: 5 },
        { header: 'Nro', key: 'numero', width: 5 },
        { header: 'Afirmación', key: 'pregunta', width: 40 },
        { header: 'Respta', key: 'respuesta', width: 8 }, // Configura el formato como número
        { header: 'Score', key: 'parcial', width: 8, style: { numFmt: '0.0' }},
      ];

      worksheet.addRow([]); // Añade una fila vacía para separar el título

      // Añadir filas
      worksheet.addRows(results);

      // Configurar los encabezados de respuesta para la descarga
      res.setHeader('Content-Disposition', 'attachment; filename=Respuestas.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

      // Enviar el archivo Excel
      await workbook.xlsx.write(res);
      res.end();
    });
  } catch (error) {
    console.error('Error al generar el archivo Excel:', error);
    res.status(500).send('Error al generar el archivo Excel');
  }
});


// Captura todas las otras rutas para mostrar un 404 :::::::::::::::::::::::::::::::::
app.get('*', (req, res) => {
  res.status(404).send('Page Not Found');
});


// Use PORT provided in environment or default to 3000
const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => console.log(`Server is listening on port ${port}`));

