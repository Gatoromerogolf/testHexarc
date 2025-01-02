

let tablaMenuEs = [];
let tablaMenuA = [];
let primeraVez = 0;
// let apellidouser = localStorage.getItem("apellido");
// const nombreUser = localStorage.getItem("nombre");
// const apenom = nombreUser + ' ' + apellidouser;
// const empresa = localStorage.getItem("empresa");
// const CUIT = localStorage.getItem("CUIT");
const capitulo = "A";
const idioma = Number(localStorage.getItem('idioma'))
let totalMax = 0;
let totalCal = 0;
let matrizPreguntas = [];
let respuestas = [];
let textoCheck = [];
let textoRespuestas = [];

document.getElementById("nombreEmpresa").textContent = empresa;
document.getElementById("nombreUsuario").textContent = apenom;

const elementos = document.querySelectorAll(".company-name");

elementos.forEach(elemento => {
  elemento.textContent = empresa;
});

/* -----------------------------------------
ejecutarProceso         
------------------------------------------> */
// Llamas a la función `ejecutarProceso` para iniciar el flujo
ejecutarProceso();

async function ejecutarProceso() {
  capitulos = await leeCapitulos();
  matrizPreguntas = await recuperarPreguntas();
  // buscaPrintResultados(CUIT, capitulo);
  textoCheck = await leeTextoCheck();
  textoRespuestas = await leeTextoRespuestas();

  if (textoRespuestas.length > 0 && Array.isArray(textoRespuestas[0].textos) && textoRespuestas[0].textos.length > 0) {
    console.log(`Primer texto del primer registro: ${textoRespuestas[0].textos[0]}`);
  } else {
    console.error("No hay datos válidos en textoRespuestas o en textos del primer registro.");
  }


  buscaPrintResultados(CUIT, capitulo);

  // console.log(`leyo textoRespuestas ${textoRespuestas[0].textos}`)
}

