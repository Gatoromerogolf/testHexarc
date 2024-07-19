let respuestas = [];
let tabla = [];
let valores = 0;
let maximo = 50; // 1 x 10 +  3 x 5
let porcientoFormateado = 0;
let puntajesIndividuales = [];
let filasFaltantes = [];

let checkboxesSeleccionados = [];

// OBTIENE LOS VALORES DE RADIO ::::::::::::::::::::::::::::::

function obtenerValoresSeleccionados() {
  respuestas = [];
  const grupos = ["A-8-1", "A-8-2", "A-8-3", "A-8-4"];


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

    console.log(`i= ${i} ,
         valores ${valores} ,
         respuestas: ${respuestas[i]}`);

    let precio = (i == 0) ? 20 : 10;

    switch (respuestas[i]) {
      case "1": valores +=0;
              break;
      case "2": valores +=(0.50 * precio);
              break;
      case "3": valores +=(0.75 * precio);
              break;
      case "4": valores +=precio;
              break;
    }

    console.log(`valor despues calculo: ${valores}`);

  }
  const porcientoFormateado = ((valores / maximo) * 100).toFixed(2);
  return porcientoFormateado;
}

// PROCESO PRINCIPAL ::::::::::::::::::::::::::::::::::::::::::

document
// Captura del formulario :::::::::::::::::::::::::::::::::::::
  .getElementById("formulario")
  .addEventListener("submit", function (event) {
    valores = 0;
    event.preventDefault(); // Prevenir el envío del formulario

// obtener los valores de radio ::::::::::::::::::::::::::::::
    obtenerValoresSeleccionados();
    console.log(`indice de respuestas faltantes ${filasFaltantes}`);

// Si no hay faltantes sigue adelante:::::::::::::::::::::::::
    if (!(filasFaltantes.length > 0)) {
      porcientoFormateado = calculaResultados();
      porcientoFormateado = ((valores / maximo) * 100).toFixed(2);
      // alert(
      //   `Calificación obtenida: \n
      //         Puntaje máximo de la sección: ${maximo} \n
      //         Calificación: ${valores} \n
      //         Porcentual: ${porcientoFormateado}%`
      // );
      // console.log("Mostrando alerta personalizada...");
      mostrarMiAlerta(maximo, valores, porcientoFormateado);
      console.log(`Suma puntos ${valores},
                 valor máximo: ${maximo},
                 porcentaje ${porcientoFormateado}`);
      console.table(puntajesIndividuales);

      // // Supongamos que calculas o recibes algún valor 'nuevoValor'
      // let nuevoValor = porcientoFormateado; // Función hipotética que genera un valor

      // Guardar el valor en LocalStorage
      localStorage.setItem("maximo-8", JSON.stringify(maximo));
      localStorage.setItem("valores-8", JSON.stringify(valores));
      localStorage.setItem("porciento-8", JSON.stringify(porcientoFormateado));

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

function mostrarMiAlerta(maximo, valores, porcientoFormateado) {

  // Mostrar la alerta personalizada
  document.getElementById('miAlerta').style.display = 'block';

  //  crea el gauge despues de mostrar la alerta
  const target = document.getElementById('gaugeChart'); // your canvas element
  const gauge = new Gauge(target).setOptions(opts); // create gauge!
  gauge.maxValue = 100; // set max gauge value
  gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
  gauge.animationSpeed = 32; // set animation speed (32 is default value)
  gauge.set(porcientoFormateado); // set actual value

  // Actualizar los contenidos
  document.getElementById('maximo').textContent = maximo;
  document.getElementById('calificacion').textContent = valores;
  document.getElementById('porcentual').innerHTML = '<strong>' + porcientoFormateado + '%<strong>';

}

function cerrarAlerta() {
  document.getElementById("miAlerta").style.display = "none";
}

function continuar() {
  cerrarAlerta();  // Opcional, depende de si quieres cerrar la alerta antes de cambiar la página

  grabarResultados2(respuestas)
    .then(() => {
      window.location.href =
        JSON.parse(localStorage.getItem("idioma")) == 1
          ? "MA-9.html"
          : "MA-9-en.html";
    })
    .catch((error) => {
      console.error("Error en grabarResultados:", error);
      alert("Reingrese a la aplicación.   Gracias.");
    });
}


async function grabarResultados2(respuestas) {

  const capitulo = "A";
  const seccion = 8;
  const score = valores;
  const respuesta = respuestas;

  const body = {
    capitulo,
    seccion,
    score,
    respuesta
  };

  try {
    const response = await fetch("http://localhost:3000/insertar2", {
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
    alert("El proceso requiere que registre nuevamente sus credenciales" + error.message);
    throw error; // Rechaza la promesa en caso de error
  }
}


// Armar velocimetro ::::::::::::::::::::::::::::::::::::::
const opts = {
  angle: -0.3,
// The span of the gauge arc
  lineWidth: 0.2, // The line thickness
  radiusScale: 0.8, // Relative radius
  pointer: {
      length: 0.6, // // Relative to gauge radius
      strokeWidth: 0.035, // The thickness
      color: '#000000' // Fill color
  },
  limitMax: false,     // If false, max value increases automatically if value > maxValue
  limitMin: false,     // If true, the min value of the gauge will be fixed
  colorStart: '#6F6EA0',   // Colors
  colorStop: '#C0C0DB',    // just experiment with them
  strokeColor: '#EEEEEE',  // to see which ones work best for you
  generateGradient: true,
  highDpiSupport: true,     // High resolution support

  // Custom segment colors
  staticZones: [
     {strokeStyle: "red", min: 0, max: 50}, // Red from 0 to 25
     {strokeStyle: "orange", min: 50, max: 70}, // Red from 0 to 25
     {strokeStyle: "green", min: 70, max: 90}, // Yellow from 50 to 75
     {strokeStyle: "blue", min: 90, max: 100}  // Blue from 75 to 100
  ],

  staticLabels: {
      font: "15px sans-serif",  // Specifies font
      labels: [0, 50, 75, 90, 100],  // Print labels at these values
      color: "#000000",  // Optional: Label text color
      fractionDigits: 0  // Optional: Numerical precision. 0=round off.
  },
};
