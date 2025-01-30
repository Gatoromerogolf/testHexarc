const OpenAI = require("openai");

require("dotenv").config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });


const testConnection = async () => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Responde en 30 palabras: ¿qué es la IA?" }],
        max_tokens: 50, // Limita el número de tokens
      });
      console.log("Respuesta de OpenAI:", response.choices[0].message.content);
    } catch (error) {
      console.error("Error al conectar con la API:", error.message);
    }
  };
  
testConnection();
  

