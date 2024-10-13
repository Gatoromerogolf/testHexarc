let tablaMenuEs = [];
let tablaMenuA = [];
let primeraVez = 0;

const apellidouser = localStorage.getItem("apellido");
const nombreUser = localStorage.getItem("nombre");
const apenom = nombreUser + ' ' + apellidouser;
const empresa = localStorage.getItem("empresa");
document.getElementById("nombreEmpresa").textContent = empresa;
document.getElementById("nombreUsuario").textContent = apenom;

const idioma = localStorage.getItem("idioma");
const CUIT = localStorage.getItem("CUIT");

let secciones = [];
let respuestas = [];
const capitulo = "A";
const respuestaSeccion = undefined;


// (async function () {
//   try {
//     for (let indice = 1; indice < 16; indice++) {
//       const shouldTerminate = await obtenerSecciones(indice, idioma);
//       if (shouldTerminate) break;
//     }
//     // Una vez que se han obtenido todos los datos, actualizar el HTML
//     // elemento = [null, `##`, "Calificación general:", null, null];
//     // tablaMenuEs.push(elemento);
//     actualizarHTML(tablaMenuEs);
//     document.getElementById('tablaIndice').style.display = 'table';
//     document.getElementById('loading').style.display = 'none';
    
//   } catch (error) {
//     console.error("Error en la función autoinvocada:", error);
//   }
// })();

// Función autoinvocada - Ejecución inmediata  NUEVA !!!!!!!!!!!!!!1
(async function () {
  try {
    secciones = await leerSecciones();
    respuestas = await leerRespuestas(CUIT, capitulo);

    actualizarHTML(secciones);
    
    document.getElementById('tablaIndice').style.display = 'table';
    document.getElementById('loading').style.display = 'none';
  }
    catch (error) {
    console.error("Error en la función autoinvocada:", error);
  }
})();

async function leerSecciones() {
  try {
    const response = await fetch(`/secciones?idioma=${idioma}&capitulo=${capitulo}`);
    if (response.ok) {
      const seccionRec = await response.json(); //registro seccion recibido en formato JSON
      return { exists: true, records: seccionRec };
    } else {
      console.error("Error al obtener los datos");
      return [];
    }
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
  }
  return false;  
}


async function leerRespuestas(CUIT, capitulo) {
  try {
    // console.time("Tiempo de busca Respuesta cuit, capit");
    const response = await fetch(
      `/busca-respuesta-capitulo?CUIT=${CUIT}&capitulo=${capitulo}`
    );
    if (response.ok) {
      const result = await response.json();
      if (result.exists) {
        return { exists: true, records: result.records };
      }
    } else {
      console.error(`Sin respuesta para lectura seccion en capitulo ${capitulo} en buscaRespuesta`);
    }
  } catch (error) {
    console.error("Error al realizar la solicitud en buscaRespuesta:", error);
  }
  return { exists: false };
}







// // Función para obtener los datos de la base de datos
// async function obtenerSecciones(indice, idioma) {
//   let linkPagina = "##";
//   try {
//     // Realizar la solicitud fetch
//     const capitulo = "A";

//     const response = await fetch(`/secciones?indice=${indice}&idioma=${idioma}&capitulo=${capitulo}`);

//     if (response.ok) {indice=`${indice}`;
//       // Obtener los datos en formato JSON
//       const seccionRec = await response.json(); //registro seccion recibido
//       if (seccionRec.length > 0) {
//         const primerSeccion = seccionRec[0];
//         // console.log (primerSeccion)
//         // console.log (primerSeccion.max4)
//         // leo la tabla de respuestas para saber si se completó
//         const CUIT = localStorage.getItem("CUIT");
//         const seccion = primerSeccion.seccion;

//         const direct3o4 = "direct3o4";
//         const direc34 = localStorage.getItem(direct3o4) || 2;

//         const maximo =
//           direc34 === "1" ? primerSeccion.max3 : primerSeccion.max4;

//         const respuesta = await buscaRespuesta(CUIT, capitulo, seccion);
//         if (respuesta.exists) {
//           // si lo encuentra, llena la tabla sin pasar el link
//           // console.log(`Encontro registro ${seccion} en obtenerSecciones`);
//           const registro = respuesta.record;

//           const elemento = [
//             `${primerSeccion.seccionromano}`,
//             `##`,
//             `${primerSeccion.descripcion}`,
//             registro.maximo,
//             registro.score,
//             // (respuesta.score / primerSeccion.max4 * 100).toFixed(2)
//             registro.porcentaje,
//           ];
//           // console.log(elemento);
//           tablaMenuEs.push(elemento);
//         } else {
//           // console.log (`no hay respuesta para seccion ${seccion}`);
//           const elemento = [
//             `${primerSeccion.seccionromano}`,
//             "##",
//             `${primerSeccion.descripcion}`,
//             null,
//             null,
//           ];
//           if (primeraVez == 0) {
//             elemento[1] = `${primerSeccion.pagina}`;
//             primeraVez = 1;
//           }
//           tablaMenuEs.push(elemento);
//           // return true; // marca para terminar el ciclo
//         }
//       }
//     } else {
//       console.error("Error al obtener los datos");
//     }
//   } catch (error) {
//     console.error("Error al realizar la solicitud:", error);
//   }
//   return false;
// }

