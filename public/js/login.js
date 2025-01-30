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
            localStorage.setItem('username', data.user.username);
            localStorage.setItem('ingresado', data.user.ingresado); 
            localStorage.setItem('nombre', data.user.firstName);
            localStorage.setItem('apellido', data.user.lastName);
            localStorage.setItem('CUIT', data.user.CUIT);
            localStorage.setItem('empresa', data.user.empresa);
            localStorage.setItem('idioma', data.user.idioma);
            localStorage.setItem('ria', data.user.ria);
            localStorage.setItem('servicio', data.user.servicio);

            if (data.user.ingresado == 0) {
                window.location.href = '../src/Presentacion.html';
               } else {
                if (data.user.idioma == 1){
                window.location.href = '../src/continuacion.html'}
                else{
                    window.location.href = '../src/continuacion-en.html'}
                }             
            }
        else {
            console.error('Credenciales inválidas');
        }
    })
    .catch(error => {
        alert("usuario o clave invalidos");
        console.error('Error en la solicitud:', error);
    });
});
