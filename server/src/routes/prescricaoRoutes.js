const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { save, list } = require('../controllers/prescricaoController');

router.post('/', auth, save);
router.get('/', auth, list);

module.exports = router;
