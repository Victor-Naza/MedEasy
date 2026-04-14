const fs = require('fs');
const Transcription = require('../models/transcription');

// Initialize AI clients
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
    // gemini-1.5-flash supports audio as inline data
    geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  } catch (err) {
    console.error('Gemini not available for transcription:', err.message);
  }
}

// POST /api/transcription/transcribe
// Uses Whisper (OpenAI) as primary; Gemini as fallback.
async function transcribeAudio(req, res) {
  if (!openai && !geminiModel) {
    return res.status(503).json({
      error: 'No transcription API configured. Add OPENAI_API_KEY and/or GOOGLE_API_KEY to .env.',
    });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No audio file provided.' });
  }

  const filePath = req.file.path;

  // Whisper infere o formato pelo nome do arquivo — renomeia com a extensão correta
  const mimeToExt = {
    'audio/webm': 'webm',
    'audio/ogg': 'ogg',
    'audio/wav': 'wav',
    'audio/wave': 'wav',
    'audio/mp4': 'mp4',
    'audio/mpeg': 'mp3',
    'audio/mp3': 'mp3',
    'audio/flac': 'flac',
  };
  const mime = (req.file.mimetype || 'audio/webm').split(';')[0].toLowerCase();
  const ext = mimeToExt[mime] || 'webm';
  const namedPath = `${filePath}.${ext}`;
  fs.renameSync(filePath, namedPath);

  try {
    let text = '';
    let engine = '';

    if (openai) {
      // Whisper (OpenAI)
      engine = 'whisper-1';
      const result = await openai.audio.transcriptions.create({
        file: fs.createReadStream(namedPath),
        model: 'whisper-1',
        language: 'pt',
        response_format: 'text',
      });
      text = typeof result === 'string' ? result : (result.text ?? '');
    } else {
      // Gemini fallback
      engine = 'gemini-1.5-flash';
      const audioData = fs.readFileSync(namedPath);
      const base64Audio = audioData.toString('base64');
      const mimeType = req.file.mimetype || 'audio/webm';

      const geminiResult = await geminiModel.generateContent([
        { inlineData: { mimeType, data: base64Audio } },
        {
          text:
            'Transcribe exactly what is being said in this audio in Portuguese. ' +
            'Include only the transcribed text, no additional comments.',
        },
      ]);
      text = geminiResult.response.text().trim();
    }

    res.json({ text, engine });
  } catch (error) {
    console.error(`Transcription error (${openai ? 'Whisper' : 'Gemini'}):`, error);
    res.status(500).json({ error: `Transcription failed: ${error.message}` });
  } finally {
    if (fs.existsSync(namedPath)) fs.unlinkSync(namedPath);
  }
}

// POST /api/transcription/save
async function saveTranscription(req, res) {
  const { title, content, patientName, durationSeconds } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Transcription content is required.' });
  }

  try {
    const record = await Transcription.create({
      userId: req.userId,
      title: title?.trim() || 'Untitled consultation',
      content: content.trim(),
      patientName: patientName?.trim() || null,
      durationSeconds: durationSeconds || 0,
    });

    res.status(201).json(record);
  } catch (error) {
    console.error('Failed to save transcription:', error);
    res.status(500).json({ error: 'Failed to save transcription.' });
  }
}

// GET /api/transcription/list
async function listTranscriptions(req, res) {
  try {
    const records = await Transcription.findAll({
      where: { userId: req.userId },
      order: [['created_at', 'DESC']],
      attributes: ['id', 'title', 'patientName', 'durationSeconds', 'createdAt'],
    });
    res.json(records);
  } catch (error) {
    console.error('Failed to list transcriptions:', error);
    res.status(500).json({ error: 'Failed to list transcriptions.' });
  }
}

// GET /api/transcription/:id
async function getTranscription(req, res) {
  try {
    const record = await Transcription.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!record) {
      return res.status(404).json({ error: 'Transcription not found.' });
    }

    res.json(record);
  } catch (error) {
    console.error('Failed to get transcription:', error);
    res.status(500).json({ error: 'Failed to get transcription.' });
  }
}

// DELETE /api/transcription/:id
async function deleteTranscription(req, res) {
  try {
    const deleted = await Transcription.destroy({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Transcription not found.' });
    }

    res.json({ message: 'Transcription deleted successfully.' });
  } catch (error) {
    console.error('Failed to delete transcription:', error);
    res.status(500).json({ error: 'Failed to delete transcription.' });
  }
}

module.exports = {
  transcribeAudio,
  saveTranscription,
  listTranscriptions,
  getTranscription,
  deleteTranscription,
};
