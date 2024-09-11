// let tablaMenuApeRie = [
//   ["I.",
//     "MB-1.html",
//     "Valores y Comportamientos",
//     ,
//     ,
//   ],
//   ["II.",
//     "MB-2.html",
//     "Procesos",
//     ,
//     ,
//   ],
//   ["III.",
//     "MB-3.html",
//     "Circunstancias históricas",
//     ,
//     ,
//   ],
//   ["IV.",
//     "MB-4.html",
//     "Circunstancias actuales",
//     ,
//     ,
//   ],
//    ["",
//     "##",
//     "Calificación general:",
//     ,
//     ,
//   ],
// ]

let tablaMenuApeRie = [];
const apellidouser = localStorage.getItem("apellido");
const nombreUser = localStorage.getItem("nombre");
const apenom = nombreUser + ' ' + apellidouser;
const empresa = localStorage.getItem("empresa");
const idioma = localStorage.getItem("idioma");
let primeraVez = 0;

document.getElementById("nombreEmpresa").textContent = empresa;
document.getElementById("nombreUsuario").textContent = apenom;


// Función para obtener los datos de la base de datos
async function obtenerSecciones(indice, idioma) {
  let linkPagina = "##";
  try {
    // Realizar la solicitud fetch
    const capitulo = "B";

    const response = await fetch(`/secciones?indice=${indice}&idioma=${idioma}&capitulo=${capitulo}`);

    if (response.ok) {indice=`${indice}`;
      // Obtener los datos en formato JSON
      const seccionRec = await response.json(); //registro seccion recibido
      if (seccionRec.length > 0) {
        const primerSeccion = seccionRec[0];
        console.log (primerSeccion)
        console.log (primerSeccion.max4)
        // leo la tabla de respuestas para saber si se completó
        const CUIT = localStorage.getItem("CUIT");
        const seccion = primerSeccion.seccion;

        const maximo = 99999;
          // direc34 === "1" ? primerSeccion.max3 : primerSeccion.max4;

        const respuesta = await buscaRespuesta(CUIT, capitulo, seccion);
        if (respuesta.exists) {
          // si lo encuentra, llena la tabla sin pasar el link
          // console.log(`Encontro registro ${seccion} en obtenerSecciones`);
          const registro = respuesta.record;

          const elemento = [
            `${primerSeccion.seccionromano}`,
            `##`,
            `${primerSeccion.descripcion}`,
            registro.maximo,
            registro.score,
            // (respuesta.score / primerSeccion.max4 * 100).toFixed(2)
            registro.porcentaje,
          ];
          // console.log(elemento);
          tablaMenuApeRie.push(elemento);
        } else {
          // console.log (`no hay respuesta para seccion ${seccion}`);
          const elemento = [
            `${primerSeccion.seccionromano}`,
            "##",
            `${primerSeccion.descripcion}`,
            null,
            null,
          ];
          if (primeraVez == 0) {
            elemento[1] = `${primerSeccion.pagina}`;
            primeraVez = 1;
          }
          tablaMenuApeRie.push(elemento);
          // return true; // marca para terminar el ciclo
        }
      }
    } else {
      console.error("Error al obtener los datos");
    }
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
  }
  return false;
}

(async function () {
  try {
    for (let indice = 1; indice < 5; indice++) {
      const shouldTerminate = await obtenerSecciones(indice, idioma);
      if (shouldTerminate) break;
    }
    // Una vez que se han obtenido todos los datos, actualizar el HTML
    // elemento = [null, `##`, "Calificación general:", null, null];
    // tablaMenuEs.push(elemento);
    actualizarHTML(tablaMenuApeRie);
    document.getElementById('tablaIndice').style.display = 'table';
    // document.getElementById('loading').style.display = 'none';
    
  } catch (error) {
    console.error("Error en la función autoinvocada:", error);
  }
})();


async function buscaRespuesta(CUIT, capitulo, seccion) {
  // console.log (`los 3 valores ${CUIT}, ${capitulo}, ${seccion}`)
  try {
    const response = await fetch(
      `/busca-respuesta?CUIT=${CUIT}&capitulo=${capitulo}&seccion=${seccion}`
    );
    if (response.ok) {
      const result = await response.json();
      if (result.exists) {
        // return { exists: true, score: result.score };
        return { exists: true, record: result.record };
      }
    } else {
      console.error(`Sin respuesta para seccion ${seccion} en buscaRespuesta`);
    }
  } catch (error) {
    console.error("Error al realizar la solicitud en buscaRespuesta:", error);
  }
  return { exists: false };
}


