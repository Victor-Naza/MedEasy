const express = require('express');

// Initialize OpenAI as fallback for suggestions (if key is available)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  try {
    const { OpenAI } = require('openai');
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  } catch (err) {
    console.error('OpenAI not available for suggestions:', err.message);
  }
}

const buildPrompt = (symptoms) =>
  `Symptoms: ${symptoms}
You are a medical assistant. Respond with a possible diagnosis and a simple, direct treatment plan.
Focus on medications: number of pills, how many times a day, how many days.
No long explanations, no bold text.
For adults, recommend common medications.
For children, recommend pediatric medications.
Suggest relevant exams to assist diagnosis.
SEPARATE THE INFORMATION CLEARLY, NO BOLD TEXT.`;

// geminiModel may be null if GOOGLE_API_KEY is not set
module.exports = function (geminiModel) {
  const router = express.Router();

  router.post('/ai-suggestion', async (req, res) => {
    const { symptoms } = req.body;

    if (!symptoms) {
      return res.status(400).json({ error: 'Symptoms are required.' });
    }

    if (!geminiModel && !openai) {
      return res.status(503).json({
        error: 'No AI API configured. Add GOOGLE_API_KEY or OPENAI_API_KEY to .env.',
      });
    }

    const prompt = buildPrompt(symptoms);

    try {
      let suggestion = '';

      if (geminiModel) {
        // Gemini (primary)
        const response = await geminiModel.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 500, temperature: 0.1 },
        });
        suggestion = response.response.text();
      } else {
        // GPT (fallback)
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
      console.error('AI suggestion error:', error.message);
      res.status(500).json({ error: 'Failed to generate suggestion.', details: error.message });
    }
  });

  return router;
};
