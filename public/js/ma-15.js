let respuestas = [];
let tabla = [];
let valores = 0;
let maximo = 20; // 2 por 5
let porcientoFormateado = 0;
let puntajesIndividuales = [];
let filasFaltantes = [];
let isExiting = false;

let checkboxesSeleccionados = [];

const apellidouser = localStorage.getItem("apellido");
const nombreUser = localStorage.getItem("nombre");
const apenom = nombreUser + ' ' + apellidouser;
const empresa = localStorage.getItem("empresa");
document.getElementById("nombreEmpresa").textContent = empresa;
document.getElementById("nombreUsuario").textContent = apenom;

// OBTIENE LOS VALORES DE RADIO ::::::::::::::::::::::::::::::

function obtenerValoresSeleccionados() {
  respuestas = [];
  const grupos = ["A-15-1", "A-15-2"];

  var indiceFilas = 0;
  filasFaltantes = [];
  grupos.forEach((nombreGrupo) => {
    indiceFilas++;
    const grupo = document.querySelector(
      `input[name="${nombreGrupo}"]:checked`
    );
    if (grupo) {
      respuestas.push(grupo.value); // Agrega el valor del radio seleccionado al arreglo
    } else {
      respuestas.push(null); // Agrega null si no hay selección
      filasFaltantes.push(indiceFilas);
    }
  });

  if (filasFaltantes.length > 0) {
    alert(`Falta infomar en estas filas: ${filasFaltantes}`);
  } else {
    console.log(`respuestas  ${respuestas}`);
    return respuestas; // Devuelve el arreglo si necesitas hacer algo más con él
  }
}

// CALCULA RESULTADOS ::::::::::::::::::::::::::::::::::::

function calculaResultados() {
  // tabla = respuestas[0] == 1 ? tabla01 : tabla02;
  // maximo = respuestas[0] == 1 ? tabla01[0][2] : tabla02[0][2];
  // console.log(respuestas[0], maximo, tabla01[0][2], tabla02[0][2]);

  for (let i = 0; i < respuestas.length; i++) {
    if (!puntajesIndividuales[i]) puntajesIndividuales[i] = []; // Asegurar que existe el arreglo antes de asignar valores

    // console.log(`i= ${i} ,
    //      valores ${valores} ,
    //      respuestas: ${respuestas[i]}`);

    switch (respuestas[0]) {
      case "1":
        valores += 0;
        break;
      case "2":
        valores += 0.5 * 10;
        console.log(`caso 2 ${valores}`);
        break;
      case "3":
        valores += 0.75 * 10;
        console.log(`caso 3 ${valores}`);
        break;
      case "4":
        valores += 10;
        console.log(`caso 4 ${valores}`);
        break;
    }

    if (respuestas[1] == 1) {
      valores += 10;
    }

    console.log(`valor despues calculo: ${valores}`);

    const porcientoFormateado = ((valores / maximo) * 100).toFixed(2);
    return porcientoFormateado;
  }
}

// PROCESO PRINCIPAL ::::::::::::::::::::::::::::::::::::::::::
document
    .getElementById("formulario")
    .addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
        event.preventDefault(); // Evita que se envíe el formulario
        }
     });   

    // Captura del formulario :::::::::::::::::::::::::::::::::::::
document
  .getElementById("formulario")
  .addEventListener("submit", function (event) {
    if (isExiting) {      // Verifica si está para salir y evita la validación en ese caso
      isExiting = false;  // Reinicia el indicador  para futuras operaciones
      return;   // Omite la validación cuando se está intentando salir
    }
    valores = 0;
    event.preventDefault(); // Prevenir el envío del formulario

    // obtener los valores de radio ::::::::::::::::::::::::::::::
    obtenerValoresSeleccionados();
    console.log(`indice de respuestas faltantes ${filasFaltantes}`);

    // Si no hay faltantes sigue adelante:::::::::::::::::::::::::
    if (!(filasFaltantes.length > 0)) {
      porcientoFormateado = calculaResultados();
      porcientoFormateado = ((valores / maximo) * 100).toFixed(2);

      // console.log("Mostrando alerta personalizada...");
      mostrarMiAlerta(maximo, valores, porcientoFormateado);
      console.log(`Suma puntos ${valores},
                 valor máximo: ${maximo},
                 porcentaje ${porcientoFormateado}`);
      console.table(puntajesIndividuales);

      // Guardar el valor en LocalStorage
      localStorage.setItem("maximo-15", JSON.stringify(maximo));
      localStorage.setItem("valores-15", JSON.stringify(valores));
      localStorage.setItem("porciento-15", JSON.stringify(porcientoFormateado));

      // window.location.href = "Menu-A.html";
    }
  });

// ---------------------------

function limpiarSelecciones() {
  // Obtener todos los inputs tipo radio y checkbox
  var radios = document.querySelectorAll('input[type="radio"]');
  var checkboxes = document.querySelectorAll('input[type="checkbox"]');

  // Desmarcar todos los radios
  radios.forEach(function (radio) {
    radio.checked = false;
  });

  // Desmarcar todos los checkboxes
  checkboxes.forEach(function (checkbox) {
    checkbox.checked = false;
  });
}

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function mostrarMiAlerta(maximo, valores, porcientoFormateado) {
  // Mostrar la alerta personalizada
  document.getElementById("miAlerta").style.display = "block";

  //  crea el gauge despues de mostrar la alerta
  const target = document.getElementById("gaugeChart"); // your canvas element
  const gauge = new Gauge(target).setOptions(opts); // create gauge!
  gauge.maxValue = 100; // set max gauge value
  gauge.setMinValue(0); // Prefer setter over gauge.minValue = 0
  gauge.animationSpeed = 32; // set animation speed (32 is default value)
  gauge.set(porcientoFormateado); // set actual value

  // Actualizar los contenidos
  document.getElementById("maximo").textContent = maximo;
  document.getElementById("calificacion").textContent = valores;
  document.getElementById("porcentual").innerHTML =
    "<strong>" + porcientoFormateado + "%<strong>";
}

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function cerrarAlerta() {
  // alert("entro en cerrarAlerta");
  document.getElementById("miAlerta").style.display = "none";
}

