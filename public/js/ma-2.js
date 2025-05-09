let respuestas = [];
let tabla = [];
let valores = 0;

let porcientoFormateado = 0;
let puntajesIndividuales = [];
let filasFaltantes = [];
let maximo = 160;
if (JSON.parse(localStorage.getItem('3o4Direct')) == 1) {
    maximo += 10;
}
let isExiting = false;

// Crear un array para almacenar los IDs de los checkboxes seleccionados
let checkboxesSeleccionados = [];
const apellidouser = localStorage.getItem("apellido");
const nombreUser = localStorage.getItem("nombre");
const apenom = nombreUser + ' ' + apellidouser;
const empresa = localStorage.getItem("empresa");
document.getElementById("nombreEmpresa").textContent = empresa;
document.getElementById("nombreUsuario").textContent = apenom;


// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//           obtenerCheckboxSeleccionados  
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function obtenerCheckboxSeleccionados() {
    let errorCheckbox = 0;
    checkboxesSeleccionados = [];// borra lo seleccionado anteriormente

    // Obtener todos los elementos checkbox
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // Verificar si el último checkbox está seleccionado y alguno de los anteriores también

    var otrosSeleccionados = Array.from(checkboxes)
        .some((checkbox) => checkbox.checked);

    if (!otrosSeleccionados) {
        alert("Por favor seleccionar al menos una opción");
        return errorCheckbox = 1;
    }

    checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            checkboxesSeleccionados.push(checkbox.value);
        }
    });

    console.log("Checkboxes seleccionados:", checkboxesSeleccionados);
    return errorCheckbox = 0;
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//           sumaPuntosCheckbox  
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function sumaPuntosCheckbox() {
    for (i = 0; i < checkboxesSeleccionados.length; i++) {
        if (checkboxesSeleccionados[i] == 11 || checkboxesSeleccionados[i] == 12) { valores += 20 }
        else {
            if (checkboxesSeleccionados[i] == 8) {
                valores += 30
            }
            else {
                valores += 10
            }
        }
        // si selecciono IA y es de 3 directores, le suma 10, porque el valor es 40 y no 30
        if (checkboxesSeleccionados[i] == 8 && JSON.parse(localStorage.getItem('3o4Direct')) == 1) { valores += 10 }

        console.log(
            `valor despues calculo: ${valores} , ${checkboxesSeleccionados[i]}`)
            ;
    }
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//           calculaResultados  
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function calculaResultados() {
    tabla = respuestas[0] == 1 ? tabla01 : tabla02;
    maximo = respuestas[0] == 1 ? tabla01[0][2] : tabla02[0][2];
    console.log(respuestas[0], maximo, tabla01[0][2], tabla02[0][2]);

    for (let i = 0; i < respuestas.length; i++) {

        if (i === 6) continue;
        if (!puntajesIndividuales[i]) puntajesIndividuales[i] = []; // Asegurar que existe el arreglo antes de asignar valores
        console.log(`i= ${i} ,
         valores ${valores} ,
         tabla: ${tabla[i]},
         respuestas: ${respuestas[i]},
         tablarespuesta: ${tabla[i][respuestas[i] - 1]}`);
        valores += tabla[i][respuestas[i] - 1];
        console.log(`valor despues calculo: ${valores}`);

        puntajesIndividuales[i][0] = i + 1;
        puntajesIndividuales[i][1] = respuestas[i];
        puntajesIndividuales[i][2] = tabla[i][respuestas[i] - 1];
    }
    const porcientoFormateado = ((valores / maximo) * 100).toFixed(2);
    return porcientoFormateado;
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//           PRINCIPAL  
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
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
        if (isExiting) {  // si está para salir  evita la validación
            isExiting = false;  // Reinicia el indicador  para futuras operaciones
            return;   // Omite la validación cuando se está intentando salir
        }
        valores = 0;
        event.preventDefault(); // Prevenir el envío del formulario

        // obtener CheckboxSeleccionados();
        let resultadoError = obtenerCheckboxSeleccionados();
        console.log(`return del checkbox  ${resultadoError}`)

        // Si no hay faltantes sigue adelante...
        if ((resultadoError == 0)) {
            // porcientoFormateado = calculaResultados();
            sumaPuntosCheckbox();

            porcientoFormateado = ((valores / maximo) * 100).toFixed(2);

            mostrarMiAlerta(maximo, valores, porcientoFormateado);

            localStorage.setItem('maximo-2', JSON.stringify(maximo));
            localStorage.setItem('valores-2', JSON.stringify(valores));
            localStorage.setItem('porciento-2', JSON.stringify(porcientoFormateado));
        }
    });

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//           limpiarSelecciones  
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
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

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//           mostrarMiAlerta  
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function mostrarMiAlerta(maximo, valores, porcientoFormateado) {
    document.getElementById('miAlerta').style.display = 'block';

    const target = document.getElementById('gaugeChart'); // your canvas element
    const gauge = new Gauge(target).setOptions(opts); // create gauge!
    gauge.maxValue = 100; // set max gauge value
    gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
    gauge.animationSpeed = 32; // set animation speed (32 is default value)
    gauge.set(porcientoFormateado); // set actual value

    document.getElementById('maximo').textContent = maximo;
    document.getElementById('calificacion').textContent = valores;
    document.getElementById('porcentual').innerHTML = '<strong>' + porcientoFormateado + '%<strong>';
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//           continuar  
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function continuar() {
    // Cierra la alerta antes de cambiar la página
    document.getElementById("miAlerta").style.display = "none";

    grabarResultados2(respuestas)
        .then(() => {
            window.location.href =
                JSON.parse(localStorage.getItem("idioma")) == 1
                    ? "MA-3.html"
                    : "MA-3-en.html";
        })
        .catch((error) => {
            console.error("Error en grabarResultados:", error);
            alert("Hubo un error al grabar los resultados: " + error.message);
        });
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//           grabarResultados2  
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
async function grabarResultados2(respuestas) {
    const capitulo = "A";
    const seccion = 2;

    try {
        // primero elimina la respuesta anterior (si existe)
        const eliminacionExitosa = await eliminarRegistro(capitulo, seccion);

        // Independientemente de si se eliminó o no un registro, debe continuar con la inserción
        if (eliminacionExitosa) {
            console.log("Continuando con la inserción...");
        } else {
            console.warn("No se eliminó ningún registro, pero se procederá con la inserción.");
        }

        const score = valores;
        const respuesta = checkboxesSeleccionados;
        const porcentaje = porcientoFormateado;

        const body = {
            capitulo,
            seccion,
            maximo,
            score,
            porcentaje,
            respuesta
        };

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
        } else {
            throw new Error(result.error || "Error desconocido ins 2");
        }
    } catch (error) {
        // console.log("Error:", error);
        // alert("estamos en el error (ins 2): " + error.message);
        // throw error; // Rechaza la promesa en caso de error
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
        { strokeStyle: "red", min: 0, max: 50 }, // Red from 0 to 25
        { strokeStyle: "orange", min: 50, max: 70 }, // Red from 0 to 25
        { strokeStyle: "green", min: 70, max: 90 }, // Yellow from 50 to 75
        { strokeStyle: "blue", min: 90, max: 100 }  // Blue from 75 to 100
    ],

    staticLabels: {
        font: "15px sans-serif",  // Specifies font
        labels: [0, 50, 70, 90, 100],  // Print labels at these values
        color: "#000000",  // Optional: Label text color
        fractionDigits: 0  // Optional: Numerical precision. 0=round off.
    },
};
