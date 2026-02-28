const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let scores = [];

// Guardar score
app.post("/save-score", (req, res) => {
  const { score } = req.body;

  if (typeof score === "number") {
    scores.push(score);
    // Ordenar de mayor a menor y mantener solo los 10 mejores
    scores.sort((a, b) => b - a);
    scores = scores.slice(0, 10);
    console.log("Score guardado:", score);
  } else {
    console.log("Error: El score no es un número");
  }

  res.json({ message: "Score guardado con éxito" });
});

// Obtener ranking
app.get("/scores", (req, res) => {
  res.json(scores);
});

// Usamos el puerto 5000 para no chocar con React (que usa el 3000)
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});