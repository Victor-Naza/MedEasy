const express = require('express');
const { Op } = require('sequelize');
const { Medicamento, Categoria } = require('../models/associations');

let openai = null;
if (process.env.OPENAI_API_KEY) {
  try {
    const { OpenAI } = require('openai');
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  } catch (err) {
    console.error('OpenAI not available for suggestions:', err.message);
  }
}

const buildPrompt = (symptoms, patientAge, medicationList) =>
  `Você é um assistente médico de apoio à decisão clínica.

Paciente: ${patientAge ? patientAge + ' anos' : 'idade não informada'}
Sintomas: ${symptoms}

MEDICAMENTOS DISPONÍVEIS - Fortaleza):
${medicationList}

INSTRUÇÕES:
- Sugira um diagnóstico provável baseado nos sintomas.
- Recomende PELO MENOS 2 e no máximo 5 medicamentos EXCLUSIVAMENTE da lista acima.
- Para cada medicamento informe posologia detalhada (dose, frequência e duração) e justificativa clínica.
- Sugira exames complementares relevantes.
- Responda SOMENTE com JSON válido, sem markdown, sem texto adicional.

Formato obrigatório:
{
  "diagnostico": "...",
  "medicamentos": [
    { "nome": "nome exato como aparece na lista", "posologia": "dose – frequência – duração", "justificativa": "..." }
  ],
  "exames": "..."
}`;

module.exports = function (geminiModel) {
  const router = express.Router();

  router.post('/ai-suggestion', async (req, res) => {
    const { symptoms, patientAge } = req.body;

    if (!symptoms) {
      return res.status(400).json({ error: 'Symptoms are required.' });
    }

    if (!geminiModel && !openai) {
      return res.status(503).json({
        error: 'No AI API configured. Add GOOGLE_API_KEY or OPENAI_API_KEY to .env.',
      });
    }

    try {
      // Busca medicamentos do banco (exclui insumos sem via de administração clínica)
      const medicamentos = await Medicamento.findAll({
        include: [{ model: Categoria, as: 'categoria', attributes: ['nome'] }],
        where: { via_administracao: { [Op.ne]: 'N/A' } },
        attributes: ['nome', 'concentracao', 'apresentacao', 'via_administracao'],
        order: [['nome', 'ASC']],
      });

      const medicationList = medicamentos
        .map(m => `${m.nome}${m.concentracao ? ' ' + m.concentracao : ''} – ${m.apresentacao || ''}`)
        .join('\n');

      const prompt = buildPrompt(symptoms, patientAge, medicationList);

      let rawResponse = '';

      if (geminiModel) {
        const response = await geminiModel.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 1000, temperature: 0.1 },
        });
        rawResponse = response.response.text();
      } else {
        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
          temperature: 0.1,
        });
        rawResponse = response.choices[0].message.content ?? '';
      }

      // Limpa possível markdown e faz parse do JSON
      let parsed;
      try {
        const cleaned = rawResponse.replace(/```json\n?|\n?```/g, '').trim();
        parsed = JSON.parse(cleaned);
      } catch {
        // Se falhar o parse, retorna o texto bruto sem medicamentos estruturados
        return res.json({ suggestion: rawResponse, medications: [] });
      }

      // Enriquece as recomendações com dados do banco
      const recommendations = parsed.medicamentos || [];
      const names = recommendations.map(r => r.nome);

      const dbMeds = await Medicamento.findAll({
        include: [{ model: Categoria, as: 'categoria', attributes: ['nome', 'cor'] }],
        where: { nome: { [Op.in]: names } },
      });

      const medications = recommendations.map(rec => {
        const db = dbMeds.find(m => m.nome === rec.nome);
        return {
          nome: rec.nome,
          posologia: rec.posologia,
          justificativa: rec.justificativa,
          concentracao: db ? db.concentracao : null,
          apresentacao: db ? db.apresentacao : null,
          via_administracao: db ? db.via_administracao : null,
          categoria: db && db.categoria ? db.categoria.nome : null,
          cor: db && db.categoria ? db.categoria.cor : '#7C3AED',
          disponivel: !!db,
        };
      });

      const suggestion = [
        parsed.diagnostico ? `DIAGNÓSTICO PROVÁVEL\n${parsed.diagnostico}` : '',
        parsed.exames ? `\nEXAMES RECOMENDADOS\n${parsed.exames}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      res.json({ suggestion, medications });
    } catch (error) {
      console.error('AI suggestion error:', error.message);
      res.status(500).json({ error: 'Failed to generate suggestion.', details: error.message });
    }
  });

  return router;
};
