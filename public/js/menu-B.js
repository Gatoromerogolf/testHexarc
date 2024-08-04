let tablaMenuApeRie = [
  ["I.",
    "MB-1.html",
    "Valores y Comportamientos",
    ,
    ,
  ],
  ["II.",
    "MB-2.html",
    "Procesos",
    ,
    ,
  ],
  ["III.",
    "MB-3.html",
    "Circunstancias históricas",
    ,
    ,
  ],
  ["IV.",
    "MB-4.html",
    "Circunstancias actuales",
    ,
    ,
  ],
   ["",
    "##",
    "Calificación general:",
    ,
    ,
  ],
]

const apellidouser = localStorage.getItem("apellido");
const nombreUser = localStorage.getItem("nombre");
const apenom = nombreUser + ' ' + apellidouser;
const empresa = localStorage.getItem("empresa");

document.getElementById("nombreEmpresa").textContent = empresa;
document.getElementById("nombreUsuario").textContent = apenom;

// Recuperar el valor de LocalStorage
// let valorMaximo = JSON.parse(localStorage.getItem('maximo'));
// let valores = JSON.parse(localStorage.getItem('valores'));
// let valorPuntos = JSON.parse(localStorage.getItem('nuevoValor'));

for (i = 0; i < tablaMenuApeRie.length; i++) {
  tablaMenuApeRie[i][3] = 0;
  tablaMenuApeRie[i][4] = 0;
  tablaMenuApeRie[i][5] = 0;
}

tablaMenuApeRie[0][3] = JSON.parse(localStorage.getItem('maximo-ApeRie'));
tablaMenuApeRie[0][4] = JSON.parse(localStorage.getItem('valores-ApeRie'));
tablaMenuApeRie[0][5] = JSON.parse(localStorage.getItem('porciento-ApeRie'));

tablaMenuApeRie[1][3] = JSON.parse(localStorage.getItem('maximo-ApeRie-2'));
tablaMenuApeRie[1][4] = JSON.parse(localStorage.getItem('valores-ApeRie-2'));
tablaMenuApeRie[1][5] = JSON.parse(localStorage.getItem('porciento-ApeRie-2'));

tablaMenuApeRie[2][3] = JSON.parse(localStorage.getItem('maximo-ApeRie-3'));
tablaMenuApeRie[2][4] = JSON.parse(localStorage.getItem('valores-ApeRie-3'));
tablaMenuApeRie[2][5] = JSON.parse(localStorage.getItem('porciento-ApeRie-3'));

tablaMenuApeRie[3][3] = JSON.parse(localStorage.getItem('maximo-ApeRie-4'));
tablaMenuApeRie[3][4] = JSON.parse(localStorage.getItem('valores-ApeRie-4'));
tablaMenuApeRie[3][5] = JSON.parse(localStorage.getItem('porciento-ApeRie-4'));

for (i = 0; i < tablaMenuApeRie.length - 1; i++) {
  tablaMenuApeRie[4][3] += tablaMenuApeRie[i][3];
  tablaMenuApeRie[4][4] += tablaMenuApeRie[i][4];
}

if (tablaMenuApeRie[4][4] !== 0) {
  tablaMenuApeRie[4][5] = ((tablaMenuApeRie[i][4] / tablaMenuApeRie[4][3]) * 100).toFixed(2)
}

// console.log(`puntos: ${valorRecuperado} y el maximo: ${valorMaximo} y el de funcion 2 ${valorFuncion2}`);

//  llena la matriz 
let lineaDatosFd = document.getElementById("lineaMenu");

for (i = 0; i < tablaMenuApeRie.length; i++) {
  lineaDatosFd = tablaIndice.insertRow();

  let celdaNombre = lineaDatosFd.insertCell(-1);
  celdaNombre.textContent = tablaMenuApeRie[i][0];

  // Crear la segunda celda (columna) como un enlace:
  // un elemento <a> con el valor de tablaMenuA[i][1]
  // como su atributo href, y luego lo agregamos como hijo de la celda de enlace (celdaEnlace). 

  const celdaEnlace = lineaDatosFd.insertCell(-1);
  const enlace = document.createElement('a'); // Crear un elemento <a>
  enlace.href = tablaMenuApeRie[i][1]; // Establecer el atributo href con el valor correspondiente
  enlace.textContent = tablaMenuApeRie[i][2]; // Establecer el texto del enlace con el tercer elemento de la tabla
  enlace.style.textDecoration = 'none';

  if (i == tablaMenuApeRie.length-1){
    enlace.style.fontSize = '18px'; // Cambiar el tamaño de la fuente
    enlace.style.fontWeight = 'bold'; // Hacer el texto en negrita
    enlace.style.color='black';

    celdaEnlace.style.textAlign = 'center'; // Centrar el contenido horizontalmente
    celdaEnlace.style.display = 'flex';
    celdaEnlace.style.justifyContent = 'center';
    celdaEnlace.style.alignItems = 'center';
  }  

  celdaEnlace.appendChild(enlace); // Agregar el enlace como hijo de la celda

  celdaMaximo = lineaDatosFd.insertCell(-1);
  if (tablaMenuApeRie[i][3] === 0) {
    tablaMenuApeRie[i][3] = ""
  }
  celdaMaximo.textContent = tablaMenuApeRie[i][3];

  celdaPuntos = lineaDatosFd.insertCell(-1);
  if (tablaMenuApeRie[i][4] === 0) {
    tablaMenuApeRie[i][4] = ""
  }
  celdaPuntos.textContent = tablaMenuApeRie[i][4];

  celdaPorciento = lineaDatosFd.insertCell(-1);
  if (tablaMenuApeRie[i][5] === 0) {
    tablaMenuApeRie[i][5] = ""
  }
  celdaPorciento.textContent = tablaMenuApeRie[i][5];
}