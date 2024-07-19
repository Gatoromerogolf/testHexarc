let tablaMenuEs = [];
let tablaMenuA = [];
let primeraVez = 0;

// lee la tabla de secciones.
// fetch('http://localhost:3000/registros')

// Función para obtener los datos de la base de datos
async function obtenerSecciones(indice) {

  let linkPagina = "##";
  try {
    // Realizar la solicitud fetch
    const response = await fetch(`/secciones?indice=${indice}`);

    if (response.ok) {
      // Obtener los datos en formato JSON
      const seccionRec = await response.json(); //registro seccion recibido
      if (seccionRec.length > 0) {
        const primerSeccion = seccionRec[0];
        // console.log (primerSeccion)
        // console.log (primerSeccion.max4)
        // leo la tabla de respuestas para saber si se completó
        const CUIT = localStorage.getItem('CUIT');
        const capitulo = "A";
        const seccion = primerSeccion.seccion;

        const direct3o4 = 'direct3o4';
        const direc34 = localStorage.getItem(direct3o4) || 2;
        
        const maximo = direc34 === '1' ? primerSeccion.max3 : primerSeccion.max4;

        const respuesta = await buscaRespuesta(CUIT, capitulo, seccion);
        if (respuesta.exists){
          // si lo encuentra, llena la tabla sin pasar el link
          console.log (`Encontro registro ${seccion} en obtenerSecciones`)
          // const registro = await response.json()

          const elemento = [
            `${primerSeccion.seccionromano}`,
            `##`,
            `${primerSeccion.descripcion}`,
            maximo,
            respuesta.score,
            (respuesta.score / primerSeccion.max4 * 100).toFixed(2)
          ];
          tablaMenuEs.push(elemento);
        }
          else{
            console.log (`no hay respuesta para seccion ${seccion}`);
            const elemento = [
              `${primerSeccion.seccionromano}`,
              '##', 
              `${primerSeccion.descripcion}`,
              null,
              null,
            ];
              if (primeraVez == 0) {
                elemento[1] = `${primerSeccion.pagina}`
                primeraVez = 1;
              }
              tablaMenuEs.push(elemento);
            // return true; // marca para terminar el ciclo
        }
      }
    } else {
      console.error('Error al obtener los datos');
    }
  } catch (error) {
    console.error('Error al realizar la solicitud:', error);
  }
  return false;
}


(async function() {
  try {
    for (let indice = 1; indice < 16; indice++) {
      const shouldTerminate = await obtenerSecciones(indice);
      if (shouldTerminate) break;
    }
  // Una vez que se han obtenido todos los datos, actualizar el HTML
      elemento = [
        null,
        `##`,
        "Calificación general:",
        null,
        null,
      ];
    tablaMenuEs.push(elemento);
    actualizarHTML(tablaMenuEs);

  } catch (error) {
    console.error('Error en la función autoinvocada:', error);  
  }
})();

async function buscaRespuesta(CUIT, capitulo, seccion) {
  // console.log (`los 3 valores ${CUIT}, ${capitulo}, ${seccion}`)
  try {
    const response = await fetch(`/busca-respuesta?CUIT=${CUIT}&capitulo=${capitulo}&seccion=${seccion}`);
    if (response.ok) {
      const result = await response.json();
      if (result.exists) {
        return { exists: true, score: result.score };
      }
    } else {
      console.error(`Sin respuesta para seccion ${seccion} en buscaRespuesta`);
    }
  } catch (error) {
    console.error('Error al realizar la solicitud en buscaRespuesta:', error);
  }
  return { exists: false };
}


