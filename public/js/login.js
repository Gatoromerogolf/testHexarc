document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío del formulario por defecto
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Realiza la solicitud al servidor para validar las credenciales
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login exitoso') {
            // Guardar el nombre de usuario en localStorage
            localStorage.setItem('username', username);
            localStorage.setItem('ingresado', data.user.ingresado); 
            
            // Guardar el nombre y apellido en localStorage
            localStorage.setItem('nombre', data.user.firstName);
            localStorage.setItem('apellido', data.user.lastName);
            localStorage.setItem('CUIT', data.user.CUIT);
            
            // console.log(`valores guardados: ${data.user.firstName}, ${data.user.lastName}, ${data.user.CUIT}`)
            // console.log('Valores guardados en localStorage:');
            // console.log('nombre:', localStorage.getItem('nombre'));
            // console.log('apellido:', localStorage.getItem('apellido'));
            // console.log('CUIT:', localStorage.getItem('CUIT'));
            // Login exitoso, redirige a presentacion.html

            if (data.user.ingresado == 1) {
                window.location.href = '../src/continuacion.html';
               } else {
                window.location.href = '../src/Presentacion.html';
            }
        } else {
            // Mostrar mensaje de error si las credenciales son inválidas
            console.error('Credenciales inválidas');
        }
    })
    .catch(error => {
        alert("usuario o clave invalidos");
        console.error('Error en la solicitud:', error);
    });
});

// window.location.href = "../src/presentacion.html"; 

/*
//importar librerias:::::::::::::::::::::::::::::::::::::::::::
const express = require('express');
const mysql = require('mysql2');

//objetos para llamar metodos de express::::::::::::::::::::::
const app = express();

//configuraciones :::::::::::::::::::::::::::::::::::::::::::::
// aca se indica que se utiliza un motor para ver las pantillas
app.set('view engine', 'ejs')
app.use(express.json()); // asi reconoce los objetos que vienen de las paginas
app.use(express.urlencoded({extended: false})); // para que no analice lo que recibe....

app.get('/', (req, res) => {
    res.render('login .ejs')
  })

const username = document.getElementById("username");
const clave = document.getElementById("clave");
const login = document.getElementById("login");

login.addEventListener('click', (e) => {
    e.preventDefault()
    const data = {
        username: username.value,
        password: clave.value
    }
    console.log(data)

    window.location.href = "../contenido/presentacion.html"; 
});

//     if(JSON.parse(localStorage.getItem('idioma')) == 2){
//         window.location.href = "../public/contenido/Menu-General-en.html";
//     }  else {
//         window.location.href = "../public/contenido/Menu-General.html";
//     }
// })*/