/* -----------------------------------------
recuperarPreguntas          
------------------------------------------> */
async function recuperarPreguntas(capitulo = 'A') {
  try {
    let url = "/preguntas";
    if (capitulo !== null) {
      url += `?capitulo=${encodeURIComponent(capitulo)}`;
    }

    const response = await fetch(url);
    if (response.ok) {
      const result = await response.json(); // Procesa la respuesta como JSON
      // console.log("termino lectura preguntas");
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

/* -----------------------------------------
leeTextoCheck          
------------------------------------------> */
async function leeTextoCheck() {
  try {
    const response = await fetch("/textocheck");
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

/* -----------------------------------------
leeTextoRespuestas         
------------------------------------------> */
async function leeTextoRespuestas() {
  try {
    const response = await fetch("/textorespuestas");
    if (response.ok) {
      const result = await response.json();
      // console.log("Datos recibidos de /textorespuestas:", result); // Verifica la estructura aquí
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

/* -----------------------------------------
buscaPrintResultados      
------------------------------------------> */
async function buscaPrintResultados(CUIT, capitulo) {
  try {
    const { exists, respuestas } = await buscaRespuesta(CUIT, capitulo);   // Espera a que la promesa de buscaRespuesta se resuelva
    if (exists && respuestas.length > 0) {
      actualizarHTML(respuestas); // Imprime el resultado de los registros obtenidos
    } else {
      console.log('No se encontraron registros.');
    }
  } catch (error) {
    console.error('Error al ejecutar la búsqueda:', error);
  }
}

/* -----------------------------------------
buscaRespuesta    
------------------------------------------> */
async function buscaRespuesta(CUIT, capitulo) {
  try {
    const response = await fetch(
      `/busca-respuesta-capitulo-ordenado?CUIT=${CUIT}&capitulo=${capitulo}`
    );
    if (!response.ok) {
      throw new Error('Respuesta no OK de buscaRespuesta');
    }

    const resultado = await response.json();
    return { exists: resultado.exists, respuestas: resultado.records || [] };

  } catch (error) {
    console.error("Error al realizar la solicitud en buscaRespuesta:", error);
    return { exists: false, respuestas: [] };
  }
}


/* -----------------------------------------
actualizarHTML  
------------------------------------------> */
// Función para actualizar el HTML con los datos de la tabla
async function actualizarHTML(respuestas) {

  let lineaDatosFd = document.getElementById("factor");

  // if (capitulo === "D") {
  // Crear fila con la clase 'factor'
  let filaFactor = document.createElement('tr');
  filaFactor.classList.add('factor');

  let celdaFactor = document.createElement('th');
  celdaFactor.colSpan = 4; // Para que ocupe cuatro columnas 

  switch (capitulo) {
    case "A":
      celdaFactor.textContent = "Factor: Manejo de los Riesgos de Gobierno Corporativo"; break;
    case "B":
      celdaFactor.textContent = "Factor: Manejo del Apetito de Riesgo";
      break;
    case "C":
      celdaFactor.textContent = "Factor: Manejo de los Riesgos de Mercado";
      break;
    case "D":
      celdaFactor.textContent = "Factor: Manejo de los Riesgos de Procesos";
      break;
    default:
      celdaFactor.textContent = "error en el Factor";
  }
  filaFactor.appendChild(celdaFactor);
  lineaDatosFd.appendChild(filaFactor);
  // }

  async function procesarCategoria(rango, elementoID) {
    let tablaMenuA = respuestas.filter(respuesta =>
      respuesta.porcentaje > rango.min && respuesta.porcentaje <= rango.max
    );

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

  await procesarCategoria({ min: 0, max: 90 }, "tablaSeccion");

}

/* -----------------------------------------
llenaUnaParte
------------------------------------------> */
async function llenaUnaParte(tablaMenuA, lineaDatosFd) {
  for (const respuesta of tablaMenuA) {

    let filaSeccion = document.createElement('tr');
    filaSeccion.classList.add('seccion');

    let celdaNombre = document.createElement('th');
    celdaNombre.setAttribute('colspan', '4'); // Combina 4 columnas
    const capitulo = "A";
    const indice = respuesta.seccion;
    const descripcion = await obtenerNombreSeccion(indice, idioma, capitulo);
    celdaNombre.textContent = "[ " + respuesta.porcentaje + " % ]   -   Seccion: " + respuesta.seccion + '. ' + descripcion;
    // celdaNombre.style.width = '550px';
    filaSeccion.appendChild(celdaNombre);

    lineaDatosFd.appendChild(filaSeccion);


    let filaSituacion = document.createElement('tr'); //fila adicional "Situación"
    filaSituacion.classList.add('seccion');

    let celdaSituacionNum = document.createElement('th');
    celdaSituacionNum.textContent = " # "; // Texto de la situación
    celdaSituacionNum.style.width = '10px';
    filaSituacion.appendChild(celdaSituacionNum);

    let celdaSituacion = document.createElement('th');
    celdaSituacion.textContent = "Situación"; // Texto de la situación
    celdaSituacion.style.width = '450px';
    filaSituacion.appendChild(celdaSituacion);

    let celdaInformado = document.createElement('th');
    celdaInformado.textContent = "Informado"; // Texto de 'Informado'
    celdaInformado.style.width = '50px';
    filaSituacion.appendChild(celdaInformado);

    let celdaFlag = document.createElement('th');
    celdaFlag.textContent = "Obs"; // Texto de 'banderida'
    celdaFlag.style.width = '10px';
    filaSituacion.appendChild(celdaFlag);

    lineaDatosFd.appendChild(filaSituacion);


    let info = respuesta.seccion;
    let preguntasSeccion = matrizPreguntas.filter(pregunta =>
      pregunta.Seccion == info
    );

    for (const pregunta of preguntasSeccion) {

      // let lineaDatosMo = document.getElementById("lineaModalGeneral");

      let filaSeccion = document.createElement('tr');
      filaSeccion.classList.add('situacion2');

      let celdaNumero = document.createElement('th');
      celdaNumero.style.width = "5px"; // Define el ancho en píxeles
      celdaNumero.textContent = pregunta.Numero;
      filaSeccion.appendChild(celdaNumero);

      let consigna = document.createElement('th');
      consigna.style.width = "300px"; // Define el ancho en píxeles
      consigna.textContent = pregunta.Descrip;
      filaSeccion.appendChild(consigna);

      let respondido = document.createElement('th');
      respondido.style.width = "20px"; // Define el ancho en píxeles
      poneRespuesta(respuesta, pregunta).then((texto) => {
        ;
        respondido.textContent = texto;
      })
      filaSeccion.appendChild(respondido);

      // busca el registro de respuesta de la seccion que está trabajando

      let celdaRpta = document.createElement('th');
      celdaRpta.textContent = pregunta.tipo;
      celdaRpta.style.width = "20px"; // Define el ancho en píxeles
      filaSeccion.appendChild(celdaRpta);

      lineaDatosFd.appendChild(filaSeccion);
      // lineaDatosMo.appendChild(filaSeccion);
    }
  }
}


/* -----------------------------------------
armarDetalleGeneral
------------------------------------------> */
function armarDetalleGeneral(info, nombreSeccion, puntaje, porciento, respuestas, textoCheck, textoRespuestas) {
  let lineaModalGeneral = document.getElementById("lineaModalGeneral");
  // eliminarFilas();
  let preguntasSeccion = matrizPreguntas.filter(pregunta =>
    pregunta.Seccion == info
  );

  // console.table(preguntasSeccion);

  for (const pregunta of preguntasSeccion) {

    let filaSeccion = document.createElement('tr');
    // const fila = lineaModalGeneral.insertRow();     // Crear una nueva fila en la tabla

    let celdaNumero = document.createElement('th');
    celdaNumero.textContent = pregunta.Numero;
    filaSeccion.appendChild(celdaNumero);

    let consigna = document.createElement('th');
    consigna.textContent = pregunta.Descrip;
    filaSeccion.appendChild(consigna);

    // busca el registro de respuesta de la seccion que está trabajando
    let celdaRpta = document.createElement('th');
    celdaRpta.textContent = pregunta.tipo;
  }
}

/* -----------------------------------------
poneRespuesta
------------------------------------------> */
async function poneRespuesta(respuesta, pregunta) {

  console.log(`\n Pregunta a procesar ${pregunta.Numero} y tipo ${pregunta.tipo} \n`)


  console.log(`Primer texto del primer registro de respuesta en poneRespuesta: ${textoRespuestas[0].textos[0]}`);

  // const registroRespuestasSeccion = respuestas.find(item => item.seccion === pregunta.Seccion)
  // // registroRespuestasSeccion: es el arreglo de respuestas para todas las preguntas de la seccion)
  // // ahora recupera la respuesta segun el numero de pregunta....;
  const registroRespuestasSeccion = respuesta;
  console.table(registroRespuestasSeccion)
  let arrayRespuestas = registroRespuestasSeccion.respuesta;
  console.log(`respuesta encontrada ${arrayRespuestas}`)

  valorRespuesta = arrayRespuestas[pregunta.Numero - 1];// resta 1 por la posición 0
  console.log("valor de respuesta: " + valorRespuesta);

  // segun el tipo de respuesta (en pregunta.tipo) se convierte para mostrar
  // tipo 1:  1: si,  2: no
  if (pregunta.tipo == 1) {
    if (valorRespuesta == 1) {
      return "SI"
    } else {
      return "NO"
    }
  };

  if (pregunta.tipo == 3) {
    return valorRespuesta
  }

  if (pregunta.tipo == 51) {
    const registroTextoRespuestas = textoRespuestas.find(item => item.pregunta == pregunta.tipo);
    return registroTextoRespuestas.textos[valorRespuesta - 1]
  }

  if (pregunta.tipo > 50) {

    try {

      console.log(`Entrando en el bloque pregunta.tipo > 50`);

      const registroTextoRespuestas = textoRespuestas.find(registro => registro.pregunta === pregunta.tipo);

      if (registroTextoRespuestas) {
        console.log("Registro encontrado:", registroTextoRespuestas);
      } else {
        console.error(`No se encontró un registro con pregunta igual a ${pregunta.tipo}`);
      }

      valorRespuesta = arrayRespuestas[(pregunta.Numero) - 1];// resta 1 por la posición 0
      if (valorRespuesta == "9") {
        return "No aplica"
      }
      else {
        const texto = registroTextoRespuestas.textos[valorRespuesta - 1];
        return texto;
      }


    } catch (error) {
      console.error("Error procesando bloque para pregunta.tipo > 50:", error);
    }

  };



  if (pregunta.tipo > 40 && pregunta.tipo < 50) {
    let indicesCheck = 0;
    const registroTextoCheck = textoCheck.find(item => item.pregunta == pregunta.tipo);
    if (!registroTextoCheck) {
      console.log("No se encontró ninguna fila con la pregunta:", fila.tipo);
      return;
    }

    valorRespuesta = arrayRespuestas[(pregunta.Numero) - 1];// resta 1 por la posición 0

    const valoresTextoCheck = registroTextoCheck.textos;

    console.log(`registro Respuestas seccion  ${registroRespuestasSeccion.respuesta}`);
    console.log(`registro Respuestas seccion [6] ${registroRespuestasSeccion.respuesta[6]}`);
    console.log(`fila tipo = ${fila.tipo}`);

    if (pregunta.tipo == 42 || pregunta.tipo == 43) {
      arrayRespuestas = registroRespuestasSeccion.respuesta;
    } else {
      arrayRespuestas = registroRespuestasSeccion.respuesta[6]
    };

    console.log(`array rsepuestas  ${arrayRespuestas}`)

    let conjunto = '';

    arrayRespuestas.forEach((indice, i) => {
      const texto = valoresTextoCheck[indice - 1]; // Obtener el texto correspondiente al índice
      if (i > 0) {
        conjunto += ", "; // Agregar una coma y un espacio antes de cada texto (excepto el primero)
      }
      conjunto += texto;
    });
    return conjunto;
  }
}

// let conjunto = "cualquiera"

//   filaSeccion.appendChild(celdaRpta);

//   lineaModalGeneral.appendChild(filaSeccion);
// }

// const celdaComenta = fila.insertCell(-1);
// // Crear el elemento de imagen
// const imagen = document.createElement('img');
// Asignar la fuente de la imagen (ruta a la imagen)

// Opcional: puedes ajustar el tamaño de la imagen
// imagen.style.width = '15px';
// imagen.style.height = '15px';
// imagen.style.border = 'none';
// imagen.style.margin = '0';
// imagen.style.padding = '0';
// imagen.style.verticalAlign = 'middle';
// imagen.style.marginTop = '5px';  // Ajusta esta cantidad según lo necesites

// celdaComenta.style.display = 'flex';
// celdaComenta.style.justifyContent = 'center'; // Centrar horizontalmente
// celdaComenta.style.alignItems = 'center';     // Centrar verticalmente
// celdaComenta.style.height = '100%';           // Ocupa toda la altura de la fila
// celdaComenta.style.padding = '0';             // Evitar padding que pueda desalinear la imagen
// celdaComenta.style.boxSizing = 'border-box';  // Incluir bordes y padding en el tamaño total
// celdaComenta.style.border = 'none';

// celdaComenta.style.border = 'none';

// Agregar la imagen a la celda
// imagen.src = '../img/blanco.png';  // Reemplaza con la ruta de tu imagen
// celdaComenta.appendChild(imagen);

// if (celdaRpta.textContent == "NO") {
//   imagen.src = '../img/advertencia-rojo.png';  // Reemplaza con la ruta de tu imagen
//    celdaComenta.appendChild(imagen);
// }

// if (celdaRpta.textContent == "No efectivo") {
//    imagen.src = '../img/advertencia-rojo.png';  // Reemplaza con la ruta de tu imagen
//     celdaComenta.appendChild(imagen);
// }

// if(celdaRpta.textContent == "Poco efectivo") {
//           imagen.src = '../img/alerta-rojo.png';  // Reemplaza con la ruta de tu imagen
//           celdaComenta.appendChild(imagen);
// }

// if(celdaRpta.textContent == "Efectivo") {
//         imagen.src = '../img/advertencia.png';  // Reemplaza con la ruta de tu imagen
//         celdaComenta.appendChild(imagen);
//   }
//     // else { 
//     //   celdaComenta.textContent = ' ';
//     // }  
// }

//   document.getElementById("modalGeneral").style.display = "flex";
// }
// }

/* -----------------------------------------
eliminarFilas
------------------------------------------> */
// function eliminarFilas() {
//   const filasEliminar = dataTable.getElementsByTagName("tr");
//   for (let i = filasEliminar.length - 1; i > 0; i--) {
//     dataTable.deleteRow(i);
//   }
// }

/* -----------------------------------------
cerrarModal
------------------------------------------> */
function cerrarModal(idModal) {
  const modal = document.getElementById(idModal);
  if (modal) {
    console.log("Cerrando modal"); // Debugging: Confirmar que el modal se cierra
    modal.style.display = "none";
  }
}


/* -----------------------------------------
obtenerNombreSeccion
------------------------------------------> */
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


/* -----------------------------------------
lee Capitulos
------------------------------------------> */
async function leeCapitulos() {
  try {
    const respuesta = await fetch(`/capitulos?idioma=${idioma}`);
    if (respuesta.ok) {
      const capitulos = await respuesta.json();
      return capitulos;
    } else {
      console.error("Error al obtener los datos");
    }
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
  }
  return false;
}
