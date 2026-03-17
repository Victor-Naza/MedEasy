const express = require('express');
const router = express.Router();
const medicamentoController = require('../controllers/medicamentoController');

// Rotas para medicamentos

// GET /api/medicamentos/categorias/:faixaEtaria
// Buscar categorias por faixa etária (pediatrico ou adulto)
router.get('/categorias/:faixaEtaria', medicamentoController.getCategoriasPorFaixaEtaria);

// GET /api/medicamentos/categoria/:categoriaId/:faixaEtaria
// Buscar medicamentos por categoria e faixa etária
router.get('/categoria/:categoriaId/:faixaEtaria', medicamentoController.getMedicamentosPorCategoria);

// GET /api/medicamentos/:medicamentoId/:faixaEtaria
// Buscar detalhes de um medicamento específico
router.get('/:medicamentoId/:faixaEtaria', medicamentoController.getMedicamentoDetalhes);

// POST /api/medicamentos/calcular-dosagem
// Calcular dosagem de um medicamento
router.post('/calcular-dosagem', medicamentoController.calcularDosagem);

// GET /api/medicamentos/buscar
// Busca geral de medicamentos
router.get('/buscar', medicamentoController.buscarMedicamentos);

module.exports = router;