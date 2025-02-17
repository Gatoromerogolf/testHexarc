const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = 'https://testhexarc-production.up.railway.app/';

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

async function getAccessToken() {
    const code = '4/0ASVgi3JLk3gNDCFLERzpgSKBHIQsAh6mzPHfBB8Fz4CipqCg9VyTKhR69FL0ApRPfWILnA'; // Reemplázalo con el código obtenido
    const { tokens } = await oauth2Client.getToken(code);
    
    console.log('✅ Tokens obtenidos:');
    console.log(tokens);
  
    // Guarda los tokens en un archivo .env o en la base de datos
  }
  
getAccessToken().catch(console.error);
