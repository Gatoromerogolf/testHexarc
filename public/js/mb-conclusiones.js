
let tablaMenuEs = [];
let tablaMenuA = [];
let primeraVez = 0;
const apellidouser = localStorage.getItem("apellido");
const nombreUser = localStorage.getItem("nombre");
const apenom = nombreUser + ' ' + apellidouser;
const empresa = localStorage.getItem("empresa");
const CUIT = localStorage.getItem("CUIT");
const capitulo = "B";
const idioma = Number(localStorage.getItem('idioma'))
let totalMax = 0;
let totalCal = 0;
let matrizPreguntas = [];
let respuestas = [];
let textoCheck = [];
let textoRespuestas = [];


document.getElementById("nombreEmpresa").textContent = empresa;
document.getElementById("nombreUsuario").textContent = apenom;


// Llamas a la función `ejecutarProceso` para iniciar el flujo
ejecutarProceso();

async function ejecutarProceso() {
  matrizPreguntas = await recuperarPreguntas();
  buscaPrintResultados(CUIT, capitulo);
  textoCheck = await leeTextoCheck();
  textoRespuestas = await leeTextoRespuestas();
  console.log(`leyo textoRespuestas ${textoRespuestas[0].textos}`)
}

async function recuperarPreguntas(capitulo = 'B') {
  try {
    let url = "/preguntas";
    if (capitulo !== null) {
      url += `?capitulo=${encodeURIComponent(capitulo)}`;
    }
    
    const response = await fetch(url);
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

async function leeTextoRespuestas() {
  try {
    const response = await fetch("/textorespuestas");
    if (response.ok) {
      const result = await response.json();
      console.log("Datos recibidos de /textorespuestas:", result); // Verifica la estructura aquí
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
  console.log("Actualizando HTML..."); // Debugging
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

  await procesarCategoria({ min: 0, max: 50 }, "questionsTableBody");
  await procesarCategoria({ min: 50.01, max: 70 }, "questions5170");
  await procesarCategoria({ min: 70.01, max: 90 }, "questions7190");
  await procesarCategoria({ min: 90.01, max: 100 }, "questions90100");

  document.getElementById("puntajeTotal").innerHTML = totalMax;
  document.getElementById("puntajeObtenido").innerHTML = totalCal;
  let porcentaje = (totalCal / totalMax) * 100.
  document.getElementById("porcentajeObtenido").innerHTML = porcentaje.toFixed(2);

  const botones = document.querySelectorAll(".pepe");

  botones.forEach((boton) => {
    // console.log('Añadiendo listener al botón');
    boton.addEventListener("click", (event) => {
      // console.log('Evento click en botón');
      event.stopPropagation(); // Asegura que no se propague el evento
      const info = event.target.getAttribute("data-info");
      const nombreSeccion = event.target.getAttribute("data-nombre-seccion");
      const puntaje = event.target.getAttribute("data-puntaje-obtenido");
      const porciento = event.target.getAttribute("data-porciento-obtenido");

      console.log(`info recibida ${info}`)
      armarDetalleGeneral(info,nombreSeccion, puntaje, porciento, respuestas, textoCheck, textoRespuestas);
      const modal = document.getElementById("modalGeneral");
      if (modal) {
        // mostrarModalOculto(modal)
        modal.style.display = "block";
      }
    });
  });
}  

// function mostrarModalOculto(modal){
//   modal.style.display = "block";
// }


function armarDetalleGeneral(info, nombreSeccion, puntaje, porciento, respuestas, textoCheck, textoRespuestas) {
  let lineaModalGeneral = document.getElementById("lineaModalGeneral");
  eliminarFilas();
  let preguntasSeccion = matrizPreguntas.filter(pregunta => 
    pregunta.Seccion == info
  );

  document.getElementById("nombreSeccion").textContent = nombreSeccion;
  document.getElementById("nombrePuntaje").textContent = puntaje;
  document.getElementById("nombrePorciento").textContent = porciento;


  console.table(preguntasSeccion);

  for (const pregunta of preguntasSeccion) {

    const fila = lineaModalGeneral.insertRow();     // Crear una nueva fila en la tabla
  
    const celdaSeccion = fila.insertCell(-1);
    celdaSeccion.textContent = pregunta.seccionRomano;

    const celdaNumero = fila.insertCell(-1);
    celdaNumero.textContent = pregunta.Numero;

    const celdaNombre = fila.insertCell(-1);
    celdaNombre.textContent = pregunta.Descrip;

   // busca el rgistro de respuesta de la seccion que está trabajando
    const celdaRpta = fila.insertCell(-1);
    console.log(`pregunta tipo  ${pregunta.tipo}`)
    celdaRpta.textContent = pregunta.tipo;
    const registroRespuestasSeccion = respuestas.find(item => item.seccion === pregunta.Seccion)
    // registroRespuestasSeccion: es el arreglo de respuestas para todas las preguntas de la seccion)
    // ahora recupera la respuesta segun el numero de pregunta....;

    let arrayRespuestas = registroRespuestasSeccion.respuesta;
    console.log(`respuesta encontrada ${arrayRespuestas}`)

    valorRespuesta = arrayRespuestas[pregunta.Numero-1];// resta 1 por la posición 0
    // segun el tipo de respuesta (en pregunta.tipo) se convierte para mostrar
    // tipo 1:  1: si,  2: no
    if (pregunta.tipo == 1) {
      if(valorRespuesta == 1){
        celdaRpta.textContent = "SI"
      } else {
        celdaRpta.textContent = "NO"
      }
    };
    
    if (pregunta.tipo > 50) {
      const registroTextoRespuestas = textoRespuestas.find(item => item.pregunta == pregunta.tipo);
      valorRespuesta = arrayRespuestas[(pregunta.Numero)-1];// resta 1 por la posición 0
      const texto = registroTextoRespuestas.textos[valorRespuesta-1];

      console.log(`pregunta.tipo: ${pregunta.tipo}, valorRespuesta ${valorRespuesta}, pregunta.Numero ${pregunta.Numero}, resta: ${[(pregunta.Numero)-1]}`)

      if (valorRespuesta == 9) {
         celdaRpta.textContent = "No aplica"}
        else {
        //  celdaRpta.textContent = registroTextoRespuestas.textos[valorRespuesta];
        celdaRpta.textContent = texto;
      }
    };

    if (pregunta.tipo > 40 && pregunta.tipo < 50) {
      let indicesCheck = 0;
      const registroTextoCheck = textoCheck.find(item => item.pregunta == pregunta.tipo);
      if (!registroTextoCheck) {
        console.log("No se encontró ninguna fila con la pregunta:", fila.tipo);
        return;
      }

      valorRespuesta = arrayRespuestas[(pregunta.Numero)-1];// resta 1 por la posición 0

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

      celdaRpta.textContent = conjunto;
    }      

    // const celdaComenta = fila.insertCell(-1);
    // Crear el elemento de imagen
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
    // }
      // else { 
      //   celdaComenta.textContent = ' ';
      // }  
  }
  
  document.getElementById("modalGeneral").style.display = "flex";
}

function eliminarFilas() {
  const filasEliminar = dataTable.getElementsByTagName("tr");
  for (let i = filasEliminar.length - 1; i > 0; i--) {
    dataTable.deleteRow(i);
  }
}

function cerrarModal(idModal) {
  const modal = document.getElementById(idModal);
  if (modal) {
    console.log("Cerrando modal"); // Debugging: Confirmar que el modal se cierra
    modal.style.display = "none";
  }
}

  async function llenaUnaParte(tablaMenuA, lineaDatosFd) {
      for (const respuesta of tablaMenuA) {
      let fila = document.createElement('tr');

      let celdaNombre = document.createElement('td');
      const capitulo = "B";
      const indice = respuesta.seccion;
      const descripcion = await obtenerNombreSeccion(indice, idioma, capitulo);
      celdaNombre.textContent = descripcion; // Ajusta según tu estructura de datos
      celdaNombre.textContent = respuesta.seccion + '. ' + descripcion;
      const nombreSeccion = respuesta.seccion + ' ' + descripcion;
      celdaNombre.style.width = '450px';
      celdaNombre.classList.add('font-style-conclu');
      fila.appendChild(celdaNombre);
    
      let celdaMaximo = document.createElement('td');
      celdaMaximo.textContent = respuesta.maximo;
      celdaMaximo.classList.add('centered', 'font-style-conclu');
      celdaMaximo.style.width = '45px';
      totalMax += Number(respuesta.maximo);
      fila.appendChild(celdaMaximo);

      let celdaPuntos = document.createElement('td');
      celdaPuntos.textContent = respuesta.score;
      celdaPuntos.classList.add('centered', 'font-style-conclu');
      celdaPuntos.style.width = '45px';
      totalCal += Number(respuesta.score);
      fila.appendChild(celdaPuntos);

      let celdaPorciento = document.createElement('td');
      celdaPorciento.textContent = respuesta.porcentaje;
      celdaPorciento.classList.add('centered', 'font-style-conclu');
      celdaPorciento.style.width = '45px';
      fila.appendChild(celdaPorciento);

      const boton = document.createElement("button");
      boton.className = "pepe";
      let nombreBoton = respuesta.seccion;
      boton.setAttribute("data-info", nombreBoton);
      boton.setAttribute("data-nombre-seccion", nombreSeccion);
      boton.setAttribute("data-puntaje-obtenido", respuesta.score);
      boton.setAttribute("data-porciento-obtenido", respuesta.porcentaje);
      boton.textContent = "Ver";
      boton.style.width = '35px';
      boton.classList.add("centered");
      let celdaVer = document.createElement('td');
      celdaVer.appendChild(boton)
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

