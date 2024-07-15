const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send ('Hola, como va?');
})

app.listen(8080, () => console.log (`Server escuchando en ${8080}`));