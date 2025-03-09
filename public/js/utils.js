
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
