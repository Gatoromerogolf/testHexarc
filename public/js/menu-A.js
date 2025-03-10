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
let textoCheck = [];
let textoRespuestas = [];

// Función autoinvocada - Ejecución inmediata  NUEVA !!!!!!!!!!!!!!1
(async function () {
    try {

        document.addEventListener("DOMContentLoaded", function() {
            const closeModalBtn = document.getElementById("closeDialog");
            const modal = document.getElementById("modalGeneral"); 
            const overlay = document.querySelector(".dialog-overlay");
        
            closeModalBtn.addEventListener("click", function() {
                console.log("Botón de cierre clickeado"); 
                modal.style.display = "none";
                overlay.style.display = "none"; // Solo si hay un overlay
            });
        });
        
        secciones = await leerSecciones();
        respuestas = await leerRespuestas(CUIT, capitulo);

        basura = respuestas.records;

        textoCheck = await leeTextoCheck();
        textoRespuestas = await leeTextoRespuestas();
        matrizPreguntas = await recuperarPreguntas();
 
        actualizarHTML(secciones);

        document.getElementById('tablaIndice').style.display = 'table';
        document.getElementById('loading').style.display = 'none';

    }
    catch (error) {
        console.error("Error en la función autoinvocada:", error);
    }
})();


// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//                  actualizarHTML
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
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
    let primero = true;

    secciones.records.forEach((seccion, indice, array) => {
        // busca la respuesta de la seccion que procesa
        if (respuestas.records) {
            respuestaSeccion = respuestas.records.find(respuesta =>
                respuesta.CUIT === CUIT &&
                respuesta.capitulo === seccion.capitulo &&
                respuesta.seccion === seccion.seccion
            )
        }

        lineaDatosFd = tablaIndice.insertRow();

        let celdaNombre = lineaDatosFd.insertCell(-1);
        celdaNombre.textContent = seccion.seccionromano;

        const celdaEnlace = lineaDatosFd.insertCell(-1);

        const enlace = document.createElement("a"); // Crear un elemento <a>
        enlace.textContent = seccion.descripcion; // Establecer el texto del enlace con el tercer elemento de la tabla

        if (!respuestaSeccion) {
            enlace.style.color = "#0000ff";
            if (primero) {
                enlace.href = seccion.pagina; // Establecer el atributo href con el valor correspondiente}
                enlace.style.color = "#0000ff";
                primero = false;
            } else {
                enlace.style.color = "#808080";
            }
        }
        else {
            enlace.style.color = "black";
            enlace.style.fontWeight = "600";
        }

        enlace.style.textDecoration = "none";  // Agregar el enlace como hijo de la celda
        celdaEnlace.appendChild(enlace);

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

            let botonVer = lineaDatosFd.insertCell(-1)
            const boton = document.createElement("button");
            botonVer.className = "pepe";
            let nombreBoton = respuestaSeccion.seccion;
            botonVer.setAttribute("data-info", nombreBoton);
            botonVer.setAttribute("data-nombre-seccion", seccion.descripcion);
            botonVer.setAttribute("data-puntaje-obtenido", respuestaSeccion.score);
            botonVer.setAttribute("data-porciento-obtenido", respuestaSeccion.porcentaje);
            idioma == 1 ? (botonVer.textContent = "Ver") : (botonVer.textContent = "View");
            botonVer.style.width = '40px';
            botonVer.classList.add("centered");
            // let celdaVer = document.createElement('td');
            // celdaVer.appendChild(boton)
            // fila.appendChild(celdaVer);
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

    const botones = document.querySelectorAll(".pepe");

    botones.forEach((boton) => {
      boton.addEventListener("click", (event) => {
        event.stopPropagation(); // Asegura que no se propague el evento
        const info = event.target.getAttribute("data-info");
        const nombreSeccion = event.target.getAttribute("data-nombre-seccion");
        const puntaje = event.target.getAttribute("data-puntaje-obtenido");
        const porciento = event.target.getAttribute("data-porciento-obtenido");
  
        console.log(`info recibida ${info}`)
        armarDetalleGeneral(info,nombreSeccion, puntaje, porciento, basura, textoCheck, textoRespuestas);
        const modal = document.getElementById("modalGeneral");
        if (modal) {
          // mostrarModalOculto(modal)
          modal.style.display = "block";
        }
      });
    });
    
    // Procesa linea final, si tiene respuesta para la ultima seccion.

    if (ultimaRespuestaSeccion) {

        document.getElementById("botonSiguiente").style.display = "block";

        lineaDatosFd = tablaIndice.insertRow();

        let celdaNombre = lineaDatosFd.insertCell(-1);
        celdaNombre.textContent = "";

        let celdaDescripcion = lineaDatosFd.insertCell(-1);
        if (idioma == 1) {
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
        totalPor = ((totalCal / totalMax) * 100).toFixed(2);
        celdaPorciento.textContent = totalPor;
        celdaPorciento.classList.add("ajustado-derecha");
        celdaPorciento.style.fontWeight = "bold"; // Hacer el texto en negrita

        localStorage.setItem("porciento-B", totalPor);

        // const capitulo = "B";
        actualizaCapitulos(capitulo, totalMax, totalCal, totalPor);
    }
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//             armarDetalleGeneral
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function armarDetalleGeneral(info, nombreSeccion, puntaje, porciento, basura, textoCheck, textoRespuestas) {
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

      if (!Array.isArray(basura)) {
        console.error("Error: respuestas no es un array", basura);
        return;
    }

      const registroRespuestasSeccion = basura.find(item => item.seccion === pregunta.Seccion)
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
      
      if (pregunta.tipo == 3) {
        celdaRpta.textContent = valorRespuesta;
      }
  
      if (pregunta.tipo == 51) {
        const registroTextoRespuestas = textoRespuestas.find(item => item.pregunta == pregunta.tipo);
        celdaRpta.textContent = registroTextoRespuestas.textos[valorRespuesta - 1]
      }
  
      if (pregunta.tipo > 51) {
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
    }
    
    document.getElementById("modalGeneral").style.display = "flex";
  }

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//                  actualizaCapitulos
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
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

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//             eliminarfilas
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function eliminarFilas() {
    const filasEliminar = dataTable.getElementsByTagName("tr");
    for (let i = filasEliminar.length - 1; i > 0; i--) {
      dataTable.deleteRow(i);
    }
  }

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//             leeTextoRespuestas
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
async function leeTextoRespuestas() {
    try {
      const response = await fetch("/textorespuestas");
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

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//                  leerSecciones
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
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

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//             leerRespuestas
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
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

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//             leeTextoCheck
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
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

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//             leeTextoRespuestas
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
async function leeTextoRespuestas() {
    try {
      const response = await fetch("/textorespuestas");
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

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//             recuperarPreguntas
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
async function recuperarPreguntas(capitulo = 'A') {
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

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//             cerrarModal
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function cerrarModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) {
      console.log("Cerrando modal"); // Debugging: Confirmar que el modal se cierra
      modal.style.display = "none";
    }
  }