// (async function () {
//   try {
//     for (let indice = 1; indice < 16; indice++) {
//       const shouldTerminate = await obtenerSecciones(indice, idioma);
//       if (shouldTerminate) break;
//     }
//     // Una vez que se han obtenido todos los datos, actualizar el HTML
//     // elemento = [null, `##`, "Calificación general:", null, null];
//     // tablaMenuEs.push(elemento);
//     actualizarHTML(tablaMenuEs);
//     document.getElementById('tablaIndice').style.display = 'table';
//     document.getElementById('loading').style.display = 'none';
    
//   } catch (error) {
//     console.error("Error en la función autoinvocada:", error);
//   }
// })();

// async function buscaRespuesta(CUIT, capitulo, seccion) {
//   // console.log (`los 3 valores ${CUIT}, ${capitulo}, ${seccion}`)
//   try {
//     const response = await fetch(
//       `/busca-respuesta?CUIT=${CUIT}&capitulo=${capitulo}&seccion=${seccion}`
//     );
//     if (response.ok) {
//       const result = await response.json();
//       if (result.exists) {
//         // return { exists: true, score: result.score };
//         return { exists: true, record: result.record };
//       }
//     } else {
//       console.error(`Sin respuesta para seccion ${seccion} en buscaRespuesta`);
//     }
//   } catch (error) {
//     console.error("Error al realizar la solicitud en buscaRespuesta:", error);
//   }
//   return { exists: false };
// }

// Función para actualizar el HTML con los datos de la tabla
function actualizarHTML(secciones) {

  tablaMenuA = tablaMenuEs;
  let totalMax = 0;
  let totalCal = 0;
  let totalPor = 0;
  let celdaMaximo, celdaPuntos, celdaPorciento;
  let lineaDatosFd = document.getElementById("lineaMenu");
  let ultimaRespuestaSeccion = undefined; //guarda el valor de la ultima respuesta encontrada
  let respuestaSeccion = undefined;

  let ultimaFila;

  secciones.records.forEach((seccion, indice, array) => {
    lineaDatosFd = tablaIndice.insertRow();

    let celdaNombre = lineaDatosFd.insertCell(-1);
    celdaNombre.textContent = seccion.seccionromano;

    const celdaEnlace = lineaDatosFd.insertCell(-1);
    const enlace = document.createElement("a"); // Crear un elemento <a>
    enlace.href = seccion.pagina; // Establecer el atributo href con el valor correspondiente
    enlace.textContent = seccion.descripcion; // Establecer el texto del enlace con el tercer elemento de la tabla
    enlace.style.textDecoration = "none";  // Agregar el enlace como hijo de la celda
    celdaEnlace.appendChild(enlace);

    // busca la respuesta de la seccion que procesa
    if (respuestas.records) {
      respuestaSeccion = respuestas.records.find(respuesta =>
      respuesta.CUIT === CUIT &&
      respuesta.capitulo === seccion.capitulo &&
      respuesta.seccion === seccion.seccion
      )}

    if (respuestaSeccion) {
        let celdaMaximo = lineaDatosFd.insertCell(-1);
        celdaMaximo.textContent = respuestaSeccion.maximo || "";
        celdaMaximo.classList.add("ajustado-derecha");
        totalMax += Number(respuestaSeccion.maximo);

        let celdaPuntos = lineaDatosFd.insertCell(-1);
        celdaPuntos.textContent = respuestaSeccion.score || "";
        celdaPuntos.classList.add("ajustado-derecha");
        // Convierte el valor a un número antes de sumarlo
        totalCal += Number(respuestaSeccion.score);

        let celdaPorciento = lineaDatosFd.insertCell(-1);
        celdaPorciento.textContent = respuestaSeccion.porcentaje || "";
        celdaPorciento.classList.add("ajustado-derecha");
    }
    else {
        let celdaMaximo = lineaDatosFd.insertCell(-1);
        celdaMaximo.textContent = "";
        let celdaPuntos = lineaDatosFd.insertCell(-1);
        celdaPuntos.textContent = "";
        let celdaPorciento = lineaDatosFd.insertCell(-1);
      celdaPorciento.textContent = "";
    }  
      // Si estamos en el último elemento del forEach, guarda la respuesta
    if (indice === array.length - 1) {
      ultimaRespuestaSeccion = respuestaSeccion;
    }
  })

  // Procesa linea final, si tiene respuesta para la ultima seccion.

  if (ultimaRespuestaSeccion) {

    document.getElementById("botonSiguiente").style.display = "block";

    lineaDatosFd = tablaIndice.insertRow();

    let celdaNombre = lineaDatosFd.insertCell(-1);
    celdaNombre.textContent =  "";
    
    let celdaDescripcion = lineaDatosFd.insertCell(-1);
    if (idioma == 1 ){
      celdaDescripcion.textContent = "Calificación general:";
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

    // const capitulo = "B";
    actualizaCapitulos(capitulo, totalMax, totalCal, totalPor);
  }
}


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
      console.error(error);
    });
}