// Función para actualizar el HTML con los datos de la tabla
function actualizarHTML(tablaMenuEs) {
  // console.log(tablaMenuEs);

  tablaMenuA = tablaMenuEs;
  let totalMax = 0;
  let totalCal = 0;
  let totalPor = 0;

  // Define celdaMaximo, celdaPuntos, y celdaPorciento fuera del bucle
  let ultimaFila;
  let celdaMaximo, celdaPuntos, celdaPorciento;

  //  llena la matriz
  let lineaDatosFd = document.getElementById("lineaMenu");


  for (i = 0; i < tablaMenuApeRie.length; i++) {
    lineaDatosFd = tablaIndice.insertRow();

    let celdaNombre = lineaDatosFd.insertCell(-1);
    celdaNombre.textContent = tablaMenuA[i][0];

    const celdaEnlace = lineaDatosFd.insertCell(-1);
    const enlace = document.createElement("a"); // Crear un elemento <a>
    enlace.href = tablaMenuA[i][1]; // Establecer el atributo href con el valor correspondiente
    enlace.textContent = tablaMenuA[i][2]; // Establecer el texto del enlace con el tercer elemento de la tabla
    enlace.style.textDecoration = "none";  // Agregar el enlace como hijo de la celda
    celdaEnlace.appendChild(enlace);

    let celdaMaximo = lineaDatosFd.insertCell(-1);
    celdaMaximo.textContent = tablaMenuA[i][3] || "";
    celdaMaximo.classList.add("ajustado-derecha");
    totalMax += Number(tablaMenuA[i][3]);
    // console.log (`valores de i ${i} y total Max: ${totalMax}`)

    let celdaPuntos = lineaDatosFd.insertCell(-1);
    celdaPuntos.textContent = tablaMenuA[i][4] || "";
    celdaPuntos.classList.add("ajustado-derecha");
    // Convierte el valor a un número antes de sumarlo
    totalCal += Number(tablaMenuA[i][4]);

    let celdaPorciento = lineaDatosFd.insertCell(-1);
    celdaPorciento.textContent = tablaMenuA[i][5] || "";
    celdaPorciento.classList.add("ajustado-derecha");
    // totalPor = (Number(tablaMenuA[i][4]) / Number(tablaMenuA[i][3]) * 100).toFixed(2);
  }

  // Procesa linea final, si la linea 3 tuvo resultados.
  if (tablaMenuA[3][3] > 0) {
    document.getElementById("botonSiguiente").style.display = "block";

    lineaDatosFd = tablaIndice.insertRow();

    let celdaNombre = lineaDatosFd.insertCell(-1);
    celdaNombre.textContent =  "";
    
    let celdaDescripcion = lineaDatosFd.insertCell(-1);
    if (idioma == 1 ){
      celdaDescripcion.textContent = "Calificacion general:";
    } else {
      celdaDescripcion.textContent = "Total Score:";
    }

    celdaDescripcion.style.fontSize = "18px"; // Cambiar el tamaño de la fuente
    celdaDescripcion.style.fontWeight = "bold"; // Hacer el texto en negrita
    celdaDescripcion.style.color = "black";
    celdaDescripcion.style.textAlign = "center"; // Centrar el contenido horizontalmente
    celdaDescripcion.style.display = "flex";
    celdaDescripcion.style.justifyContent = "center";
    celdaDescripcion.style.alignItems = "center";

    celdaMaximo = lineaDatosFd.insertCell(-1);
    celdaMaximo.textContent = totalMax;
    celdaMaximo.classList.add("ajustado-derecha");
    celdaMaximo.style.fontWeight = "bold"; // Hacer el texto en negrita

    celdaPuntos = lineaDatosFd.insertCell(-1);
    celdaPuntos.textContent = totalCal;
    celdaPuntos.classList.add("ajustado-derecha");
    celdaPuntos.style.fontWeight = "bold"; // Hacer el texto en negrita

    celdaPorciento = lineaDatosFd.insertCell(-1);
    totalPor = ((totalCal / totalMax ) *100).toFixed(2);
    celdaPorciento.textContent = totalPor;
    celdaPorciento.classList.add("ajustado-derecha");
    celdaPorciento.style.fontWeight = "bold"; // Hacer el texto en negrita

    localStorage.setItem("porciento-B", totalPor);

    const capitulo = "B";
    actualizaCapitulos(capitulo, totalMax, totalCal, totalPor);
  }
}







