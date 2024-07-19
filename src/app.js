
// node-mysql-app/app.js

const express = require("express");
const { connection } = require("./db");
const path = require('path');

const app = express();

// Middleware para servir archivos estáticos::::::::::::::::::::::::::::::
app.use(express.static(path.join(__dirname, '/public')));

// // Ruta para servir index.html
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

app.get("/api/preguntas", (req, res) => {
  connection.query("SELECT * FROM preguntas", (err, data) => {
    if (err) {
      console.error("Error in query:", err);
      res.status(500).json({ error: "Error fetching data from database" });
      return;
    }
    res.status(200).json({
      status: "success",
      length: data.length,
      data,
    });
  });
});

app.get("/api/respuestas", (req, res) => {
  connection.query("SELECT * FROM respuestas", (err, data) => {
    if (err) {
      console.error("Error in query:", err);
      res.status(500).json({ error: "Error fetching data from database" });
      return;
    }
    res.status(200).json({
      status: "success",
      length: data.length,
      data,
    });
  });
});
app.listen(8080, () => console.log(`Server is listening on port ${8080}`));
