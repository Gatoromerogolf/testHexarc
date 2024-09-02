
// lee datosNetos y arma una matriz con el mismo formato que datosFedex
// le agrega al final los datos de las giras y  la ryder
// cambia la lectura de datosFedex por la matriz
const CUIT = localStorage.getItem("CUIT");
const capitulo = "A";
let totalMax = 0;
let totalCal = 0;
const matrizFedex = [];
let matrizPreguntas = [];
const idioma = Number(localStorage.getItem('idioma'));
let respuestas = [];
let tablaMenuA = [];
let secciones = [];

async function main() {
  players2 = await leerDatosNetos();
  fechas = await leerDatosFechas();
  matrizPreguntas = await recuperarPreguntas();
  // console.log('preguntas en main')
  // console.table(matrizPreguntas)
  const resultadoBusqueda = await buscaRespuesta(CUIT, capitulo);
  respuestas = resultadoBusqueda.respuestas; // Extrae el array de respuestas
  // console.log('respuestas en main')
  // console.table(respuestas);
  await procesarCategoria({ min: 0, max: 50 }, "questionsTableBody");

  secciones = await obtenerTodasLasSecciones(capitulo, idioma)
  // console.log('secciones en main')
  // console.table(secciones);
}

main().then (() => {
  
    console.log('respuestas en then')
    console.log(respuestas)
    // Ejecuta la función principal

    // const matrizFedex = [];
    let j = 0;

    // for (const player of players2) {
    //   if (player.pos !== 0) {

    //     if (!matrizFedex[j]) { // Asegurarse de que matrizFedex[j] está inicializado como un arreglo
    //       matrizFedex[j] = []; // Inicializar matrizFedex[j] como un arreglo vacío
    //     }
    //     matrizFedex[j][0] = player.play;
    //     matrizFedex[j][3] = player.fec;

    //     switch (player.pos) {
    //       case 1:
    //         matrizFedex[j][1] = 6;
    //         matrizFedex[j][2] = 1;
    //         break;
    //       case 2:
    //         matrizFedex[j][1] = 4;
    //         matrizFedex[j][2] = 2;
    //         break;
    //       case 3:
    //         matrizFedex[j][1] = 2;
    //         matrizFedex[j][2] = 3;
    //         break;
    //       default:
    //         break;
    //     }
    //     j++;
    //   }
    // }

    if (!matrizFedex[j]) {
      matrizFedex[j] = [];
    }
    // agrega los puntos de Sierras
    // matrizFedex[j][0] = 'Negro';
    // matrizFedex[j][1] = 20;
    // matrizFedex[j][2] = "1°";
    // matrizFedex[j][3] = 90;

    // j++;
    // if (!matrizFedex[j]) {
    //   matrizFedex[j] = [];
    // }
    // matrizFedex[j][0] = 'Edu';
    // matrizFedex[j][1] = 15;
    // matrizFedex[j][2] = "2°";
    // matrizFedex[j][3] = 90;

    // j++;
    // if (!matrizFedex[j]) {
    //   matrizFedex[j] = [];
    // }
    // matrizFedex[j][0] = 'Juancho';
    // matrizFedex[j][1] = 10;
    // matrizFedex[j][2] = "3°";
    // matrizFedex[j][3] = 90;

    // j++;
    // if (!matrizFedex[j]) {
    //   matrizFedex[j] = [];
    // }
    // matrizFedex[j][0] = 'Diegui';
    // matrizFedex[j][1] = 8;
    // matrizFedex[j][2] = "4°";
    // matrizFedex[j][3] = 90;

    // j++;
    // if (!matrizFedex[j]) {
    //   matrizFedex[j] = [];
    // }
    // matrizFedex[j][0] = 'Torni';
    // matrizFedex[j][1] = 5;
    // matrizFedex[j][2] = "5°";
    // matrizFedex[j][3] = 90;

    // j++;
    // if (!matrizFedex[j]) {
    //   matrizFedex[j] = [];
    // }
    // matrizFedex[j][0] = 'Fer';
    // matrizFedex[j][1] = 2;
    // matrizFedex[j][2] = "6°";
    // matrizFedex[j][3] = 90;

    // j++;
    // if (!matrizFedex[j]) {
    //   matrizFedex[j] = [];
    // }

    //  agrega los puntos de Ryder
    // matrizFedex[j][0] = 'Sensei';
    // matrizFedex[j][1] = 10;
    // matrizFedex[j][2] = "1°";
    // matrizFedex[j][3] = 91;

    // j++;
    // if (!matrizFedex[j]) {
    //   matrizFedex[j] = [];
    // }
    // matrizFedex[j][0] = 'Negro';
    // matrizFedex[j][1] = 10;
    // matrizFedex[j][2] = "1°";
    // matrizFedex[j][3] = 91;

    // j++;
    // if (!matrizFedex[j]) {
    //   matrizFedex[j] = [];
    // }
    // matrizFedex[j][0] = 'Edu';
    // matrizFedex[j][1] = 10;
    // matrizFedex[j][2] = "1°";
    // matrizFedex[j][3] = 91;

    // j++;
    // if (!matrizFedex[j]) {
    //   matrizFedex[j] = [];
    // }
    // matrizFedex[j][0] = 'Gaby';
    // matrizFedex[j][1] = 10;
    // matrizFedex[j][2] = "1°";
    // matrizFedex[j][3] = 91;

    j++;
    if (!matrizFedex[j]) {
      matrizFedex[j] = [];
    }
    matrizFedex[j][0] = 'Torni';
    matrizFedex[j][1] = 10;
    matrizFedex[j][2] = "1°";
    matrizFedex[j][3] = 91;

    j++;
    if (!matrizFedex[j]) {
      matrizFedex[j] = [];
    }
    matrizFedex[j][0] = 'Juancho';
    matrizFedex[j][1] = 10;
    matrizFedex[j][2] = "1°";
    matrizFedex[j][3] = 91;

    const matrizFx = [];

    // arma la otra matriz, agrupando por jugador.

    for (j = 0; j < matrizFedex.length; j++) {
      const nombreJugador = matrizFedex[j][0];
      let i = matrizFx.findIndex(([jugador]) => jugador === nombreJugador);
      if (i === -1) {
        matrizFx.push([nombreJugador, matrizFedex[j][1]]);
      } else {
        matrizFx[i][1] += matrizFedex[j][1];
      }
    }

      // agregarNombreSeccion(indice, idioma, capitulo)

    //  ORDENA DESCENDENTE  b - a
    matrizFx.sort((a, b) => b[1] - a[1]);

    console.log('respuestas en rutina de armado')  
    console.log(respuestas);
    tablaMenuA = respuestas.filter(respuesta => 
      respuesta.porcentaje > 0 && respuesta.porcentaje <= 50);

    console.table (tablaMenuA);

    let lineaDatosFd = document.getElementById("lineaScore");

    for (let i = 0; i < tablaMenuA.length; i++) {
      let respuesta = tablaMenuA[i];
      lineaDatosFd = rankingFedex.insertRow();

      const capitulo = "A";
      const indice = respuesta.seccion;
      const descripcion = obtenerNombreSeccion(indice, idioma, capitulo);

      const celdaNombre = lineaDatosFd.insertCell(-1);
      celdaNombre.textContent = respuesta.seccion + '. ' + descripcion;
      celdaNombre.style.width = '300px';
      celdaNombre.textContent = descripcion;
      
      const celdaMaximo = lineaDatosFd.insertCell(-1);
      celdaMaximo.classList.add("centered");
      celdaMaximo.style.width = '45px';
      totalMax += Number(respuesta.maximo);
      celdaMaximo.textContent = respuesta.maximo;;

      const celdaPuntos = lineaDatosFd.insertCell(-1);
      celdaPuntos.classList.add("centered");
      celdaPuntos.style.width = '45px';
      totalCal += Number(respuesta.score);
      celdaPuntos.textContent = respuesta.score;

      const celdaPorciento = lineaDatosFd.insertCell(-1);
      celdaPorciento.classList.add("centered");
      celdaPorciento.style.width = '45px';
      celdaPorciento.textContent = respuesta.porcentaje;

    // for (i = 0; i < matrizFx.length; i++) {
    //   lineaDatosFd = rankingFedex.insertRow();
    //   const celdaNombre = lineaDatosFd.insertCell(-1);
    //   celdaNombre.textContent = matrizFx[i][0];

    //   const celdaNumero = lineaDatosFd.insertCell(-1);
    //   celdaNumero.textContent = matrizFx[i][1];

      /* Para crear un nuevo elemento `<td>` con un botón dentro, utilizar el método `document.createElement()`. Luego, establecer los atributos `class` y `data-info`. 
    
    // Crea un nuevo elemento <td> para el botón*/
      const celdaBoton = document.createElement("td");

      // Crea un botón con la clase "pepe" y el atributo data-info
      const boton = document.createElement("button");
      boton.className = "pepe";
      // let nombreBoton = tablaMenuA[i][0];
      boton.setAttribute("data-info", respuesta.seccion);
      boton.textContent = "Ver detalles";

      // Agrega el botón al elemento <td>
      celdaBoton.appendChild(boton);

      // Agrega la celda con el botón a la fila
      lineaDatosFd.appendChild(celdaBoton);
    }

    /* 
    En este ejemplo:
    - Creamos un nuevo elemento `<td>` llamado `celdaBoton`.
    - Creamos un botón dentro de `celdaBoton` con la clase `"pepe"` y el atributo `data-info` establecido en `"Negro"`.
    - Finalmente, agregamos `celdaBoton` a la fila (`lineaDatos`) de la tabla.
    */

    // Selecciona todos los elementos con la clase 'pepe'
    const botones = document.querySelectorAll(".pepe");

    // Al seleccionar un botón, segun la data-info, borra las filas de una matriz anterior, arma la matriz a presentar (armar detalle general) y "muestra" la pantalla oculta
    botones.forEach((boton) => {
      boton.addEventListener("click", (event) => {
        const info = event.target.getAttribute("data-info");
        armarDetalleGeneral(info);
        const modal = document.getElementById("modalGeneral");
        if (modal) {
          modal.style.display = "block";
        }
      });
    });
});


