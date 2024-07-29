const cron = require('node-cron');
const sendMail = require('./mailer');

// Configura la tarea para que se ejecute todos los días a las 8:00 AM
cron.schedule('53 15 * * *', async () => {
  try {
    console.log('Iniciando proceso batch para enviar correos electrónicos...');

    // Obtén las cuentas de correo electrónico desde tu proceso asociado
    const emailAccounts = await obtenerCuentasDeCorreo();

    // Envía correos electrónicos a las cuentas obtenidas
    emailAccounts.forEach(account => {
      sendMail(account.email, 'Asunto del Correo', 'Contenido del Correo');
    });

    console.log('Correos electrónicos enviados con éxito.');
  } catch (error) {
    console.error(`Error en el proceso batch: ${error}`);
  }
});

// Función ficticia para obtener las cuentas de correo electrónico
async function obtenerCuentasDeCorreo() {
  // Aquí deberías implementar la lógica para obtener las cuentas de correo electrónico desde tu base de datos u otra fuente
  return [
    { email: 'ruben.e.garcia@gmail.com' },
    { email: 'rgarcia@consejo.org.ar' }
  ];
}


/* //
La estructura del horario en node-cron sigue el formato de cron jobs de Unix, que consta de cinco campos separados por espacios. Cada campo especifica un valor para un aspecto diferente del tiempo. La estructura es la siguiente:

* * * * *
| | | | |
| | | | +---- Día de la semana (0 - 7) (Domingo es 0 o 7)
| | | +------ Mes (1 - 12)
| | +-------- Día del mes (1 - 31)
| +---------- Hora (0 - 23)
+------------ Minuto (0 - 59)

El significado de cada campo es:

Minuto (0): El trabajo se ejecutará en el minuto 0 de la hora especificada.
Hora (8): El trabajo se ejecutará a las 8 AM.
Día del mes (*): El trabajo se ejecutará todos los días del mes.
Mes (*): El trabajo se ejecutará todos los meses.
Día de la semana (*): El trabajo se ejecutará todos los días de la semana.
En resumen, cron.schedule('0 8 * * *', ...) configurará una tarea para que se ejecute todos los días a las 8:00 AM.

Aquí tienes algunos ejemplos adicionales para diferentes horarios:

Todos los días a la medianoche:
cron.schedule('0 0 * * *', () => {

Cada hora, en el minuto 30:   
cron.schedule('30 * * * *', () => {
    

    
    Aquí tienes algunos ejemplos adicionales para diferentes horarios:
    
    Todos los días a la medianoche:

    cron.schedule('0 0 * * *', () => {

    Cada hora, en el minuto 30:
    cron.schedule('30 * * * *', () => {


    Todos los lunes a las 9:00 AM:
    cron.schedule('0 9 * * 1', () => {

    El primer día de cada mes a la medianoche:    
    cron.schedule('0 0 1 * *', () => {*/
