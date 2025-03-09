let respuestas = [];
let tabla = [];
let valores = 0;
let maximo = 60; // 3 x 10
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

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//           obtenerValoresSeleccionados
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function obtenerValoresSeleccionados() {
    respuestas = [];
    const grupos = ["A-13-1", "A-13-2", "A-13-3"];

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

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//           calculaResultados
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function calculaResultados() {

    for (let i = 0; i < respuestas.length; i++) {
        if (!puntajesIndividuales[i]) puntajesIndividuales[i] = []; // Asegurar que existe el arreglo antes de asignar valores

        console.log(`i= ${i} ,
         valores ${valores} ,
         respuestas: ${respuestas[i]}`);

        switch (respuestas[i]) {
            case "1": valores += 0;
                break;
            case "2": valores += (0.50 * 20);
                console.log(`caso 2 ${valores}`)
                break;
            case "3": valores += (0.75 * 20);
                console.log(`caso 3 ${valores}`)
                break;
            case "4": valores += 20;
                console.log(`caso 4 ${valores}`)
                break;
        }
        console.log(`valor despues calculo: ${valores}`);
    }
    const porcientoFormateado = ((valores / maximo) * 100).toFixed(2);
    return porcientoFormateado;
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//           PROCESO PRINCIPAL
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
    // Captura del formulario :::::::::::::::::::::::::::::::::::::
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

            mostrarMiAlerta(maximo, valores, porcientoFormateado);
            console.log(`Suma puntos ${valores},
                 valor máximo: ${maximo},
                 porcentaje ${porcientoFormateado}`);
            console.table(puntajesIndividuales);

            localStorage.setItem("maximo-13", JSON.stringify(maximo));
            localStorage.setItem("valores-13", JSON.stringify(valores));
            localStorage.setItem("porciento-13", JSON.stringify(porcientoFormateado));
        }
    });

// ---------------------------
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//           limpiarSelecciones
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function limpiarSelecciones() {
    // Obtener todos los inputs tipo radio y checkbox
    var radios = document.querySelectorAll('input[type="radio"]');
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // Desmarcar todos
    radios.forEach(function (radio) {
        radio.checked = false;
    });
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
    document.getElementById("miAlerta").style.display = "none";

    grabarResultados2(respuestas)
        .then(() => {
            window.location.href =
                JSON.parse(localStorage.getItem("idioma")) == 1
                    ? "MA-14.html"
                    : "MA-14-en.html";
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
    const seccion = 13;

    try {
        const eliminacionExitosa = await eliminarRegistro(capitulo, seccion);

        if (eliminacionExitosa) {
            console.log("Continuando con la inserción...");
        } else {
            console.warn("No se eliminó ningún registro, pero se procederá con la inserción.");
        }

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
