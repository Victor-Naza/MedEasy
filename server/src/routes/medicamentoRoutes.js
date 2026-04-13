const express = require('express');
const router = express.Router();
const medicamentoController = require('../controllers/medicamentoController');

// GET /api/medicamentos/categorias
router.get('/categorias', medicamentoController.getCategorias);

// GET /api/medicamentos/categoria/:categoriaId
router.get('/categoria/:categoriaId', medicamentoController.getMedicamentosPorCategoria);

// GET /api/medicamentos/buscar
router.get('/buscar', medicamentoController.buscarMedicamentos);

// GET /api/medicamentos/:medicamentoId
router.get('/:medicamentoId', medicamentoController.getMedicamentoDetalhes);

module.exports = router;
