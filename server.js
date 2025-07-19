// server.js - Código Completo
const express = require('express');
const app = express();
const port = 3000;

// Configuração da API DeepSeek
const DEEPSEEK_API_KEY = "sk-ee5754b1cba24c408cece9d74c0e7942"; // 👈 COLE SUA CHAVE
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

// Rota principal
app.get('/', (req, res) => {
  res.send('🏥 Assistente Médico Online! Use /ask?q=sua_pergunta');
});

// Rota MÉDICA - /ask
app.get('/ask', async (req, res) => {
  const pergunta = req.query.q;
  
  if (!pergunta) {
    return res.send('❌ Por favor, envie uma pergunta médica usando ?q=sua_pergunta');
  }

  try {
    // Configurar o prompt médico
    const promptMedico = `Você é um especialista em medicina brasileira.
Responda de forma clara e baseada em evidências científicas atuais.
Pergunta: ${pergunta}
Resposta:`;

    // Enviar para DeepSeek API
    const resposta = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: promptMedico }],
        temperature: 0.7
      })
    });

    const dados = await resposta.json();
    
    // Enviar resposta formatada
    res.send(`
      <h2>Pergunta:</h2>
      <p>${pergunta}</p>
      <h2>Resposta Médica:</h2>
      <p>${dados.choices[0].message.content.replace(/\n/g, '<br>')}</p>
    `);

  } catch (erro) {
    res.send(`❌ Erro: ${erro.message}`);
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
