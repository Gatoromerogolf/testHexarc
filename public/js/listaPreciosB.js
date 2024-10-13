// listaPreciosB.js
// const fetch = require('node-fetch'); // Asegúrate de instalar node-fetch si aún no lo has hecho

export async function obtenerListaPreciosB() {
  try {
    const response = await fetch('/leeListaPrecios'); // Usa la URL correcta para tu API
    if (response.ok) {
      const listaPrecios = await response.json();
      return listaPrecios;
    } else {
      console.error('Error en la respuesta:', response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
    return null;
  }
}