// Función para actualizar el HTML con los datos de la tabla
function actualizarHTML(tablaMenuEs) {
  console.log (tablaMenuEs)

  tablaMenuA = tablaMenuEs;
  let totalMax = 0;
  let totalCal = 0;
  let totalPor = 0;

  //  llena la matriz 
  let lineaDatosFd = document.getElementById("lineaMenu");

  // alert(`El valor de tablaMenuEs.length es: ${tablaMenuEs.length}`);
  for (i = 0; i < tablaMenuA.length; i++) {
    lineaDatosFd = tablaIndice.insertRow();

    let celdaNombre = lineaDatosFd.insertCell(-1);
    celdaNombre.textContent = tablaMenuA[i][0];

    // Crear la segunda celda (columna) como un enlace:
    // un elemento <a> con el valor de tablaMenuA[i][1]
    // como su atributo href, y luego lo agregamos como hijo de la celda de enlace (celdaEnlace). 

    const celdaEnlace = lineaDatosFd.insertCell(-1);
    const enlace = document.createElement('a'); // Crear un elemento <a>
    enlace.href = tablaMenuA[i][1]; // Establecer el atributo href con el valor correspondiente
    enlace.textContent = tablaMenuA[i][2]; // Establecer el texto del enlace con el tercer elemento de la tabla
    enlace.style.textDecoration = 'none';
      // Agregar el enlace como hijo de la celda

    if (i == tablaMenuA.length-1){
      enlace.style.fontSize = '18px'; // Cambiar el tamaño de la fuente
      enlace.style.fontWeight = 'bold'; // Hacer el texto en negrita
      enlace.style.color='black';

      celdaEnlace.style.textAlign = 'center'; // Centrar el contenido horizontalmente
      celdaEnlace.style.display = 'flex';
      celdaEnlace.style.justifyContent = 'center';
      celdaEnlace.style.alignItems = 'center';
    }  
    celdaEnlace.appendChild(enlace); 

    celdaMaximo = lineaDatosFd.insertCell(-1);
    if (tablaMenuA[i][3] === 0) {
      tablaMenuA[i][3] = ""
    }
    celdaMaximo.textContent = tablaMenuA[i][3];
    celdaMaximo.classList.add('ajustado-derecha');
    totalMax += tablaMenuA[i][3];

    celdaPuntos = lineaDatosFd.insertCell(-1);
    if (tablaMenuA[i][4] === 0) {
      tablaMenuA[i][4] = ""
    }
    celdaPuntos.textContent = tablaMenuA[i][4];
    celdaPuntos.classList.add('ajustado-derecha');
    // Convierte el valor a un número antes de sumarlo
    totalCal += Number(tablaMenuA[i][4]);

    celdaPorciento = lineaDatosFd.insertCell(-1);
    if (tablaMenuA[i][5] === 0) {
      tablaMenuA[i][5] = ""
    }
    celdaPorciento.textContent = tablaMenuA[i][5];
    celdaPorciento.classList.add('ajustado-derecha');
    totalPor = ((totalCal / totalMax) * 100).toFixed(2);
  }

  // localStorage.setItem("maximo-A", JSON.stringify(tablaMenuA[15][3]));
  // localStorage.setItem("valores-A", JSON.stringify(tablaMenuA[15][4]));
  // localStorage.setItem("porciento-A", JSON.stringify(tablaMenuA[15][5]));

  if (tablaMenuA[14][4] > 0) {
    document.getElementById("botonSiguiente").style.display = "block";

    celdaMaximo.textContent = totalMax;
    celdaMaximo.classList.add('ajustado-derecha');
    celdaMaximo.style.fontWeight = 'bold'; // Hacer el texto en negrita

    celdaPuntos.textContent = totalCal;
    celdaPuntos.classList.add('ajustado-derecha');
    celdaPuntos.style.fontWeight = 'bold'; // Hacer el texto en negrita

    celdaPorciento.textContent = totalPor;
    celdaPorciento.classList.add('ajustado-derecha');
    celdaPorciento.style.fontWeight = 'bold'; // Hacer el texto en negrita

    localStorage.setItem('porciento-A', totalPor)

    const capitulo = "A";  
    actualizaCapitulos(capitulo, totalMax, totalCal, totalPor)
    // const var1 = JSON.parse(localStorage.getItem('porciento-A'));
    }
}

function actualizaCapitulos (capitulo, maximo, score, porcentaje){
  fetch('/total-Capitulo', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ capitulo, maximo, score, porcentaje })
})
.then(response => {
    if (!response.ok) {
        throw new Error('Error en la actualización');
    }
    return response.text();
})
.then(data => {
    alert('Registro actualizado correctamente');
    console.log(data);
})
.catch(error => {
    alert('Actualiza Capitulos - Hubo un problema con la actualización');
    console.error(error);
});
};
