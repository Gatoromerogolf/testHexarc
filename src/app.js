// node-mysql-app/app.js

const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const mysql = require('mysql2');
const { pool } = require("./db");
const path = require('path');
const session = require('express-session');
const MySQLStore = require ('express-mysql-session')(session);
const ExcelJS = require('exceljs')
const cron = require('node-cron');

require('dotenv').config();  // 
// console.log('Variables de entorno cargadas:', process.env);

const nodemailer = require('nodemailer');
const { google } = require("googleapis");

const OAuth2 = google.auth.OAuth2;

// const accountTransport = require("../account_transport.json");

console.log('CLIENT_ID:', process.env.CLIENT_ID);
console.log('CLIENT_SECRET:', process.env.CLIENT_SECRET);
console.log('REFRESH_TOKEN:', process.env.REFRESH_TOKEN);
console.log('REDIRECT_URI:', process.env.REDIRECT_URI);


// Configura los detalles de OAuth2 usando variables de entorno
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

// const oAuth2Client = new google.auth.OAuth2(
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET,
//   process.env.REDIRECT_URI
// );

// envio de gmail con oauth
//  https://www.youtube.com/watch?v=W3jGtgva46w
//

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,       // Usa la constante
  CLIENT_SECRET,   // Usa la constante
  REDIRECT_URI     // Usa la constante
);

// Configuración del token de actualización
oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});


async function sendMail(to, subject, text) {
  console.log('Configuración del correo agregado:');
  console.log('CLIENT_ID:', process.env.CLIENT_ID);
  console.log('CLIENT_SECRET:', process.env.CLIENT_SECRET);
  console.log('REFRESH_TOKEN:', process.env.REFRESH_TOKEN);
  try {
      const accessToken = await oAuth2Client.getAccessToken();

      // Configurar el transporte con OAuth2
      const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: "hexarci.dev@gmail.com",
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken.token,
          },
      });

      // Configurar el correo
      const mailOptions = {
          from: "hexarci.dev@gmail.com",
          to: "ruben.e.garcia@gmail.com",              // Destinatario
          subject: subject,    // Asunto del correo
          text: text,          // Cuerpo del mensaje
      };

      // Enviar el correo
      const result = await transporter.sendMail(mailOptions);
      // console.log('Correo enviado:', result);
      console.log('Correo enviado en este momento:');
  } catch (error) {
      console.error('Error al enviar el correo:', error);
  }
}

// Ejemplo de envío
// Llama a esta función donde necesites en tu aplicación

// sendMail('ruben.e.garcia@gmail.com', 'Asunto de prueba', 'Mensaje de prueba.');


const app = express();

// Middleware para parsear el cuerpo de las solicitudes::::::::::::::::::::
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para servir archivos estáticos::::::::::::::::::::::::::::::
// app.use(express.static(path.join(__dirname, '../public')));

app.use(express.static(path.join(__dirname, '../public'), { index: 'index.html' }));

// Motor de plantillas
app.set('view engine', 'ejs');


// ejemplo para que levant4 algo con plantilla

app.get('/ejs', (req, res) => {
  res.render ('indexejs', {msg: 'Nombre del usuario'});
})

// invoca bcryptjs
const bcryptjs = require('bcryptjs')


// Endpoint para validar credenciales :::::::::::::::::::::::::::::::::::::::::::::::::::
app.use(cookieParser()); // Configura el middleware para leer cookies

const options = {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB
};


app.post('/enviar-correo', (req, res) => {
  const { email, subject, message } = req.body;

  // Llamada a la función para enviar el correo
  sendMail(email, subject, message)
      .then(() => {
          res.send('Correo enviado correctamente');
      })
      .catch((error) => {
          res.status(500).send('Error al enviar el correo');
      });
});

const sessionStore = new MySQLStore(options);

app.use(session({
    secret: process.env.SESSION_SECRET, // Cambia esto por un secreto más seguro en producción
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Cambia esto a true si usas HTTPS
}));


app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  pool.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
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
            CUIT: user.CUIT, // Guarda el usuario como un objeto en la sesión
            idioma: user.idioma,
            ria: user.ria,
            servicio: user.servicio};
          res.status(200).json({ 
            message: 'Login exitoso',
            user: {
              id: user.id,
              username: user.username,
              firstName: user.Nombre,
              lastName: user.Apellido,
              empresa: user.Empresa,
              CUIT: user.CUIT,
              ingresado: user.ingresado,
              idioma: user.idioma,
              ria: user.ria,
              servicio: user.servicio
            }
          }); 
            // Llama a esta función donde necesites en tu aplicación
          console.log ('llama a sendmail')  
          sendMail('ruben.e.garcia@gmail.com', 'Ingreso de usuario', `Ha ingresado recien ${username}`);
          updateLoginTimestamp(user.id);
      } else {
          res.status(401).send('Credenciales inválidas');
      }
  });


