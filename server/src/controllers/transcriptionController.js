const fs = require('fs');
const Transcricao = require('../models/transcricao');

// ─────────────────────────────────────────────────────────────
// Inicialização dos clientes de IA
// ─────────────────────────────────────────────────────────────
let openai = null;
if (process.env.OPENAI_API_KEY) {
  const { OpenAI } = require('openai');
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

let geminiModel = null;
if (process.env.GOOGLE_API_KEY) {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    // gemini-1.5-flash aceita áudio como inline data
    geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  } catch (e) {
    console.error('⚠️ Gemini não disponível para transcrição:', e.message);
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/transcricao/transcrever
// Usa Whisper (OpenAI) como primário; Gemini como fallback.
// ─────────────────────────────────────────────────────────────
async function transcribeAudio(req, res) {
  if (!openai && !geminiModel) {
    return res.status(503).json({
      error:
        'Nenhuma API de transcrição configurada. Adicione OPENAI_API_KEY e/ou GOOGLE_API_KEY no .env.',
    });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo de áudio enviado.' });
  }

  const filePath = req.file.path;

  try {
    let text = '';
    let engine = '';

    if (openai) {
      // ── Whisper (OpenAI) ──────────────────────────────────
      engine = 'whisper-1';
      const result = await openai.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: 'whisper-1',
        language: 'pt',
        response_format: 'text',
      });
      text = typeof result === 'string' ? result : result.text ?? '';
    } else {
      // ── Gemini fallback ───────────────────────────────────
      engine = 'gemini-1.5-flash';
      const audioData = fs.readFileSync(filePath);
      const base64Audio = audioData.toString('base64');
      const mimeType = req.file.mimetype || 'audio/webm';

      const geminiResult = await geminiModel.generateContent([
        {
          inlineData: { mimeType, data: base64Audio },
        },
        {
          text:
            'Transcreva exatamente o que está sendo falado neste áudio em português. ' +
            'Inclua apenas o texto transcrito, sem comentários adicionais.',
        },
      ]);
      text = geminiResult.response.text().trim();
    }

    res.json({ text, engine });
  } catch (error) {
    console.error(`Erro na transcrição (${openai ? 'Whisper' : 'Gemini'}):`, error);
    res.status(500).json({ error: `Erro ao transcrever: ${error.message}` });
  } finally {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/transcricao/salvar
// ─────────────────────────────────────────────────────────────
async function saveTranscricao(req, res) {
  const { titulo, conteudo, pacienteNome, duracaoSegundos } = req.body;

  if (!conteudo || !conteudo.trim()) {
    return res.status(400).json({ error: 'O conteúdo da transcrição é obrigatório.' });
  }

  try {
    const transcricao = await Transcricao.create({
      userId: req.userId,
      titulo: titulo?.trim() || 'Consulta sem título',
      conteudo: conteudo.trim(),
      pacienteNome: pacienteNome?.trim() || null,
      duracaoSegundos: duracaoSegundos || 0,
    });

    res.status(201).json(transcricao);
  } catch (error) {
    console.error('Erro ao salvar transcrição:', error);
    res.status(500).json({ error: 'Erro ao salvar transcrição.' });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/transcricao/listar
// ─────────────────────────────────────────────────────────────
async function listTranscricoes(req, res) {
  try {
    const transcricoes = await Transcricao.findAll({
      where: { userId: req.userId },
      order: [['created_at', 'DESC']],
      attributes: ['id', 'titulo', 'pacienteNome', 'duracaoSegundos', 'createdAt'],
    });
    res.json(transcricoes);
  } catch (error) {
    console.error('Erro ao listar transcrições:', error);
    res.status(500).json({ error: 'Erro ao listar transcrições.' });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/transcricao/:id
// ─────────────────────────────────────────────────────────────
async function getTranscricao(req, res) {
  try {
    const transcricao = await Transcricao.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!transcricao) {
      return res.status(404).json({ error: 'Transcrição não encontrada.' });
    }

    res.json(transcricao);
  } catch (error) {
    console.error('Erro ao buscar transcrição:', error);
    res.status(500).json({ error: 'Erro ao buscar transcrição.' });
  }
}

// ─────────────────────────────────────────────────────────────
// DELETE /api/transcricao/:id
// ─────────────────────────────────────────────────────────────
async function deleteTranscricao(req, res) {
  try {
    const deleted = await Transcricao.destroy({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Transcrição não encontrada.' });
    }

    res.json({ message: 'Transcrição excluída com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir transcrição:', error);
    res.status(500).json({ error: 'Erro ao excluir transcrição.' });
  }
}

module.exports = {
  transcribeAudio,
  saveTranscricao,
  listTranscricoes,
  getTranscricao,
  deleteTranscricao,
};
