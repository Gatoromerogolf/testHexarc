const mysql = require('mysql2/promise');
const axios = require('axios');

// Configura la conexión a MySQL
const conexion = mysql.createPool({
  host: 'tuhost',
  user: 'tuusuario',
  password: 'tupassword',
  database: 'tubasedatos'
});

// Función para traducir texto usando Google Translate API
async function traducirTexto(texto, sourceLang = 'es', targetLang = 'en') {
  const apiKey = 'AIzaSyBaXewOWOWCakR2RlJN7VDzArPPg55gbBU';  // Reemplaza con tu clave de API de Google Translate
  const url = `https://translation.googleapis.com/language/translate/v2`;

  try {
    const respuesta = await axios.post(url, {}, {
      params: {
        q: texto,
        source: sourceLang,
        target: targetLang,
        key: apiKey
      }
    });
    return respuesta.data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Error en la traducción:', error);
    return texto; // Si falla la traducción, retorna el texto original
  }
}

async function copiarYTraducirTabla() {
  try {
    // Selecciona los datos de la tabla original
    const [filas] = await conexion.query("SELECT * FROM tabla_original");

    for (let fila of filas) {
      // Traducir el texto de los campos necesarios
      const textoTraducido = await traducirTexto(fila.campo_texto);

      // Preparar la consulta para insertar en la nueva tabla
      const consultaInsertar = "INSERT INTO tabla_traducida (campo1, campo_texto, ...) VALUES (?, ?, ...)";
      const valores = [fila.campo1, textoTraducido, ...];

      // Ejecutar la inserción en la tabla nueva
      await conexion.query(consultaInsertar, valores);
    }

    console.log('Traducción y copia completadas');
  } catch (error) {
    console.error('Error durante el proceso:', error);
  } finally {
    // Cierra la conexión a la base de datos
    await conexion.end();
  }
}

copiarYTraducirTabla();
