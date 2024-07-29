
//importar librerias:::::::::::::::::::::::::::::::::::::::::::
const express = require('express');
const mysql = require('mysql2');

//objetos para llamar metodos de express::::::::::::::::::::::
const app = express();

//configuraciones :::::::::::::::::::::::::::::::::::::::::::::
// aca se indica que se utiliza un motor para ver las pantillas
app.set('view engine', 'ejs')
app.use(express.json()); // asi reconoce los objetos que vienen de las paginas
app.use(express.urlencoded({extended: false})); // para que no analice lo que recibe....

app.get('/', (req, res) => {
  res.render('Menu-General.ejs')
})

app.get('/carga', (req, res) => {
  res.render('carga');
})

app.post('/validar', (req, res) => {
  const datos = req.body;
  validacion(datos, (error, results) => {
    if (error) {
      console.error ('Error en la validación', error);
      res.status(500).send('Error en la validación');
    }else{
      console.log ('Resultados:', results);
      res.status(200).send('Validación completada con exito');      
    }
  });
})

//ruta de archivos estáticos - middleware :::::::::::::::::::::
app.use(express.static(__dirname + '/public'));


//conexion a la base de datos::::::::::::::::::::::::::::::::::
const conexion = mysql.createConnection({
  host: 'localhost',
  database: 'bolilla_negra',
  user: 'root',
  password: 'Flam822'
});

conexion.connect(function (err) {
  if (err) {
    throw err;
    console.log(`no se pudo conectar`)
  } else {
    console.log('conexion exitosa')
  }
})

//consulta a la base de datos::::::::::::::::::::::::::::::::::
const jugadores = 'SELECT * from players where id<10';
conexion.query(jugadores, function (error, lista) {
  if (error) {
    throw (error)
  }
  else {
    console.log(lista)
  }
})

//agregado de registro:::::::::::::::::::::::::::::::::::::::::
const nuevoPlayer =
  'INSERT INTO players (id, Alias, Nombre, Apellido, Matricula, Jefe) VALUES (NULL, "Fantasma", "NomFantasma", "ApeFantasma", 99999, "Mujer maravilla")';

conexion.query(nuevoPlayer, function (error, lista) {
  if (error) {
    throw (error)
  }
  else {
    console.log(lista.insertId, lista.fieldCount)
  }
})

//modificar registro:::::::::::::::::::::::::::::::::::::::::

const cambioPlayer =
  'UPDATE players SET Matricula = 905509 WHERE players.id = 13';


conexion.query(cambioPlayer, function (error, lista) {
  if (error) {
    throw (error)
  }
  else {
    console.log(lista.insertId, lista.fieldCount)
  }
})


//eliminar registro:::::::::::::::::::::::::::::::::::::::::

const borrarPlayer =
  'DELETE FROM players WHERE players.id > 13';

conexion.query(borrarPlayer, function (error, lista) {
  if (error) {
    throw (error)
  }
  else {
    console.log(lista.insertId, lista.fieldCount)
  }
})
//cierre de la conexion a la base :::::::::::::::::::::::::::::
// conexion.end(function (err) {
//   if (err) {
//     throw err;
//     console.log('no puedo cerrar la conexión')
//   } else {
//     console.log('conexión cerrada exitosamente')
//   }
// })

function validacion(datos, callback) {
  // define tabla de nombres:::::::::::::::::::::::::::
  const jugadores = [
    "Diegui", "Edu", "Fer", "Gaby", "Joaco", "Juancho",
    "Julito", "Negro", "Panza", "Presi", "Sensei", "Torni"
  ]
  const valorFecha = 17; // define el valor de la fecha ::::::::

  const posicion = new Array(12).fill(0);//  para guardar posicion :::::
  const pelotasGanadas = new Array(12).fill(0); // para guardar pelotas :::::
  const valores = new Array(12).fill(0); // para guardar los netos

  // define el neto en cada posición ::::::::::::::::::
  let fec = datos.fechator;
  valores[0] = datos.diegui;
  valores[1]= datos.edu;
  valores[2] = datos.fer;
  valores[3] = datos.gaby;
  valores[4] = datos.joaco;
  valores[5] = datos.juancho;
  valores[6] = datos.julito;
  valores[7] = datos.negro;
  valores[8] = datos.panza;
  valores[9] = datos.presi;
  valores[10] = datos.sensei;
  valores[11] = datos.torni;
  
  let primero = datos.jugador1;
  let primeroPel = datos.peloGana1;
  let segundo = datos.jugador2;
  let segundoPel = datos.peloGana2;
  let tercero = datos.jugador3;

  // buscar quien es primero, para encontrar indice para poner posición y pelotas ganadas
  //let Primero = datos.jugador1;
  //let PrimeroPel = datos.peloGana1;
  const posicionPrimero = jugadores.indexOf(primero);
  posicion[posicionPrimero] = 1;
  pelotasGanadas[posicionPrimero] = primeroPel;

  const posicionSegundo = jugadores.indexOf(segundo);
  posicion[posicionSegundo] = 2;
  pelotasGanadas[posicionSegundo] = segundoPel;

  const posicionTercero = jugadores.indexOf(tercero);
  posicion[posicionTercero] = 3;
  pelotasGanadas[posicionTercero] = 1;

  const promises = [];  

  for (let i=0; i<12; i++) {
    const neto = valores[i] || 0 // usa 0 si valores[i] es nulo o '';
    const pos = posicion[i] || 0 // igual al anterior
    const pg = pelotasGanadas[i] || 0 // igual 

    const nuevoScore =
    'INSERT INTO netos (id, fec, play, neto, pos, pg) VALUES (NULL, ?, ?, ?, ?, ?)';
    const values = [valorFecha, jugadores[i], neto, pos, pg];
      
    promises.push(new Promise((resolve, reject) =>{
      conexion.query(nuevoScore, values, (error, results, fields) => {
        if (error) {
          reject (error)
        }
        else {
          resolve(results);
      }
    });
  }));
}

  Promise.all(promises)
    .then(results => {
      callback(null, results);
      conexion.end();
    })
    .catch(error => {
      callback(error);
      conexion.end();
  }); 
}

//configuración del puerto ::::::::::::::::::::::::::::::::::::
const puerto = process.env.PORT || 3000;
app.listen(puerto, () => {
  console.log(`Escuchando en puerto ${puerto}`)
})