//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Definir la tarea cron
// cron.schedule('0 */4 * * *', () => { cada cuatro horas
cron.schedule('0 15 * * *', () => { // a las 15 hs
  // console.log('Ejecutando tarea programada: registrando en la base de datos');

  const query = 'INSERT INTO tablalogs (logs) VALUES (NOW())';

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error al insertar en la base de datos:', err);
      return;
    }
    console.log('Registro insertado correctamente:', results);
  });

    // Ejemplo de envío
  // Llama a esta función donde necesites en tu aplicación
  sendMail('ruben.e.garcia@gmail.com', 'Mail por cron', 'Mensaje de prueba.');
});


//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  function updateLoginTimestamp(id) {  // Función para actualizar el timestamp en el login
    const query = 'UPDATE users SET visita = NOW() WHERE id = ?';
    pool.query(query, [id], (error, results) => {
      if (error) {
        console.error('Error al actualizar el timestamp:', error);
      }
      //  else {
      //   console.log('Timestamp actualizado correctamente para el usuario ID:', id);
      // }
    });
  }


});

// Ruta para actualizar el campo "ingresado" del usuario:::::::::::::::::::::::::::::::
app.post('/api/updateIngresado', (req, res) => {
  const { username, CUIT } = req.body;
  const query = 'UPDATE users SET ingresado = 1 WHERE username = ? AND CUIT = ?';

  pool.query(query, [username, CUIT], (error, results) => {
    if (error) {
      console.error('Error al actualizar el campo ingresado:', error);
      res.status(500).json({ error: 'Error al actualizar el campo ingresado' });
      return;
    }
    res.json({ message: 'Campo ingresado actualizado correctamente' });
  });
});

// Ruta para actualizar el campo "idioma" del usuario:::::::::::::::::::::::::::::::
app.post('/api/updateIdioma', (req, res) => {
  const { username, CUIT, idioma } = req.body;

  // Asegúrarse de validar los datos entrantes antes de usarlos
  if (!username || !CUIT || !idioma) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const query = `UPDATE users SET idioma = ?  WHERE username = ? AND CUIT = ?`;

  pool.query(query, [idioma, username, CUIT], (error, results) => {
    if (error) {
      console.error('Error al actualizar el campo ingresado:', error);
      res.status(500).json({ error: 'Error al actualizar el campo idioma' });
      return;
    }
    res.json({ message: 'Campo idioma actualizado correctamente' });
  });
});


app.post('/updateDatosUsuario', (req, res) => {
  const { fullName, organization, cuit, email, ria, newPassword, username } = req.body;

  const query = 'UPDATE users SET fullName = ?, organization = ?, cuit = ?, email = ?, ria = ?, password = ?, username = ? WHERE userId = ?';
  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  // pool.query(query, [fullName, organization, cuit, email, ria, hashedPassword, username, userId], (err, result) => {
  //     if (err) throw err;

  //     res.json({ success: true });
  // });
});


app.post('/api/updateDatosInvitado', (req, res) => {
  const { CUIT, Nombre, Apellido, password, email } = req.body;

  if (!CUIT || !Nombre || !Apellido || !password || !email) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const query = 'UPDATE users SET Nombre = ?, Apellido = ?, password = ?, email = ? WHERE CUIT = ?';

  pool.query(query, [Nombre, Apellido, password, email, CUIT], (err, result) => {
      if (err) {
        console.error('Error al actualizar el usuario:', err);
        return res.status(500).json({ error: 'Error en el servidor' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'No se encontró el usuario con ese CUIT' });
      }

      res.json({ message: 'Campos actualizados correctamente' });
  });
});



