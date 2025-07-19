const express = require('express');
const fetch = require('node-fetch'); // Adicione esta linha no topo!
const app = express();
const port = 3000;

// Configuração (COLE SUA CHAVE AQUI!)
const DEEPSEEK_API_KEY = "sua_chave_api_aqui";
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

// Rota principal
app.get('/', (req, res) => {
  res.send('🏥 Assistente Médico Online! Use /ask?q=sua_pergunta');
});

// Rota MÉDICA - /ask (Versão Corrigida)
app.get('/ask', async (req, res) => {
  const pergunta = req.query.q;
  
  if (!pergunta) {
    return res.send('❌ Por favor, envie uma pergunta médica usando ?q=sua_pergunta');
  }

  try {
    // Configurar o prompt médico em português BR
    const promptMedico = `Você é um especialista em medicina brasileira.
Responda de forma clara e baseada em evidências científicas atuais do Brasil.
Pergunta: ${pergunta}
Resposta:`;

    // Enviar para DeepSeek API
    const respostaApi = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: promptMedico }],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    const dados = await respostaApi.json();
    
    // Verificação EXTRA para evitar erros!
    if (!dados.choices || !dados.choices[0] || !dados.choices[0].message) {
      console.error("Resposta inesperada da API:", dados);
      return res.send('❌ Ops! A API retornou uma resposta inesperada. Tente novamente.');
    }

    const respostaMedica = dados.choices[0].message.content;

    // Enviar resposta formatada
    res.send(`
      <style>body {font-family: Arial; padding: 20px;}</style>
      <h2>❓ Pergunta:</h2>
      <blockquote>${pergunta}</blockquote>
      <h2>💡 Resposta Médica:</h2>
      <p>${respostaMedica.replace(/\n/g, '<br>')}</p>
      <hr>
      <small>Fonte: DeepSeek Medical Assistant • ${new Date().toLocaleString('pt-BR')}</small>
    `);

  } catch (erro) {
    console.error("Erro completo:", erro);
    res.send(`❌ Erro: ${erro.message || 'Ocorreu um problema inesperado'}`);
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
