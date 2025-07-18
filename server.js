// server.js - Código Simplificado
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Meu Assistente Médico está Funcionando! 🩺');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});