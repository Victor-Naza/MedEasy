const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middlewares/authMiddleware');
const {
  transcribeAudio,
  saveTranscription,
  listTranscriptions,
  getTranscription,
  deleteTranscription,
} = require('../controllers/transcriptionController');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads/tmp');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB — Whisper limit
});

router.post('/transcribe', auth, upload.single('audio'), transcribeAudio);
router.post('/save', auth, saveTranscription);
router.get('/list', auth, listTranscriptions);
router.get('/:id', auth, getTranscription);
router.delete('/:id', auth, deleteTranscription);

module.exports = router;
