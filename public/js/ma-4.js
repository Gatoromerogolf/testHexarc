let respuestas = [];
let tabla = [];
let valores = 0;
let maximo = 310; // 4 x 5 +  1 x 10  +  1 x 20
let porcientoFormateado = 0;
let puntajesIndividuales = [];
let filasFaltantes = [];

let checkboxesSeleccionados = [];

// OBTIENE LOS VALORES DE RADIO ::::::::::::::::::::::::::::::

function obtenerValoresSeleccionados() {
  respuestas = [];
  const grupos = [ // las respuestas
  "A-4-1",
  // saltea posicion 2 para auditor porque depende de 1
  "A-4-3",  
  "A-4-4",
  "A-4-5",
  "A-4-6",
  "A-4-7",
  "A-4-8",
  "A-4-9",
  "A-4-10"
  // "A-4-11",
];

  var indiceFilas = 0;
  filasFaltantes = [];
  grupos.forEach((nombreGrupo) => {
    indiceFilas++;

    // if (indiceFilas == 2){indiceFilas++}; //saltea posicion 2 para auditor
    const grupo = document.querySelector(
      `input[name="${nombreGrupo}"]:checked`
    );
    if (grupo) {
      respuestas.push(grupo.value); // Agrega el valor del radio seleccionado al arreglo
    } else {
      respuestas.push('9'); // Agrega null si no hay selección
      filasFaltantes.push(indiceFilas);
    }
    // console.log(`indice ${indiceFilas} y respuesta: ${respuestas}`)
  });

  console.log(`indice ${indiceFilas} y respuesta:           ${respuestas}`)

//  Ahora controla los condicionales, si existe comite cuando hay reunion::::::::::
// Comité de auditoria y el auditor :::::::::::::::::::::::::::::::::
  if (respuestas[0] == 1){
    //existe comite auditoria
    const marca = document.querySelector(
      'input[name="A-4-2"]:checked');
    
    if(!marca){
      respuestas.splice(1, 0, '9'); // Agrega null si no hay selección
      filasFaltantes.splice(1, 0, 2); // guarda en posicion 2??
    } else {
      respuestas.splice(1, 0, (marca.value))
    } 
  }else{
    respuestas.splice(1, 0, '9')
  };

  console.log (`respuestas despues auditor en comité  ${respuestas}`)

// Comité de Auditoría
  indiceFilas++;
  if (respuestas[0] == 1){
    const marca = document.querySelector(
      'input[name="A-4-11"]:checked');
  
    if (marca) {
      respuestas.push(marca.value); // Agrega el valor del radio seleccionado al arreglo
    } else {
      respuestas.push('9'); // Agrega null si no hay selección
      filasFaltantes.push(indiceFilas);}}
      else {
        console.log('agrego null por no comite auditoria')
        respuestas.push('9'); // Agrega null si no hay comite auditoria
      }

  console.log (`respuestas despues reuniones de audi  ${respuestas}`);

// Comité de Nominaciones y Sucesiones
  indiceFilas++;
  if (respuestas[2] == 1){
  const marca = document.querySelector(
    'input[name="A-4-12"]:checked');
  
    if (marca) {
    respuestas.push(marca.value); // Agrega el valor del radio seleccionado al arreglo
  } else {
    respuestas.push('9'); // Agrega null si no hay selección
    filasFaltantes.push(indiceFilas);}}
    else {
      console.log('agrego null por no comite alta gerencia')
      respuestas.push('9'); // Agrega null si no hay comite auditoria
    }

console.log (`resp despues reun Nominaciones y Suc  ${respuestas}`);

// Comité de Compensaciones
    indiceFilas++;
    if (respuestas[3] == 1){
    const marca = document.querySelector(
      'input[name="A-4-13"]:checked');
    
      if (marca) {
      respuestas.push(marca.value); // Agrega el valor del radio seleccionado al arreglo
    } else {
      respuestas.push('9'); // Agrega null si no hay selección
      filasFaltantes.push(indiceFilas);}}
      else {
        console.log('agrego null por no comite nominaciones')
        respuestas.push('9'); // Agrega null si no hay comite auditoria
      }
  
  console.log (`resp despues Compensaciones   .. ...${respuestas}`);


// Comité de Tecnología
  indiceFilas++;
  if (respuestas[4] == 1){
  const marca = document.querySelector(
    'input[name="A-4-14"]:checked');
  
    if (marca) {
    respuestas.push(marca.value); // Agrega el valor del radio seleccionado al arreglo
  } else {
    respuestas.push('9'); // Agrega null si no hay selección
    filasFaltantes.push(indiceFilas);}}
    else {
      console.log('agrego null por no comite compensaciones')
      respuestas.push('9'); // Agrega null si no hay comite auditoria
    }

console.log (`resp despues Tecnología.............${respuestas}`);


//  Comité de Riesgos
  indiceFilas++;
  if (respuestas[5] == 1){
  const marca = document.querySelector(
    'input[name="A-4-15"]:checked');

    if (marca) {
    respuestas.push(marca.value); // Agrega el valor del radio seleccionado al arreglo
  } else {
    respuestas.push('9'); // Agrega null si no hay selección
    filasFaltantes.push(indiceFilas);}}
    else {
      console.log('agrego null por no comite tecnologia')
      respuestas.push('9'); // Agrega null si no hay comite auditoria
    }

console.log (`resp despues Riesgos .................${respuestas}`);

// //  Comité de Riesgos
//   indiceFilas++;
//   if (respuestas[6] == 1){
//   const marca = document.querySelector(
//     'input[name="A-4-17"]:checked');

//     if (marca) {
//     respuestas.push(marca.value); // Agrega el valor del radio seleccionado al arreglo
//   } else {
//     respuestas.push('9'); // Agrega null si no hay selección
//     filasFaltantes.push(indiceFilas);}}
//     else {
//       console.log('agrego null por no comite riesgos')
//       respuestas.push('9'); // Agrega null si no hay comite auditoria
//     }

// console.log (`resp despues Riesgos .................${respuestas}`);



  if (filasFaltantes.length > 0) {
    alert(`Falta infomar en estas filas: ${filasFaltantes}`);
  } else {
    console.log(`respuestas  ${respuestas}`);
    return respuestas; // Devuelve el arreglo si necesitas hacer algo más con él
  }
}

