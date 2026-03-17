const express = require("express");

module.exports = function (ai) {
  const router = express.Router();

  router.post("/ia-suggestion", async (req, res) => {
    console.log('🔍 Requisição recebida para IA:', req.body); // Debug
    
    const { symptoms } = req.body;

    if (!symptoms) {
      return res.status(400).json({ error: "Sintomas são obrigatórios" });
    }

    const prompt = `Sintomas: ${symptoms}
Você é um assistente médico, responda com um possível diagnóstico e um tratamento simples e direto. 
Foque só em remédios com quantidade de comprimidos, quantas vezes por dia, quantidade de dias.
Nada de explicações muito longas e nem negrito.
Adultos, recomende remédios comuns.
Criança, recomende remédios para crianças.
Recomende possíveis exames para auxiliar no diagnóstico.
SEPARE BEM AS INFORMAÇÕES, SEM NEGRITO.`;

    console.log('🔍 Prompt enviado:', prompt); // Debug

    try {
      // Sintaxe CORRETA para Gemini
      const response = await ai.generateContent({
        contents: [{ 
          role: "user", 
          parts: [{ text: prompt }] 
        }],
        generationConfig: {
          maxOutputTokens: 500, // Nome correto do parâmetro
          temperature: 0.1,
        }
      });

      console.log('🔍 Resposta completa da IA:', response); // Debug

      // Extrair texto da resposta
      const suggestion = response.response.text();
      
      console.log('✅ Sugestão extraída:', suggestion); // Debug

      res.json({ suggestion });
    } catch (error) {
      console.error("❌ Erro completo na API GoogleGenAI:", error);
      console.error("❌ Mensagem:", error.message);
      res.status(500).json({ error: "Erro ao gerar sugestão", details: error.message });
    }
  });

  return router;
};