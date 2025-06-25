const readline = require("readline");
const axios = require("axios");
require("dotenv").config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// 1. Mostrar link para obtener el código
const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=https://mail.google.com/&access_type=offline&prompt=consent`;

console.log("\n🔗 Abrí este enlace en tu navegador:\n");
console.log(authUrl);
console.log("\n🔑 Luego copiá el código (code) que aparece en la URL y pegalo aquí abajo.\n");

// 2. Leer el code del usuario
rl.question("📥 Pegá el código aquí: ", async (code) => {
  try {
    // 3. Hacer POST a Google para obtener el refresh_token
    const response = await axios.post("https://oauth2.googleapis.com/token", null, {
      params: {
        code: code.trim(),
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      },
    });

    console.log("\n✅ Token obtenido correctamente:\n");
    console.log(response.data);
    console.log("\n🔐 Guardá el refresh_token en tu .env:\n");
    console.log(`REFRESH_TOKEN=${response.data.refresh_token}`);
  } catch (error) {
    console.error("❌ Error al obtener el token:", error.response?.data || error.message);
  } finally {
    rl.close();
  }
});
