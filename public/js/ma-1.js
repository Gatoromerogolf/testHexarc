let respuestas = [];
let tabla = [];
let valores = 0;
let maximo = 0;
let porcientoFormateado = 0;
let puntajesIndividuales = [];
let filasFaltantes = [];

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
    const grupos = [
        "A-I-1",
        "A-I-2",
        "A-I-3",
        "A-I-4",
        "A-I-5",
        "A-I-6",
        "A-I-8",
        "A-I-9",
        "A-I-10",
        "A-I-12",
        "A-I-13",
        "A-I-14",
        "A-I-16",
        "A-I-17",
        "A-I-18",
    ];

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
            if (indiceFilas < 7) {
                filasFaltantes.push(indiceFilas);
            } else {
                if (indiceFilas < 11) {
                    filasFaltantes.push(indiceFilas + 1);
                } else {
                    filasFaltantes.push(indiceFilas + 2);
                }
            }
        }
    });

    if (filasFaltantes.length > 0) {
        alert(`Falta infomar en estas filas: ${filasFaltantes}`);
    } else {
        //  inserta con 6 el valor de los checkbox para que se posicione en la ultima = 0
        respuestas.splice(6, 0, 9);

        const advisoryBoard = document.querySelector(
            `input[name="A-I-10"]:checked`
        );
        if (advisoryBoard.value == 1) {
            // indica que se informó que tiene AB
            const respuestaAB = document.querySelector(
                `input[name="A-I-11"]:checked`
            );
            // si puso que tiene AB tiene que informar el campo 11
            if (respuestaAB) {
                console.log("entro por aca: " + respuestaAB.value);
                //si respondio hay que insertar el valor en el arreglo
                respuestas.splice(10, 0, respuestaAB.value);
            } else {
                alert(`No selecciono lo del AB en la fila 11`);
            }
        } else {
            respuestas.splice(10, 0, '9'); // oone 9 como marca de no respuesta    
        }

        const codGobCorp = document.querySelector(
            `input[name="A-I-14"]:checked`
        );
        if (codGobCorp.value > 1) {
            // indica que se informó que tiene Cód de Gobierno
            const respuestaCGC = document.querySelector(
                `input[name="A-I-15"]:checked`
            );
            // si puso que tiene AB tiene que informar el campo 11
            if (respuestaCGC) {
                console.log("entro por aca: " + respuestaCGC.value);
                //si respondio hay que insertar el valor en el arreglo
                respuestas.splice(14, 0, respuestaCGC.value);
            } else {
                alert(`No selecciono aprobación Cod Gob Cor en la fila 15`);
            }
        } else {
            respuestas.splice(14, 0, '9'); // pone 9 como marca de no respuesta    
        }

    }
    console.log(`respuestas con 7 y 11 ${respuestas}`);
    return respuestas; // Devuelve el arreglo si necesitas hacer algo más con él
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//           obtenerCheckboxSeleccionados  
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function obtenerCheckboxSeleccionados() {
    let errorCheckbox = 0;
    checkboxesSeleccionados = [];

    // Obtener todos los elementos checkbox
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    var ultimoCheckbox = checkboxes[checkboxes.length - 1]; // El último checkbox es especial

    // Crear un array para almacenar los IDs de los checkboxes seleccionados
    // var checkboxesSeleccionados = [];

    // Verificar si el último checkbox está seleccionado y alguno de los anteriores también
    var ultimoSeleccionado = ultimoCheckbox.checked;
    var otrosSeleccionados = Array.from(checkboxes)
        .slice(0, -1)
        .some((checkbox) => checkbox.checked);

    // Si el último está seleccionado y también otro, mostrar alerta y retornar
    if (ultimoSeleccionado && otrosSeleccionados) {
        alert(
            "No es posible seleccionar 'Ningún Director' junto con otras opciones en fila 7."
        );
        errorCheckbox = 1;
        return errorCheckbox;
    }

    // Si solo el último está seleccionado o algunos de los otros, pero no ambos>:  || = OR
    if (ultimoSeleccionado || otrosSeleccionados) {
        // Agregar los seleccionados al array
        checkboxes.forEach(function (checkbox) {
            if (checkbox.checked) {
                checkboxesSeleccionados.push(checkbox.value);
            }
        });
        console.log("Checkboxes seleccionados:", checkboxesSeleccionados);
    } else {
        // Si no se seleccionó ninguno, mostrar alerta
        alert("Por favor seleccionar al menos una opción en experiencia (fila 7).");
        errorCheckbox = 1;
        return errorCheckbox;
    }
    return errorCheckbox;
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//           sumaPuntosCheckbox  
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function sumaPuntosCheckbox() {
    // acumula los puntos por los checkbox seleccionados
    if (!puntajesIndividuales[6]) puntajesIndividuales[6] = []; // Asegurar que existe el arreglo antes de asignar valores

    puntajesIndividuales[6][2] = 0;
    for (i = 0; i < checkboxesSeleccionados.length; i++) {
        // let indicejota = checkboxesSeleccionados[i] - 1;
        valores += tabla[6][checkboxesSeleccionados[i] - 1];

        puntajesIndividuales[6][0] = 7;
        puntajesIndividuales[6][1] = checkboxesSeleccionados.join(", "); //Se convierte el array checkboxesSeleccionados en una cadena y luego se asigna esa cadena
        puntajesIndividuales[6][2] += tabla[6][checkboxesSeleccionados[i] - 1];
        console.log(
            `valor despues calculo: ${valores} , ${checkboxesSeleccionados[i]}`
        );
    }
    // errorCheckbox = 0;
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//           calculaResultados  
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function calculaResultados() {
    tabla = respuestas[0] == 1 ? tabla01 : tabla02;
    maximo = respuestas[0] == 1 ? tabla01[0][2] : tabla02[0][2];
    localStorage.setItem("3o4Direct", JSON.stringify(respuestas[0]));

    console.log(respuestas[0], maximo, tabla01[0][2], tabla02[0][2]);

    for (let i = 0; i < respuestas.length; i++) {
        if (i === 6) continue;
        if (i === 10 && respuestas[10] == 9) continue;
        if (i === 14 && respuestas[14] == 9) continue;
        if (!puntajesIndividuales[i]) puntajesIndividuales[i] = []; // Asegurar que existe el arreglo antes de asignar valores
        console.log(`i= ${i} ,
         valores ${valores} ,
         tabla: ${tabla[i]},
         respuesta: ${respuestas[i]},`);

        if (i > 0 && i < 7) {
            valores += tabla[i][respuestas[i]];
            console.log(`tablarespuesta:  , ${tabla[i][respuestas[i]]}`);
        } else {
            valores += tabla[i][respuestas[i] - 1];
            console.log(`tablarespuesta: ${tabla[i][respuestas[i] - 1]}`)
        }

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
        valores = 0;
        event.preventDefault(); // Prevenir el envío del formulario

        async function main() {
            // lee la lista de precios
            const listaPrecios = await leerListaPrecios();
            console.table(listaPrecios);
        }

        // Ejecuta la función main para leer los precios.
        main();

        // obtener los valores de radio
        obtenerValoresSeleccionados();
        console.log(`indice de respuestas faltantes ${filasFaltantes}`);

        // obtener CheckboxSeleccionados();
        let resultadoError = obtenerCheckboxSeleccionados();
        console.log(`return del checkbox  ${resultadoError}`);

        // Si no hay faltantes sigue adelante...
        if (!(filasFaltantes.length > 0) && resultadoError == 0) {
            porcientoFormateado = calculaResultados();
            sumaPuntosCheckbox();

            porcientoFormateado = ((valores / maximo) * 100).toFixed(2);

            mostrarMiAlerta(maximo, valores, porcientoFormateado);

            //  agrega los checkbox seleccionados al vector de respuestas.
            console.log(`respuesta 7 antes de inserción:  ${respuestas[7]}`)
            respuestas[6] = checkboxesSeleccionados;
            console.log(`resultado del array valores con los checkboxes:  ${respuestas}`);
            console.log(`posición 6:  ${respuestas[6]}`)
            console.log(`respuesta 7 despues de la inserción:  ${respuestas[7]}`)
            console.table(respuestas)

            // Usar un bucle para imprimir cada elemento con su índice
            respuestas.forEach((elemento, indice) => {
                if (Array.isArray(elemento)) {
                    console.log(`Índice ${indice}: [${elemento.join(', ')}]`);
                } else {
                    console.log(`Índice ${indice}: ${elemento}`);
                }
            });

            // Función personalizada para imprimir el arreglo
            function printArray(array) {
                array.forEach((elemento, indice) => {
                    if (Array.isArray(elemento)) {
                        console.log(`Índice ${indice}: [${elemento.join(', ')}]`);
                    } else {
                        console.log(`Índice ${indice}: ${elemento}`);
                    }
                });
            }

            // Guardar el valor en LocalStorage
            localStorage.setItem("maximo", JSON.stringify(maximo));
            localStorage.setItem("valores", JSON.stringify(valores));
            localStorage.setItem("porciento", JSON.stringify(porcientoFormateado));
        }
    });

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//           recuperarPreguntas 
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
async function recuperarPreguntas() {
    try {
        const response = await fetch('/preguntas');
        if (response.ok) {
            const result = await response.json();
            // console.log('Datos obtenidos de recuperarPreguntas:', result); // Agrega esta línea para verificar los datos obtenidos
            return Array.isArray(result) ? result : []; // Asegura devolver un arreglo
        } else {
            console.error('Error al obtener las preguntas:', response.statusText);
            return [];
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        return [];
    }
}

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

    document.getElementById('lineaAB').style.display = 'none';
    document.getElementById('lineaAB1').style.display = 'none';
    document.getElementById('lineaAB2').style.display = 'none';
    document.getElementById('lineaAB3').style.display = 'none';
    document.getElementById('lineaAB4').style.display = 'none';
    document.getElementById('linea2').style.display = 'none';
    document.getElementById('linea3').style.display = 'none';
    document.getElementById('linea4').style.display = 'none';
    document.getElementById('linea5').style.display = 'none';
    document.getElementById('linea6').style.display = 'none';
    document.getElementById('fila-15').style.display = 'none';
    document.getElementById('fila-15a').style.display = 'none';
    document.getElementById('fila-15b').style.display = 'none';
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//           mostrarMiAlerta  
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// ------------ ventana del final con resultados---------------
function mostrarMiAlerta(maximo, valores, porcientoFormateado) {

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

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//           cerrarAlerta  
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function cerrarAlerta() {
    document.getElementById("miAlerta").style.display = "none";
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//           continuar  
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function continuar() {
    cerrarAlerta();  // Opcional, depende de si quieres cerrar la alerta antes de cambiar la página

    grabarResultados2(respuestas)
        .then(() => {
            const username = localStorage.getItem('username') // Obtener username
            const CUIT = localStorage.getItem('CUIT');
            actualizaUserIngreso(username, CUIT)
            window.location.href =
                JSON.parse(localStorage.getItem("idioma")) == 1
                    ? "MA-2.html"
                    : "MA-2-en.html";
        })
        .catch((error) => {
            console.error("Error en grabarResultados:", error);
            console.log("Hubo un error al grabar los resultados: " + error.message);
        });
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//           grabarResultados2  
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
async function grabarResultados2(respuestas) {
    const capitulo = "A";
    const seccion = 1;
    // const maximo = maximo;

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

        // try {
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
        // console.log("estamos en el error (ins 2): " + error.message);
        // throw error; // Rechaza la promesa en caso de error
    }
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//           actualizaUserIngreso 
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function actualizaUserIngreso(username, CUIT) {
    fetch('/api/updateIngresado', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, CUIT })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Campo ingresado actualizado correctamente') {
                console.log('Campo ingresado actualizado correctamente');
            } else {
                console.error('Error al actualizar el campo ingresado');
            }
        })
        .catch(error => {
            console.error('Error en la solicitud de actualización:', error);
        });
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