// ---armarDetalleGeneral :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function armarDetalleGeneral(info) {
  let lineaModalGeneral = document.getElementById("lineaModalGeneral");
  eliminarFilas();


  // for (const jugador of puntosFedex) {
  for (i=0;  i < info; i++) {
    lineaModalGeneral = tablaModalGeneral.insertRow();
  //   const nombreJugador = matrizFedex[i][0];

  //   console.log(nombreJugador + " " + info)

  //   if (nombreJugador === info) {
      const titModGral = document.getElementById("tituloModalGeneral");
      const titPtosGral = document.getElementById("tituloPuntosGeneral");
      titModGral.textContent = info;

      const celdaPuntos = lineaModalGeneral.insertCell(-1);
      // celdaPuntos.textContent = jugador.puntosFd;
      celdaPuntos.textContent = info;

      const celdaPosicion = lineaModalGeneral.insertCell(-1);
      // celdaPosicion.textContent = jugador.posFd;
      celdaPosicion.textContent =  info * 2;

  //     const celdaFecha = lineaModalGeneral.insertCell(-1);
  //     // celdaFecha.textContent = jugador.fechaFd;
  //     celdaFecha.textContent = matrizFedex[i][3];

  //     for (const fechaFx of fechas) {
  //       // if (jugador.fechaFd === fechaFx.fec) {
  //         if (matrizFedex[i][3] === fechaFx.fec) {
  //         celdaFecha.textContent = fechaFx.textoFecha;
  //       }
  //     }
  //   }
  // }
}}