// Creacion de Empresa  ::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.post('/api/creaEmpresa', (req, res) => {
  if (!req.session.user) {
      return res.status(401).json({ error: 'No estás autenticado' });
  }

  const { CUIT, actividad, calDirector, calDirectorio, advisory, finanEmpeorado, finanTasas, finanPercep, resultados, resultadosExtra, subsidiarias, estrGerencial, formaRemota, cambioProcesos, tercerizaciones } = req.body;

  // Verificar que no haya valores faltantes
  if (!CUIT || !actividad || !calDirector || !calDirectorio || !advisory || !finanEmpeorado || !finanTasas || !finanPercep || !resultados || !resultadosExtra || !subsidiarias || !estrGerencial || !formaRemota || !cambioProcesos || !tercerizaciones) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const query = `
      INSERT INTO empresas (CUIT, actividad, calDirector, calDirectorio, advisory, finanEmpeorado, finanTasas, finanPercep, resultados, resultadosExtra, subsidiarias, estrGerencial, formaRemota, cambioProcesos, tercerizaciones)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [CUIT, actividad, calDirector, calDirectorio, advisory, finanEmpeorado, finanTasas, finanPercep, resultados, resultadosExtra, subsidiarias, estrGerencial, formaRemota, cambioProcesos, tercerizaciones];

  pool.query(query, values, (err, result) => {
      if (err) {
          console.error('Error al insertar en la base de datos:', err);
          return res.status(500).json({ error: 'Error en el servidor' });
      }

      res.json({ message: 'Empresa creada correctamente', id: result.insertId });
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
  const seccion = req.query.indice ? parseInt(req.query.indice) : null; // Null si no se pasa seccion
  const idioma = parseInt(req.query.idioma) || 1; // Leer el valor de 'idioma' desde la URL, por defecto 1

 let query; 
 let params;

 if (idioma === 1) {
    query = 'SELECT * FROM capitulos';
  } else {
    query = 'SELECT * FROM capitulos_en';
  };

  // Si se especifica la sección, añadimos el filtro a la consulta
  if (seccion !== null) {
    query += ' WHERE seccion = ?';
    params = [idioma, seccion];
  } else {
    params = [idioma]; // Sin filtro de sección o letra
  }

  pool.query(query, params, (error, results, fields) => {
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
  const capitulo = req.query.capitulo ? parseInt(req.query.capitulo) : null; // Null si no se pasa seccion

  let params;

  let query = 'SELECT * FROM totalcapitulos WHERE CUIT = ?';

  // Si se especifica el capitulo, añadimos el filtro a la consulta
  if (capitulo !== null) {
    query += ' AND capitulo = ?';
    params = [CUIT, capitulo];
  } else {
    params = [CUIT]; // Sin filtro de sección
  }

  pool.query(query, params, (error, results, fields) => {
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

  pool.query(nuevoTotal, datosAPasar, function (error, lista) {
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

  pool.query(query, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener los registros' });
      return;
    }
    res.json(results);
  });
});

// Ruta para obtener todos los registros de la tabla secciones ::::::::::::::::::::
app.get('/secciones', (req, res) => {
  const capitulo = req.query.capitulo || 'A';
  const seccion = req.query.indice ? parseInt(req.query.indice) : null; // Null si no se pasa seccion
  const idioma = parseInt(req.query.idioma) || 2;

  let query;
  let params;

  //seleccion de tabla en base al idioma

  if (idioma === 1){
    query = 'SELECT * FROM secciones WHERE capitulo = ?'}
  else{
    query = 'SELECT * FROM secciones_en WHERE capitulo = ?'
  };

  // Si se especifica la sección, añadimos el filtro a la consulta
  if (seccion !== null) {
    query += ' AND seccion = ?';
    params = [capitulo, seccion];
  } else {
    params = [capitulo]; // Sin filtro de sección
  }

  // Realización de la consulta
  pool.query(query, params, (error, results, fields) => {
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


// Ruta para obtener todos los registros de la tabla secciones ::::::::::::::::::::
app.get('/seccionesTodas', (req, res) => {
  const capitulo = req.query.capitulo || 'A';
  const idioma = parseInt(req.query.idioma) || 2;


  let query;

  if (idioma === 1){
    query = 'SELECT * FROM secciones WHERE capitulo = ?'}
  else{
    query = 'SELECT * FROM secciones_en WHERE capitulo = ?'
  };

  pool.query(query, [capitulo], (error, results, fields) => {
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

  pool.query(query, values, (error, results, fields) => {
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

  // console.log(`CUIT recibido: ${CUIT}, Capítulo recibido: ${capitulo}`);

  if (!CUIT || !capitulo) {
      res.status(400).json({ error: 'Faltan parámetros requeridos' });
      console.log (`valores CUIT ${CUIT}, capitulo ${capitulo}`)
      console.log (`salio en error por aca`)
      return;
    }
  const query = 'SELECT * FROM respuestas WHERE cuit = ? AND capitulo = ?';
  const values = [CUIT, capitulo];

  pool.query(query, values, (error, results, fields) => {
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

// Ruta para buscar respuestas por cuit y capitulo.:::::::::::::::::::
app.get('/busca-respuesta-capitulo-ordenado', (req, res) => {
  const { CUIT, capitulo, orderField = 'porcentaje' } = req.query;

  if (!CUIT || !capitulo || !orderField) {
      res.status(400).json({ error: 'Faltan parámetros requeridos' });
      console.log (`valores CUIT ${CUIT}, capitulo ${capitulo}`)
      console.log (`salio en error por aca`)
      return;
    }

  // Lista de campos permitidos para el ordenamiento
  const validFields = ['porcentaje', 'maximo', 'score'];

    // Validar que el campo de ordenamiento sea válido
  if (!validFields.includes(orderField)) {
    return res.status(400).send('Campo de ordenamiento inválido');
  }

  const query = `SELECT * FROM respuestas WHERE cuit = ? AND capitulo = ? ORDER BY ${orderField} ASC`;
  const values = [CUIT, capitulo];

  pool.query(query, values, (error, results, fields) => {
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

// Definir la ruta DELETE para eliminar un registro
app.delete('/eliminarRepuesta', (req, res) => {
  const { CUIT, capitulo, seccion } = req.body; // Se reciben los datos desde el cuerpo de la solicitud

  if (!CUIT || !capitulo || !seccion) {
    return res.status(400).send('Faltan parámetros');
  }

  const query = `DELETE FROM respuestas WHERE CUIT = ? AND capitulo = ? AND seccion = ?`;

  // Ejecutar la consulta en MySQL
  connection.execute(query, [CUIT, capitulo, seccion], (error, results) => {
    if (error) {
      console.error('Error al eliminar el registro:', error);
      return res.status(500).send('Error en la base de datos');
    }
    if (results.affectedRows > 0) {
      res.send('Registro eliminado exitosamente');
    } else {
      res.status(404).send('Registro no encontrado');
    }
  });
});


// Ruta para obtener todos las respuestas de la tabla textorespuestas::::::::::::::::::::
app.get('/textorespuestas', (req, res) => {
  const query = 'SELECT * FROM textorespuestas';

  pool.query(query, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener los registros' });
      return;
    }
    // console.log('Resultados de textorespuestas:', results);
    res.json(results);
  });
});

// Ruta para obtener todos las respuestas de la tabla textocheck::::::::::::::::::::
app.get('/textocheck', (req, res) => {
  const query = 'SELECT * FROM textocheck';

  pool.query(query, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener los registros' });
      return;
    }
    res.json(results);
  });
});


// Ruta para obtener preguntas, con un filtro opcional por capitulo
app.get('/preguntas', (req, res) => {
  const { capitulo, seccion } = req.query;  // Obtener el parámetro capitulo de la query string
  let query = 'SELECT * FROM preguntas';
  let params = [];

  // console.log ('llego hasta aca');

    // Construir la consulta con filtros opcionales
    if (capitulo || seccion) {
      query += ' WHERE';

      if (capitulo) {
          query += ' Capitulo = ?';
          params.push(capitulo);
      }

      if (seccion) {
          if (capitulo) {
              query += ' AND';
          }
          query += ' Seccion = ?';
          params.push(seccion);
      }
  }

  query += ' ORDER BY Capitulo, Seccion, Numero';

  pool.query(query, params, (error, results, fields) => {
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
  pool.query(query, (error, results, fields) => {
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

  pool.query(nuevoResultado, datosAPasar, function (error, lista) {
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

  pool.query(nuevoParcial, datosAPasar, function (error, lista) {
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
    pool.query(query, [usuario], async (error, results, fields) => {
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


// Inserción de registros en Experiencia :::::::::::::::::::::::::::::::::::::
app.post('/insertarExperiencia', (req, res) => {
  if (!req.session.user){
      return res.status(401).json({ error: 'No estás autenticado' });
  }

  const { minutos, salida, uno, dos, tres, cuatro, cinco, seis, siete, comentarios } = req.body;
  const usuario = req.session.user.username; // Obtener el usuario de la sesión
  // const CUIT = req.session.user.CUIT;

  if (!usuario) {
      return res.status(400).json({ error: 'Usuario no definido en la sesión' });
  }

  // const respuestaJSON = JSON.stringify(respuesta);// Convertir el array de respuesta a un string JSON   
  const nuevoResultado = 'INSERT INTO experiencia (usuario, minutos, salida, uno, dos, tres, cuatro, cinco, seis, siete, comentarios) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const datosAPasar = [usuario, minutos, salida, uno, dos, tres, cuatro, cinco, seis, siete, comentarios];

  pool.query(nuevoResultado, datosAPasar, function (error, lista) {
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


  // Ruta para obtener los registros de DATOS NETOS ::::::::::::::::::::
  app.get('/leerDatosNetos', (req, res) => {
    const query = 'SELECT * FROM netos';
  
    pool.query(query, (error, results, fields) => {
        if (error) {
          res.status(500).json({ error: 'Error al obtener los DatosFecha' });
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


// Ruta para obtener los registros de la tabla FECHAS::::::::::::::::::::
app.get('/leerDatosFechas', (req, res) => {
  const query = 'SELECT * FROM fechas';

  pool.query(query, (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: 'Error al obtener los DatosFecha' });
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


// Captura todas las otras rutas para mostrar un 404 :::::::::::::::::::::::::::::::::
app.get('*', (req, res) => {
  res.status(404).send('Page Not Found');
});


// Use PORT provided in environment or default to 3000
const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => console.log(`Server is listening on port ${port}`));

