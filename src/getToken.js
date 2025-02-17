const { OAuth2Client } = require('google-auth-library'); // Asegúrate de importar correctamente
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = 'https://testhexarc-production.up.railway.app/'; // Asegúrate de que esta URL sea correcta

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Generar la URL para autorizar
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: ['https://www.googleapis.com/auth/gmail.send'],
});

console.log('🔗 Abre esta URL en tu navegador para autorizar la aplicación:');
console.log(authUrl);
