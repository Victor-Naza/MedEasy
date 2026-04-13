const express = require('express');

// Inicializa OpenAI como fallback para sugestões (se chave disponível)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  try {
    const { OpenAI } = require('openai');
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  } catch (e) {
    console.error('⚠️ OpenAI não disponível para sugestões:', e.message);
  }
}

const SUGGESTION_PROMPT = (symptoms) =>
  `Sintomas: ${symptoms}
Você é um assistente médico, responda com um possível diagnóstico e um tratamento simples e direto.
Foque só em remédios com quantidade de comprimidos, quantas vezes por dia, quantidade de dias.
Nada de explicações muito longas e nem negrito.
Adultos, recomende remédios comuns.
Criança, recomende remédios para crianças.
Recomende possíveis exames para auxiliar no diagnóstico.
SEPARE BEM AS INFORMAÇÕES, SEM NEGRITO.`;

// geminiModel pode ser null se GOOGLE_API_KEY não estiver configurado
module.exports = function (geminiModel) {
  const router = express.Router();

  router.post('/ia-suggestion', async (req, res) => {
    const { symptoms } = req.body;

    if (!symptoms) {
      return res.status(400).json({ error: 'Sintomas são obrigatórios' });
    }

    if (!geminiModel && !openai) {
      return res.status(503).json({
        error: 'Nenhuma API de IA configurada. Adicione GOOGLE_API_KEY ou OPENAI_API_KEY no .env.',
      });
    }

    const prompt = SUGGESTION_PROMPT(symptoms);

    try {
      let suggestion = '';

      if (geminiModel) {
        // ── Gemini (primário) ─────────────────────────────────
        const response = await geminiModel.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 500, temperature: 0.1 },
        });
        suggestion = response.response.text();
      } else {
        // ── GPT (fallback) ────────────────────────────────────
        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500,
          temperature: 0.1,
        });
        suggestion = response.choices[0].message.content ?? '';
      }

      res.json({ suggestion });
    } catch (error) {
      console.error('Erro na sugestão IA:', error.message);
      res.status(500).json({ error: 'Erro ao gerar sugestão', details: error.message });
    }
  });

  return router;
};