// function continuar() {
//   cerrarAlerta();  // Opcional, depende de si quieres cerrar la alerta antes de cambiar la página
//   window.location.href = "Menu-A.html";
// }

// function continuar() {
//   cerrarAlerta();  // Opcional, depende de si quieres cerrar la alerta antes de cambiar la página
//   alert("entro en continuar")
//   grabarResultados(respuestas).then(() => {
//     console.log('Operacion exitosa')
//   });
//   alert("ahora llama al menu-a")
//   window.location.href = (JSON.parse(localStorage.getItem('idioma'))) == 1 ? "Menu-A.html" : "Menu-A-en.html"
// }

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function continuar() {
  cerrarAlerta(); // Opcional, depende de si quieres cerrar la alerta antes de cambiar la página

  grabarResultados2(respuestas)
    .then(() => {
      const username = localStorage.getItem("username");
      const CUIT = localStorage.getItem("CUIT");
      actualizaUserIngreso(username, CUIT);
      window.location.href =
        JSON.parse(localStorage.getItem("idioma")) == 1
          ? "Menu-A.html"
          : "Menu-A-en.html";
    })
    .catch((error) => {
      console.error("Error en grabarResultados:", error);
      alert("Hubo un error al grabar los resultados: " + error.message);
    });
}

// grabacion mas completa

async function grabarResultados2(respuestas) {
  const capitulo = "A";
  const seccion = 15;
  const score = valores;
  const respuesta = respuestas;
  const porcentaje = porcientoFormateado;

  const body = {
    capitulo,
    seccion,
    maximo,
    score,
    porcentaje,
    respuesta,
  };

  try {
    // const response = await fetch("http://localhost:3000/insertar2", {
    const response = await fetch("/insertar2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const result = await response.json();
    if (result.success) {
      console.log("no hay error");
    } else {
      throw new Error(result.error || "Error desconocido ins 2");
    }
  } catch (error) {
    console.log("Error:", error);
    alert("estamos en el error (ins 2): " + error.message);
    throw error; // Rechaza la promesa en caso de error
  }
}

// Función para actualizar el campo ingresado del usuario
function actualizaUserIngreso(username, CUIT) {
  fetch("/api/updateIngresado", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, CUIT }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Campo ingresado actualizado correctamente") {
        console.log("Campo ingresado actualizado correctamente");
      } else {
        console.error("Error al actualizar el campo ingresado");
      }
    })
    .catch((error) => {
      console.error("Error en la solicitud de actualización:", error);
    });
}

// Bloquea el botón "Atrás" del navegador
window.history.pushState(null, "", window.location.href);

window.addEventListener("popstate", function (event) {
    window.history.pushState(null, "", window.location.href);
    alert("No puedes volver atrás en esta página.");
});

// Armar velocimetro ::::::::::::::::::::::::::::::::::::::
const opts = {
  angle: -0.3,
  // The span of the gauge arc
  lineWidth: 0.2, // The line thickness
  radiusScale: 0.8, // Relative radius
  pointer: {
    length: 0.6, // // Relative to gauge radius
    strokeWidth: 0.035, // The thickness
    color: "#000000", // Fill color
  },
  limitMax: false, // If false, max value increases automatically if value > maxValue
  limitMin: false, // If true, the min value of the gauge will be fixed
  colorStart: "#6F6EA0", // Colors
  colorStop: "#C0C0DB", // just experiment with them
  strokeColor: "#EEEEEE", // to see which ones work best for you
  generateGradient: true,
  highDpiSupport: true, // High resolution support

  // Custom segment colors
  staticZones: [
    { strokeStyle: "red", min: 0, max: 50 }, // Red from 0 to 25
    { strokeStyle: "orange", min: 50, max: 70 }, // Red from 0 to 25
    { strokeStyle: "green", min: 70, max: 90 }, // Yellow from 50 to 75
    { strokeStyle: "blue", min: 90, max: 100 }, // Blue from 75 to 100
  ],

  staticLabels: {
    font: "15px sans-serif", // Specifies font
    labels: [0, 50, 70, 90, 100], // Print labels at these values
    color: "#000000", // Optional: Label text color
    fractionDigits: 0, // Optional: Numerical precision. 0=round off.
  },
};

// //
// let respuestas = [1, 2, 3, 4, 5]; // Ejemplo de arreglo de respuestas
// let checklistValues = [6, 7, 8]; // Ejemplo de arreglo de valores de checklist
// let j = 2; // Posición en la que quieres insertar el arreglo checklistValues

// Usar splice para insertar checklistValues como un subarreglo en la posición j
// respuestas.splice(j, 0, checklistValues);

// console.log(respuestas); // Salida: [1, 2, [6, 7, 8], 3, 4, 5]
// console.log(respuestas[0]); // Salida: 1
// console.log(respuestas[2]); // Salida: [6, 7, 8]

// let respuestas = [1, 2, [6, 7, 8], 3, 4, 5];
// let numeroSiete = respuestas[2][1]; // Accede al subarreglo en la posición 2, y luego al elemento en la posición 1 dentro de ese subarreglo
// console.log(numeroSiete); // Salida: 7
