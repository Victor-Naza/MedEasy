const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middlewares/authMiddleware');
const {
  transcribeAudio,
  saveTranscricao,
  listTranscricoes,
  getTranscricao,
  deleteTranscricao,
} = require('../controllers/transcriptionController');

// Garante que o diretório de uploads existe
const uploadDir = path.join(__dirname, '../../uploads/tmp');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB — limite do Whisper
});

// Transcrição de áudio (recebe arquivo, retorna texto)
router.post('/transcrever', auth, upload.single('audio'), transcribeAudio);

// CRUD de transcrições salvas
router.post('/salvar', auth, saveTranscricao);
router.get('/listar', auth, listTranscricoes);
router.get('/:id', auth, getTranscricao);
router.delete('/:id', auth, deleteTranscricao);

module.exports = router;