// CALCULA RESULTADOS ::::::::::::::::::::::::::::::::::::

function calculaResultados() {

  const listaPrecios = [
    [20, 0], // 1. (i=0)comite de auditoría
    [30, 0], // 2. (i=1)el auditor participa
    [10, 0], // 3. (i=2)Nominaciones
    [10, 0], // 4. (i=3)Compensaciones
    [10, 0], // 5. (i=4)Tecnología
    [20, 0], // 6. (i=5)Riesgos
    [20, 0], // 7. (i=6)Director independiente
    [0, 5, 7.5, 10], // 8. (i=7)estructura documentada
    [0, 10, 15, 20], // 9. (i=8)acta por reunion
    [0, 20, 30, 40], // 10. (i=9) envia informes
    [0, 20, 10], // 11. (i=10) auditoría
    [0, 30, 20], // 12. (i=11)Nominaciones
    [0, 20, 10], // 13. (i=12)Compensaciones
    [0, 20, 10], // 14. (i=13)Tecnología
    [0, 30, 20] // 15. (i=14)Riesgos
  ]

  let precio = 0;

  for (let i = 0; i < respuestas.length; i++) {
    if (!puntajesIndividuales[i]) puntajesIndividuales[i] = []; // Asegurar que existe el arreglo antes de asignar valores

    if (respuestas[i] < 9){
      precio = listaPrecios[i] [respuestas[i]-1];
      valores += precio;
    }

    console.log(`i= ${i} ,
      respuesta: ${respuestas[i]};
      precio: ${listaPrecios[i] [respuestas[i]-1]};
      valores ${valores}`    
     );

  }
  const porcientoFormateado = ((valores / maximo) * 100).toFixed(2);
  console.log(`porciento formateado ${porcientoFormateado}`)
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
      console.log(`% a la vuelta del calculo ${porcientoFormateado}, maximo ${maximo}, valores: ${valores}`)
      porcientoFormateado = ((valores / maximo) * 100).toFixed(2);

      mostrarMiAlerta(maximo, valores, porcientoFormateado);
      console.log(`Suma puntos ${valores},
                 valor máximo: ${maximo},
                 porcentaje ${porcientoFormateado}`);
      console.table(puntajesIndividuales);

      // Guardar el valor en LocalStorage
      localStorage.setItem("maximo-4", JSON.stringify(maximo));
      localStorage.setItem("valores-4", JSON.stringify(valores));
      localStorage.setItem("porciento-4", JSON.stringify(porcientoFormateado));

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

  document.getElementById("tituloFrecuencia").style.display = 'none';

  document.getElementById('fila-2').style.display = 'none';
  document.getElementById('fila-2a').style.display = 'none';
  document.getElementById('fila-2b').style.display = 'none';
  document.getElementById('reunionComAud').style.display = 'none';
  document.getElementById('reunionComAud1').style.display = 'none';
  document.getElementById('reunionComAud2').style.display = 'none';

  document.getElementById('lineaAltaG').style.display = 'none';
  document.getElementById('lineaAltaG1').style.display = 'none';
  document.getElementById('lineaAltaG2').style.display = 'none';
  document.getElementById('lineaAltaG3').style.display = 'none';

  document.getElementById('lineaNomSuc').style.display = 'none';
  document.getElementById('lineaNomSuc1').style.display = 'none';
  document.getElementById('lineaNomSuc2').style.display = 'none';

  document.getElementById('comiteCompen').style.display = 'none';
  document.getElementById('comiteCompen1').style.display = 'none';
  document.getElementById('comiteCompen2').style.display = 'none';

  document.getElementById('comiteTecno').style.display = 'none';
  document.getElementById('comiteTecno1').style.display = 'none';
  document.getElementById('comiteTecno2').style.display = 'none';

  document.getElementById('comiteRiesgo').style.display = 'none';
  document.getElementById('comiteRiesgo1').style.display = 'none';
  document.getElementById('comiteRiesgo2').style.display = 'none';
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
          ? "MA-5.html"
          : "MA-5-en.html";
    })
    .catch((error) => {
      console.error("Error en grabarResultados:", error);
      alert("Hubo un error al grabar los resultados: " + error.message);
    });
}

async function grabarResultados2(respuestas) {
  const capitulo = "A";
  const seccion = 4;
  const score = valores;
  const respuesta = respuestas;
  const porcentaje = porcientoFormateado;

  const body = {
    capitulo,
    seccion,
    maximo, 
    score,
    porcentaje,
    respuesta
  };


  try {
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
      labels: [0, 50, 70, 90, 100],  // Print labels at these values
      color: "#000000",  // Optional: Label text color
      fractionDigits: 0  // Optional: Numerical precision. 0=round off.
  },
};
