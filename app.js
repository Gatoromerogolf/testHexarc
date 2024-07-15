
// node-mysql-app/app.js

const express = require("express");
const { connection } = require("./db");

const app = express();

app.get("/api/capitulos", (req, res) => {
  connection.query("SELECT * FROM capitulook", (err, data) => {
    if (err) return callback(err, null);
    res.status(200).json({
      status: "success",
      length: data.length,
      data,
    });
  });
});

app.listen(8080, () => console.log(`Server is listening on port ${8080}`));
