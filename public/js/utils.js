
// funcion para eliminar la respuesta anterior (si existe)
// async function eliminarRegistro(capitulo, seccion) {
//     fetch("/eliminar", {
//         method: "DELETE",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ capitulo, seccion }),
//     })
//         .then(response => response.json())
//         .then(data => {
//             if (data.success) {
//                 console.log(data.message || "Registro eliminado correctamente");
//             } else {
//                 alert("Error: " + data.error);
//             }
//         })
//         .catch(error => console.error("Error en la solicitud:", error));
// }

async function eliminarRegistro(capitulo, seccion) {
    return fetch("/eliminar", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ capitulo, seccion }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(data.message || "Registro eliminado correctamente");
                return true;  // Asegurar que la promesa se resuelve correctamente
            } else {
                console.error("Error en eliminación:", data.error);
                return false;  // Permite manejar el error sin bloquear el flujo
            }
        })
        .catch(error => {
            console.error("Error en la solicitud:", error);
            return false; // Retorna `false` en caso de error
        });
}

async function grabaNuevoItem(capitulo, seccion){
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

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//            mostrarMiAlertaComun
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function mostrarMiAlertaComun(maximo, valores, porcientoFormateado) {
    document.getElementById('miAlerta').style.display = 'block';
    //  crea el gauge despues de mostrar la alerta
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