let tablaMenuA = [];
let tablaMenuEs = [];
let primeraVez = 0;
let pagina = "";
const CUIT =  localStorage.getItem('CUIT');
const apellidouser = localStorage.getItem("apellido");
const nombreUser = localStorage.getItem("nombre");
const apenom = nombreUser + ' ' + apellidouser;
const empresa = localStorage.getItem("empresa");

document.getElementById("nombreEmpresa").textContent = empresa;
document.getElementById("nombreUsuario").textContent = apenom;

const capitulo = "A";
respuestas = [];
listaPrecios = [];
let direct3o4 = 0;

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

async function inicializarAplicacion() {
  try {
    listaPrecios = await leerListaPrecios();
    if (listaPrecios === null) {
      console.error(
        "No se pudo leer la lista de precios. Abortando inicialización."
      );
      return;
    }
  } catch (error) {
    console.error("Error durante la inicialización de la aplicación:", error);
  }
}
inicializarAplicacion();

async function leerListaPrecios() {
  try {
    const response = await fetch("/leeListaPrecios");
    if (response.ok) {
      const result = await response.json();
      return Array.isArray(result) ? result : []; // Asegura devolver un arreglo
    } else {
      console.error("Error al obtener las preguntas:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
    return [];
  }
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

procesarCapitulos();

// Función principal que controla la secuencia
async function procesarCapitulos() {
  for (let i = 1; i < 7; i++) {
    await leeCapitulos(i); // Espera a que cada llamada se complete antes de proceder
  }
  completarHtml(); // Llama a completarHtml después de procesar todos los capítulos
  document.getElementById('tablaIndiceCapitulos').style.display = 'table';
  document.getElementById('loading').style.display = 'none';
}

// ::::::::::::::::::::::------------------------------------------
async function leeCapitulos(indice) {
  try {
    // Obtener el valor de 'idioma' desde localStorage
    const idioma = localStorage.getItem('idioma');

    // Realizar la solicitud fetch pasando 'indice' y 'idioma' como parámetros en la URL
    const respuesta = await fetch(`/capitulos?indice=${indice}&idioma=${idioma}`);
    if (!respuesta.ok) {
      console.log(`Error en lectura de capitulos`);
      return;
    }
    const capitulos = await respuesta.json();
    if (capitulos.length > 0) {
      const capLeido = capitulos[0];
      const capitulo = capLeido.letra;
      const nombre = capLeido.nombre;
      pagina = capLeido.paginaCap;
      try {
        const data = await obtenerTotalCapitulos(CUIT, capitulo);
        if (data && data.length > 0) {
          const { CUIT, capitulo, maximo, score, porcentaje } = data[0]; // Desestructura los valores
          const elemento = [capitulo, "##", nombre, maximo, score, porcentaje];
          tablaMenuEs.push(elemento);
        } else {
          // Si no hay totales, maneja el caso especial
          const elemento = [capitulo, "##", nombre, null, null, null];
          if (primeraVez == 0) {
            elemento[1] = pagina;
            primeraVez = 1;
          }
          tablaMenuEs.push(elemento);
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
}

// ::::::::::::::::::::::------------------------------------------
async function obtenerTotalCapitulos(CUIT, capitulo) {
  try {
    // Obtener el valor de 'idioma' desde localStorage
    const idioma = localStorage.getItem('idioma');

    const response = await fetch(`/totalCapitulos?CUIT=${CUIT}&capitulo=${capitulo}&idioma=${idioma}`);

    if (response.ok) {
      const data = await response.json();
      return data; // Devuelve los datos obtenidos si la respuesta es exitosa
    } else {
      console.error(
        "Error en la respuesta:",
        response.status,
        response.statusText
      );
      return null;
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
    return null;
  }
}

// ::::::::::::::::::::::------------------------------------------
function completarHtml() {
  let totmaximo = 0;
  let totcalif = 0;
  let totporcien = 0;
  let numeroConPunto = 0;

  //  Agrega a la tabla un ultimo registro de Resumen General
  const elemento = [null, null, "Resumen General:", null, null, null, null];
  tablaMenuEs.push(elemento);

  tablaMenuA = tablaMenuEs;

  let tablaIndice = document.getElementById("tablaIndiceCapitulos");
  for (i = 0; i < tablaMenuA.length; i++) {
    //lineaDatosFd = tablaIndice.insertRow();
    let lineaDatosFd = tablaIndice.insertRow();

    let celdaNombre = lineaDatosFd.insertCell(-1);
    celdaNombre.textContent = tablaMenuA[i][0];

    // Crear la segunda celda (columna) como un enlace:
    // un elemento <a> con el valor de tablaMenuA[i][1]
    // como su atributo href, y luego lo agregamos como hijo de la celda de enlace (celdaEnlace).

    const celdaEnlace = lineaDatosFd.insertCell(-1);
    const enlace = document.createElement("a"); // Crear un elemento <a>
    enlace.href = tablaMenuA[i][1]; // Establecer el atributo href con el valor correspondiente
    enlace.textContent = tablaMenuA[i][2]; // Establecer el texto del enlace con el tercer elemento de la tabla
    enlace.style.textDecoration = "none";
    enlace.style.color = "blue";

    if (tablaMenuA[i][1] == "##") {
      enlace.style.color = "gray";
    }

    // Agregar el enlace como hijo de la celda
    if (i == tablaMenuA.length - 1) {
      enlace.style.fontSize = "18px"; // Cambiar el tamaño de la fuente
      enlace.style.fontWeight = "bold"; // Hacer el texto en negrita
      enlace.style.color = "black";

      celdaEnlace.style.textAlign = "center"; // Centrar el contenido horizontalmente
      celdaEnlace.style.display = "flex";
      celdaEnlace.style.justifyContent = "center";
      celdaEnlace.style.alignItems = "center";
    }
    celdaEnlace.appendChild(enlace);

    celdaMaximo = lineaDatosFd.insertCell(-1);
    if (tablaMenuA[i][3] === 0) {
      tablaMenuA[i][3] = "";
    }
    if (tablaMenuA[i][3] > 0) {
      numeroConPunto = formatearNumero(tablaMenuA[i][3]);
    } else {
      numeroConPunto = "";
    }
    celdaMaximo.textContent = numeroConPunto;
    celdaMaximo.classList.add("ajustado-derecha");
    totmaximo += tablaMenuA[i][3];

    celdaPuntos = lineaDatosFd.insertCell(-1);
    if (tablaMenuA[i][4] === 0) {
      tablaMenuA[i][4] = "";
    }
    if (tablaMenuA[i][4] > 0) {
      numeroConPunto = formatearNumero(tablaMenuA[i][4]);
    } else {
      numeroConPunto = "";
    }
    celdaPuntos.textContent = numeroConPunto;
    celdaPuntos.classList.add("ajustado-derecha");
    totcalif += Number(tablaMenuA[i][4]);

    celdaPorciento = lineaDatosFd.insertCell(-1);
    if (tablaMenuA[i][5] === 0) {
      tablaMenuA[i][5] = "";
    }
    celdaPorciento.textContent = tablaMenuA[i][5];
    celdaPorciento.classList.add("ajustado-derecha");

    celdaPDF = lineaDatosFd.insertCell(-1);
    celdaExl = lineaDatosFd.insertCell(-1);

    if (tablaMenuA[i][5] > 0) {
      // Crear el elemento <img>
      const imgPdf = document.createElement("img");

      // Establecer los atributos de la imagen
      imgPdf.src = "../img/pdf (1).png";
      imgPdf.width = 20;
      imgPdf.style.display = "block";
      imgPdf.style.margin = "0 auto";

      celdaPDF.appendChild(imgPdf); // Agregar la imagen a la celda
      imgPdf.addEventListener("click", function () {
        // Agregar el event listener para el clic
        generarPDF();
      });

    // celdaExl = lineaDatosFd.insertCell(-1);
      // Crear el elemento <img>
      const imgExl = document.createElement("img");

      // Establecer los atributos de la imagen
      imgExl.src = "../img/excel.png";
      imgExl.width = 20;
      imgExl.style.display = "block";
      imgExl.style.margin = "0 auto";

      celdaExl.appendChild(imgExl); // Agregar la imagen a la celda
      imgExl.addEventListener("click", function () {
        // Agregar el event listener para el clic
        generarExcel().catch(console.error);
      });

    } else {
      celdaPDF.textContent = "";
      celdaExl.textContent = "";
    }

    if (i == tablaMenuA.length - 1) {
      const numeroFormateadoMx = formatearNumero(totmaximo);
      celdaMaximo.textContent = numeroFormateadoMx;

      totcalif = totcalif.toFixed(2);

      const numeroFormateado = formatearNumero(totcalif);
      celdaPuntos.textContent = numeroFormateado;

      celdaPorciento.style.fontWeight = "bold"; // Hacer el texto en negrita
      if (totmaximo > 0) {
        celdaPorciento.textContent = ((totcalif / totmaximo) * 100).toFixed(2);
      } else {
        celdaPorciento.textContent = "";
      }

      if (!totcalif > 0) {
        celdaMaximo.textContent = "";
        celdaPuntos.textContent = "";
        celdaPorciento.textContent = "";
      }
    }
  }
}

// ::::::::::::::::::::::------------------------------------------
function formatearNumero(numero) {
  let partes = numero.toString().split(".");
  partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return partes.join(",");
}

recuperarRespuestas(CUIT, capitulo);

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

async function recuperarPreguntas() {
  try {
    const response = await fetch("/preguntas");
    if (response.ok) {
      const result = await response.json();
      return Array.isArray(result) ? result : []; // Asegura devolver un arreglo
    } else {
      console.error("Error al obtener las preguntas:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
    return [];
  }
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

async function obtenerDatos() {
  try {
    const response = await fetch("/preguntas");
    if (response.ok) {
      const result = await response.json();
      // Devolver directamente los datos recibidos
      return result;
    } else {
      console.error(
        "Error al obtener los datos:",
        response.status,
        response.statusText
      );
      return [];
    }
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
    return [];
  }
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

async function recuperarRespuestas(CUIT, capitulo) {
  respuestas = await obtenerRespuestas(CUIT, capitulo);
  const primerRespuesta = respuestas[0];
  direct3o4 = primerRespuesta.respuesta[0]; // saca si es tabla 1 o tabla2
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

async function obtenerRespuestas(CUIT, capitulo) {
  // leo las respuestas del CUIT para el capítulo
  try {
    const response = await fetch(`/busca-respuesta-capitulo?CUIT=${CUIT}&capitulo=${capitulo}`);
    if (response.ok) {
      const result = await response.json();
      return result.records || []; // Devuelve los registros o un arreglo vacío
    } else {
      console.error(`Sin respuesta para capitulo ${capitulo} en obtenerRespuestas`);
    }
  } catch (error) {
    console.error("Error al realizar la solicitud en obtenerRespuestas:", error);
  }
  return [];
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

async function cambiarDatos(lineToPrint) {
  if (!Array.isArray(lineToPrint)) {
    console.error("lineToPrint no es un array:", lineToPrint);
    return;
  }

  const txtResptas = await leerTextoRespuestas();
  if (!txtResptas || txtResptas.length === 0) {
    console.error("leerTextoRespuestas no devolvió resultados válidos");
    return;
  }

  const txtCheck = await leerTextoCheck();
  if (!txtCheck || txtCheck.length === 0) {
    console.error("leerTextoCheck no devolvió resultados válidos");
    return;
  }

  lineToPrint.forEach((fila) => {
    // Analiza cada fila del PDF (que es cada pregunta)
    // selecciona la respuesta que tiene los valores de la seccion
    // la seccion que se busca es la de la pregunta procesada (fila)
    const respuesta = respuestas.find(
      (respuesta) => respuesta.seccion === fila.Seccion
    );
    const arrayRespuesta = respuesta.respuesta;
    fila.nroRpt = arrayRespuesta[fila.Numero - 1];

    switch (fila.tipo) {
      case 1:
        fila.respta = arrayRespuesta[fila.Numero - 1] == 1 ? "SI" : "NO";
        break;
      case 2:
        fila.respta = "51 a 55";
        break;
      case 3:
        fila.respta = arrayRespuesta[fila.Numero - 1];
        break;
    }

    if (fila.tipo > 40 && fila.tipo < 50) {
      let indicesCheck = 0;
      const filaCheckRptas = txtCheck.find(
        (item) => Number(item.pregunta) === fila.tipo
      );
      if (!filaCheckRptas) {
        console.log("No se encontró ninguna fila con la pregunta:", fila.tipo);
        return;
      }

      if (fila.tipo === 42 || fila.tipo === 43) {
        indicesCheck = arrayRespuesta;
      } else {
        indicesCheck = arrayRespuesta[fila.Numero - 1]; // es la respuesta para tipo 41
      }

      let textoConcatenado = "";

      indicesCheck.forEach((indice) => {
        if (indice > filaCheckRptas.textos.length) {
          console.error(
            `Índice ${indice} fuera de los límites del array valores`);
          console.log("largo filacheckrptas :  ", filaCheckRptas.textos.length);
        } else {
          textoConcatenado += filaCheckRptas.textos[indice - 1];
          textoConcatenado += "  ";
        }
      });
      fila.respta = textoConcatenado;

      let restar = 0;
      if ((fila.tipo = 41)) {
        restar = 1;
      }

      const row = listaPrecios.find(
        (item) =>
          item.tabla == direct3o4 &&
          item.capitulo === "A" &&
          item.seccion == fila.Seccion &&
          item.pregunta == fila.Numero
      );

      let precio = 0;
      indicesCheck.forEach((indice) => {
        precio += parseFloat(row.precio[indice - restar]);
      });

      fila.precio = precio;
      return;
    }

    if (fila.tipo > 50 && fila.tipo < 60) {
      const filaTxtRptas = txtResptas.find(
        (item) => item.pregunta === fila.tipo
      );
      if (!filaTxtRptas) {
        console.log("No se encontró ninguna fila con la pregunta:", fila.tipo);
      }

      const valTxtRptas = filaTxtRptas.textos;
      // el indice que da el valor de valTxtRptas es el valor de la respuesta menos 1
      // el valor de la respuesta esta en el string de respuestas arrayRespuesta
      // la posición dentro del string de arrayRespuesta es el numero de pregunta menos 1
      // el numero de pregunta es  fila.Numero

      const indArrayRespuesta = fila.Numero - 1;
      const valRespuesta = arrayRespuesta[indArrayRespuesta];
      const indValTxtRptas = valRespuesta - 1;
      fila.respta = valTxtRptas[indValTxtRptas];
    }

    if (fila.nroRpt == 9) {
      fila.respta = "No aplica";
      fila.precio = 0;
      return;
    }
    // buscar en el array de listaPrecios la fila que corresponde a tabla-capitulo-seccion-pregunta
    // obtenida la fila, tengo que sacar el precio segun el indice
    // el indice es el valor que se respondió menos 1 (si respondio 1 es la posición 0)

    const row = listaPrecios.find(
      (item) =>
        item.tabla == direct3o4 &&
        item.capitulo === "A" &&
        item.seccion == fila.Seccion &&
        item.pregunta == fila.Numero
    );

    if (row) {
      if (fila.tipo == 3) {
        // si tipo es 3, es cantidad justa y arranca con 0, no hay que restar 1
        indiceParaPrecio = fila.nroRpt;
      } else {
        indiceParaPrecio = fila.nroRpt - 1;
      }
      if (Array.isArray(row.precio) && indiceParaPrecio < row.precio.length) {
        const precio = row.precio[indiceParaPrecio];
        fila.precio = precio;
      } else {
        console.log(
          `El índice está fuera de los límites del array precio.  indice: ${indiceParaPrecio} `);
        console.log(`seccion ${fila.Seccion}, numero ${fila.Numero}`);
      }
    } else {
      console.log("no encontro la fila");
    }
  });
}

async function leerTextoRespuestas() {
  try {
    const response = await fetch(`/textorespuestas`); //('lectura tabla texto respuestas:)
    if (response.ok) {
      const result = await response.json();
      return result || []; // Devuelve los registros o un arreglo vacío
    } else {
      console.error(
        `Sin respuesta para capitulo ${capitulo} en obtenerRespuestas`
      );
    }
  } catch (error) {
    console.error(
      "Error al realizar la solicitud en leerTextoRespuestas ",
      error
    );
  }
  return [];
}

async function leerTextoCheck() {
  try {
    const response = await fetch(`/textocheck`); //('lectura tabla texto checks)
    if (response.ok) {
      const result = await response.json();
      return result || []; // Devuelve los registros o un arreglo vacío
    } else {
      console.error(`Sin respuesta para async function leerTextoCheck ()`);
    }
  } catch (error) {
    console.error("Error al realizar la solicitud en leerTextoCheck ", error);
  }
  return [];
}

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

async function generarPDF() {
  const lineToPrint = await recuperarPreguntas();
  if (Array.isArray(lineToPrint)) {
    await cambiarDatos(lineToPrint);
  } else {
    console.error("recuperarPreguntas no devolvió un arreglo:", lineToPrint);
    return;
  }

  // Inicializar jsPDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Agregar título
  const CUIT = localStorage.getItem("CUIT");
  const usuario = localStorage.getItem("nombre");

  // Agrega el score de la respuesta
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#007bff"); // Color azul brillante

  const letraCapitulo = "A"; 
  switch (letraCapitulo) {
    case "A":
      textoCapitulo = 'Gobierno Corporativo';
      break;
    case "B":
      textoCapitulo = 'Apetito de Riesgo';
      break;
    case "C":
      textoCapitulo = 'Riesgos de Mercado';
      break;
    case "D":
      textoCapitulo = 'Riesgos de Procesos';
      break;
    case "E":
      textoCapitulo = 'Situacion Financiera';
      break;
    case "F":
      textoCapitulo = 'Generación de Resultados';
      break;
  }

  const tituloPdf = (`Informe para ${localStorage.getItem('empresa')}, CUIT: ${CUIT}                                      usuario:${localStorage.getItem('nombre')} ${localStorage.getItem('apellido')}` )
    doc.text(tituloPdf, 10, 10)
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor("#0000ff"); // Color azul brillante

  const titulo2Pdf = (`Capitulo: ${textoCapitulo}`)
    doc.setFontSize(15);
    doc.setFont("helvetica", "normal");
    doc.setTextColor("#000000"); // Color azul brillante
    doc.text(titulo2Pdf, 10, 18)

    doc.setFontSize(9);
    doc.setTextColor("#0000ff"); // Color azul brillante
    doc.text(`\nS: Sección, Nro: Número`, 10, 20);

  const columnStyles = {
    Capitulo: { cellWidth: 5 },
    Seccion: { cellWidth: 5 },
    seccionRomano: { cellWidth: 5 },
    Numero: { cellWidth: 10 },
    Descrip: { cellWidth: 60 },
    tipo: { cellWidth: 10 },
    nroRpt: { cellWidth: 10 },
    respta: { cellWidth: 20 },
    precio: { cellWidth: 10 },
  };

  const columnas = [
    { title: "C", dataKey: "Capitulo" },
    { title: "S", dataKey: "Seccion" },
    { title: "S", dataKey: "seccionRomano" },
    { title: "N", dataKey: "Numero" },
    { title: "Afirmacion", dataKey: "Descrip" },
    { title: "TR", dataKey: "tipo" },
    { title: "NR", dataKey: "nroRpt" },
    { title: "Respuesta", dataKey: "respta" },
    { title: "Score", dataKey: "precio" },
  ];

  doc.autoTable({
    startY: 30,
    head: [columnas.map((col) => col.title)],
    body: lineToPrint.map((row) => columnas.map((col) => row[col.dataKey])),
    columnStyles: columnStyles,
    styles: { cellPadding: 2, fontSize: 8 },
    bodyStyles: { valign: "top" },
    theme: "grid",
    // Asegúrate de que el texto se envuelva en la celda
    didDrawCell: (data) => {
      if (data.column.dataKey === "Descrip" && data.cell.raw.length > 0) {
        const text = data.cell.raw;
        const textLines = doc.splitTextToSize(text, data.cell.width);
        doc.text(textLines, data.cell.x, data.cell.y + 2);
        data.cell.text = textLines;
      }
    },
  });

  // Guardar el PDF :  doc.save('informe.pdf');
  // Convertir el PDF a un Blob
  const pdfBlob = doc.output("blob");

  // Crear un URL para el Blob
  const pdfUrl = URL.createObjectURL(pdfBlob);

  // Mostrar el PDF en un iframe (en la misma página)
  const iframe = document.createElement("iframe");
  iframe.style.width = "100%";
  iframe.style.height = "100vh";
  iframe.src = pdfUrl;
  // document.body.appendChild(iframe);
  window.open(pdfUrl);

  for (const fila of lineToPrint) {
    const seccionNumerica = fila.Seccion ? fila.Seccion : "111"; // Añade un valor por defecto si 'Seccion' es nulo
    const datos = {
      CUIT,
      usuario,
      capitulo: fila.Capitulo,
      seccion: seccionNumerica,
      numero: fila.Numero,
      pregunta: fila.Descrip,
      respuesta: fila.respta,
      precio: fila.precio,
    };
    await grabarParciales(datos);
  }
}

// Función para escribir los detalles de movimientos en la tabla MySQL
async function grabarParciales(datos) {
  const body = {
    capitulo: datos.capitulo,
    seccion: datos.seccion,
    numero: datos.numero,
    pregunta: datos.pregunta,
    respuesta: datos.respuesta,
    parcial: datos.precio,
  };

  try {
    const response = await fetch("/grabaParciales", {
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
      throw new Error(result.error || "Error desconocido grabar parciales");
    }
  } catch (error) {
    console.log("Error:", error);
    // alert("estamos en el error (ins 2): " + error.message);
    throw error; // Rechaza la promesa en caso de error
  }
}

async function generarExcel() {
  if (confirm()) {
    // El usuario hizo clic en "Aceptar"
    console.log('Usuario aceptó.');
    window.location.href = '/descargar-excel';
    console.log('Usuario aceptó.');
    alert(('Se creará un archivo en formato Excel con el nombre "Respuestas" \n\nSe encontrará disponible en la carpeta de descargas\n\nRequiere haber generado previamente el informe en PDF '))
  } else {
    // El usuario hizo clic en "Cancelar"
    console.log('Usuario canceló.');
  }
}

