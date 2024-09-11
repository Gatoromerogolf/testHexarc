document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const userId = document.getElementById('userId').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('updateForm').style.display = 'block';
        } else {
            document.getElementById('loginError').textContent = 'Usuario o clave incorrecta.';
        }
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('updateForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const organization = document.getElementById('organization').value;
    const cuit = document.getElementById('cuit').value;
    const email = document.getElementById('email').value;
    const ria = document.getElementById('ria').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const username = document.getElementById('username').value;

    if (newPassword !== confirmPassword) {
        document.getElementById('updateError').textContent = 'Las claves no coinciden.';
        return;
    }

    const updatedData = { fullName, organization, cuit, email, ria, newPassword, username };

    fetch('/updateDatosUsuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Datos actualizados correctamente.');
        } else {
            document.getElementById('updateError').textContent = 'Error al actualizar los datos.';
        }
    })
    .catch(error => console.error('Error:', error));
});