// Recuperar el valor de LocalStorage
// let valorMaximo = JSON.parse(localStorage.getItem('maximo'));
// let valores = JSON.parse(localStorage.getItem('valores'));
// let valorPuntos = JSON.parse(localStorage.getItem('nuevoValor'));

// for (i = 0; i < tablaMenuApeRie.length; i++) {
//   tablaMenuApeRie[i][3] = 0;
//   tablaMenuApeRie[i][4] = 0;
//   tablaMenuApeRie[i][5] = 0;
// }



// for (i = 0; i < tablaMenuApeRie.length - 1; i++) {
//   tablaMenuApeRie[4][3] += tablaMenuApeRie[i][3];
//   tablaMenuApeRie[4][4] += tablaMenuApeRie[i][4];
// }

// if (tablaMenuApeRie[4][4] !== 0) {
//   tablaMenuApeRie[4][5] = ((tablaMenuApeRie[i][4] / tablaMenuApeRie[4][3]) * 100).toFixed(2)
// }

// // console.log(`puntos: ${valorRecuperado} y el maximo: ${valorMaximo} y el de funcion 2 ${valorFuncion2}`);

// //  llena la matriz 
// let lineaDatosFd = document.getElementById("lineaMenu");

// for (i = 0; i < tablaMenuApeRie.length; i++) {
//   lineaDatosFd = tablaIndice.insertRow();

//   let celdaNombre = lineaDatosFd.insertCell(-1);
//   celdaNombre.textContent = tablaMenuApeRie[i][0];

//   // Crear la segunda celda (columna) como un enlace:
//   // un elemento <a> con el valor de tablaMenuA[i][1]
//   // como su atributo href, y luego lo agregamos como hijo de la celda de enlace (celdaEnlace). 

//   const celdaEnlace = lineaDatosFd.insertCell(-1);
//   const enlace = document.createElement('a'); // Crear un elemento <a>
//   enlace.href = tablaMenuApeRie[i][1]; // Establecer el atributo href con el valor correspondiente
//   enlace.textContent = tablaMenuApeRie[i][2]; // Establecer el texto del enlace con el tercer elemento de la tabla
//   enlace.style.textDecoration = 'none';

//   if (i == tablaMenuApeRie.length-1){
//     enlace.style.fontSize = '18px'; // Cambiar el tamaño de la fuente
//     enlace.style.fontWeight = 'bold'; // Hacer el texto en negrita
//     enlace.style.color='black';

//     celdaEnlace.style.textAlign = 'center'; // Centrar el contenido horizontalmente
//     celdaEnlace.style.display = 'flex';
//     celdaEnlace.style.justifyContent = 'center';
//     celdaEnlace.style.alignItems = 'center';
//   }  

//   celdaEnlace.appendChild(enlace); // Agregar el enlace como hijo de la celda

//   celdaMaximo = lineaDatosFd.insertCell(-1);
//   if (tablaMenuApeRie[i][3] === 0) {
//     tablaMenuApeRie[i][3] = ""
//   }
//   celdaMaximo.textContent = tablaMenuApeRie[i][3];

//   celdaPuntos = lineaDatosFd.insertCell(-1);
//   if (tablaMenuApeRie[i][4] === 0) {
//     tablaMenuApeRie[i][4] = ""
//   }
//   celdaPuntos.textContent = tablaMenuApeRie[i][4];

//   celdaPorciento = lineaDatosFd.insertCell(-1);
//   if (tablaMenuApeRie[i][5] === 0) {
//     tablaMenuApeRie[i][5] = ""
//   }
//   celdaPorciento.textContent = tablaMenuApeRie[i][5];
// }



function actualizaCapitulos(capitulo, maximo, score, porcentaje) {
  fetch("/total-Capitulo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ capitulo, maximo, score, porcentaje }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la actualización");
      }
      return response.text();
    })
    .then((data) => {
      // alert("Registro actualizado correctamente");
      console.log(data);
    })
    .catch((error) => {
      alert("Actualiza Capitulos - Hubo un problema con la actualización");
      console.error(error);
    });
}