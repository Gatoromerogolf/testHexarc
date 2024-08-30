
let tablaMenuEs = [];
let tablaMenuA = [];
let primeraVez = 0;
const apellidouser = localStorage.getItem("apellido");
const nombreUser = localStorage.getItem("nombre");
const apenom = nombreUser + ' ' + apellidouser;
const empresa = localStorage.getItem("empresa");
const CUIT = localStorage.getItem("CUIT");
const capitulo = "A";
const idioma = Number(localStorage.getItem('idioma'))
let totalMax = 0;
let totalCal = 0;

document.getElementById("nombreEmpresa").textContent = empresa;
document.getElementById("nombreUsuario").textContent = apenom;

// Llama a la función asíncrona
buscaPrintResultados(CUIT, capitulo);

async function buscaPrintResultados (CUIT, capitulo) {
  try {
    const { exists, respuestas } = await buscaRespuesta(CUIT, capitulo);   // Espera a que la promesa de buscaRespuesta se resuelva
    if (exists && respuestas.length > 0) {
          actualizarHTML(respuestas); // Imprime el resultado de los registros obtenidos
        } else {
          console.log('No se encontraron registros.');
        }
  }catch (error) {
      console.error('Error al ejecutar la búsqueda:', error);
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
    return { exists: resultado.exists, respuestas: resultado.records || []};
    
  } catch (error) {
    console.error("Error al realizar la solicitud en buscaRespuesta:", error);
    return { exists: false, respuestas: [] };
  }
}


// Función para actualizar el HTML con los datos de la tabla
async function actualizarHTML(respuestas) {

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

  // Procesar las diferentes categorías
  await procesarCategoria({ min: 0, max: 50 }, "questionsTableBody");
  await procesarCategoria({ min: 50.01, max: 70 }, "questions5170");
  await procesarCategoria({ min: 70.01, max: 90 }, "questions7190");
  await procesarCategoria({ min: 90.01, max: 100 }, "questions90100");

  document.getElementById("puntajeTotal").innerHTML = totalMax;
  document.getElementById("puntajeObtenido").innerHTML = totalCal;
  let porcentaje = (totalCal / totalMax) * 100.
  document.getElementById("porcentajeObtenido").innerHTML = porcentaje.toFixed(2);

  // generatePDF();
}  


  async function llenaUnaParte(tablaMenuA, lineaDatosFd) {

      for (const respuesta of tablaMenuA) {
      let fila = document.createElement('tr');

      let celdaNombre = document.createElement('td');
      const capitulo = "A";
      const indice = respuesta.seccion;
      const descripcion = await obtenerNombreSeccion(indice, idioma, capitulo);
      celdaNombre.textContent = descripcion; // Ajusta según tu estructura de datos
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

      let celdaVer = document.createElement('td');
      celdaVer.style.width = '35px';
      celdaVer.classList.add("centered");
      celdaVer.textContent = 'ver';
      fila.appendChild(celdaVer);

      lineaDatosFd.appendChild(fila);
  }
}

async function obtenerNombreSeccion(indice, idioma, capitulo) {
  try {
    const response = await fetch(`/secciones?indice=${indice}&idioma=${idioma}&capitulo=${capitulo}`);
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


// function generatePDF() {
//     // Prevenir la recarga de la página
//     // event.preventDefault();
    
//     alert("Función generatePDF iniciada");
//     var element = document.getElementById('content');
//     if (!element) {
//         alert("No se encontró el elemento #content");
//         return;
//     }
//     alert("Elemento encontrado, comenzando html2pdf...");
//     html2pdf()
//       .from(element)
//       .toPdf()
//       .get('pdf')
//       .then(pdf => {
//         alert("Leyendo elemento");
//         return pdf;
//       })
//       .save('Conclusiones_Gobierno_Corporativo.pdf')
//       .then(() => {
//         alert("PDF generado exitosamente");
//       })
//       .catch((error) => {
//         alert("Error durante la generación del PDF:", error);
//       });
// }



    // const celdaEnlace = lineaDatosFd.insertCell(-1);
    // const enlace = document.createElement("a"); // Crear un elemento <a>
    // enlace.href = tablaMenuA[i][1]; // Establecer el atributo href con el valor correspondiente
    // enlace.textContent = tablaMenuA[i][2]; // Establecer el texto del enlace con el tercer elemento de la tabla
    // enlace.style.textDecoration = "none";  // Agregar el enlace como hijo de la celda
    // celdaEnlace.appendChild(enlace);

    // console.log (`valores de i ${i} y total Max: ${totalMax}`)


// function actualizaCapitulos(capitulo, maximo, score, porcentaje) {
//   fetch("/total-Capitulo", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ capitulo, maximo, score, porcentaje }),
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Error en la actualización");
//       }
//       return response.text();
//     })
//     .then((data) => {
//       // alert("Registro actualizado correctamente");
//       console.log(data);
//     })
//     .catch((error) => {
//       alert("Actualiza Capitulos - Hubo un problema con la actualización");
//       console.error(error);
//     });
// }


// Función para obtener los datos de la base de datos
// async function obtenerSecciones(indice, idioma) {
//   let linkPagina = "##";
//   try {
//     // Realizar la solicitud fetch

//     const response = await fetch(`/secciones?indice=${indice}&idioma=${idioma}`);

//     if (response.ok) {indice=`${indice}`;
//       // Obtener los datos en formato JSON
//       const seccionRec = await response.json(); //registro seccion recibido
//       if (seccionRec.length > 0) {
//         const primerSeccion = seccionRec[0];
//         // console.log (primerSeccion)
//         // console.log (primerSeccion.max4)
//         // leo la tabla de respuestas para saber si se completó
//         const CUIT = localStorage.getItem("CUIT");
//         const capitulo = "A";
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