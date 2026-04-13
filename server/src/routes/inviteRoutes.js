const express = require('express');
const router = express.Router();
const inviteController = require('../controllers/inviteController');
// POST /api/auth/convidar — público (sem autenticação por enquanto)
router.post('/convidar', inviteController.enviarConvite);

// GET /api/auth/convite/:token — público
router.get('/convite/:token', inviteController.validarToken);

// POST /api/auth/aceitar-convite — público
router.post('/aceitar-convite', inviteController.aceitarConvite);

module.exports = router;