// --- eliminar Filas :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function eliminarFilas() {
  const filasEliminar = tablaModalGeneral.getElementsByTagName("tr");
  for (let i = filasEliminar.length - 1; i > 0; i--) {
    tablaModalGeneral.deleteRow(i);
  }
}


// --- cerrarModal ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function cerrarModal(idModal) {
  const modal = document.getElementById(idModal);
  if (modal) {
    modal.style.display = "none";
  }
}


async function leerDatosNetos() {
  try {
    const response = await fetch(`/leerDatosNetos`);
    if (response.ok) {
      const players2 = await response.json();
      return players2; // Devuelve los datos obtenidos si la respuesta es exitosa
    } else {
      console.error(
        "Error en la respuesta:",
        response.status,
        response.statusText
      );
      return null;
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
    return null;
  }
}

async function leerDatosFechas() {
  try {
    const response = await fetch(`/leerDatosFechas`);
    if (response.ok) {
      const fechas = await response.json();
      return fechas; // Devuelve los datos obtenidos si la respuesta es exitosa
    } else {
      console.error(
        "Error en la respuesta:",
        response.status,
        response.statusText
      );
      return null;
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
    return null;
  }
}

async function recuperarPreguntas() {
  try {
    const response = await fetch("/preguntas");
    if (response.ok) {
      const result = await response.json();
      return Array.isArray(result) ? result : []; // Asegura devolver un arreglo
    } else {
      console.error("Error al obtener las preguntas:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
    return [];
  }
}

async function buscaRespuesta(CUIT, capitulo) {
  try {
    const response = await fetch(
      `/busca-respuesta-capitulo-ordenado?CUIT=${CUIT}&capitulo=${capitulo}`
    );
    if (!response.ok) {
      throw new Error('Respuesta no OK de buscaRespuesta');
    }

    const resultado = await response.json();
    console.log("Resultado de la respuesta:", resultado); // Debugging
    return { exists: resultado.exists, respuestas: resultado.records || []};
    
  } catch (error) {
    console.error("Error al realizar la solicitud en buscaRespuesta:", error);
    return { exists: false, respuestas: [] };
  }
}

async function procesarCategoria(rango, elementoID) {
  let tablaMenuA = respuestas.filter(respuesta => 
    respuesta.porcentaje > rango.min && respuesta.porcentaje <= rango.max
  );

  let lineaDatosFd = document.getElementById(elementoID);

  if (tablaMenuA.length > 0) {
    await llenaUnaParte(tablaMenuA, lineaDatosFd);
  } else {
    let fila = document.createElement('tr');
    let celdaNombre = document.createElement('td');
    celdaNombre.style.width = '500px';
    celdaNombre.textContent = '*** No hay elementos en esta categoría ***';
    celdaNombre.style.textAlign = 'center';
    fila.appendChild(celdaNombre);
    lineaDatosFd.appendChild(fila);
  }
}

async function llenaUnaParte(tablaMenuA, lineaDatosFd) {
  for (const respuesta of tablaMenuA) {
    let fila = document.createElement('tr');

    let celdaNombre = document.createElement('td');
    const capitulo = "A";
    const indice = respuesta.seccion;
    const descripcion = await obtenerNombreSeccion(indice, idioma, capitulo);
    // celdaNombre.textContent = descripcion; // Ajusta según tu estructura de datos
    celdaNombre.textContent = respuesta.seccion + '. ' + descripcion;
    celdaNombre.style.width = '300px';
    fila.appendChild(celdaNombre);
  
    let celdaMaximo = document.createElement('td');
    celdaMaximo.textContent = respuesta.maximo;
    celdaMaximo.classList.add("centered");
    celdaMaximo.style.width = '45px';
    totalMax += Number(respuesta.maximo);
    fila.appendChild(celdaMaximo);

    let celdaPuntos = document.createElement('td');
    celdaPuntos.textContent = respuesta.score;
    celdaPuntos.classList.add("centered");
    celdaPuntos.style.width = '45px';
    totalCal += Number(respuesta.score);
    fila.appendChild(celdaPuntos);

    let celdaPorciento = document.createElement('td');
    celdaPorciento.textContent = respuesta.porcentaje;
    celdaPorciento.classList.add("centered");
    celdaPorciento.style.width = '45px';
    fila.appendChild(celdaPorciento);

    let celdaBoton = document.createElement('td');
    const boton = document.createElement("button");
    boton.className = "pepe";
    let nombreBoton = respuesta.seccion;
    boton.setAttribute("data-info", nombreBoton);
    boton.textContent = "Ver";
    boton.style.width = '35px';
    boton.classList.add("centered");
    // celdaBoton.appendChild(boton);
    fila.appendChild(celdaBoton);

    const enlace = document.createElement('a');
    // Establece el texto y el enlace
    // enlace.textContent = respuesta.seccion + '. ' + descripcion;
    enlace.textContent = respuesta.seccion;
    enlace.href = '../index.html'; // Cambia esto por la URL a la que deseas enlazar
    enlace.target = '_blank'; // Abre el enlace en una nueva ventana o pestaña
    celdaBoton.appendChild(enlace);

    lineaDatosFd.appendChild(fila);
}
}

async function obtenerNombreSeccion(indice, idioma, capitulo) {
  try {    const response = await fetch(`/seccionesTodas?capitulo=${capitulo}&idioma=${idioma}&indice=${indice}`);
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.statusText}`);
    }
    const data = await response.json();
    if (data.length > 0) {
      return data[0].descripcion; 
    } else {
      return 'Descripción no disponible';
    }
  } catch (error) {
    console.error('Error al obtener la descripción:', error);
    return 'Descripción no disponible';
  }
}

async function obtenerTodasLasSecciones(capitulo, idioma) {
  try {    const response = await fetch(`/seccionesTodas?capitulo=${capitulo}&idioma=${idioma}`);
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.statusText}`);
    }
    const data = await response.json();
    if (data.length > 0) {
      return data[0].descripcion; 
    } else {
      return 'Descripción no disponible';
    }
  } catch (error) {
    console.error('Error al obtener la descripción:', error);
    return 'Descripción no disponible';
  }
}