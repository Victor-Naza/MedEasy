const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Rotas de administração de medicamentos

// GET /api/medicamentos/admin/categorias
// Buscar todas as categorias para o formulário
router.get('/categorias', adminController.getCategorias);

// POST /api/medicamentos/admin/adicionar
// Adicionar novo medicamento
router.post('/adicionar', adminController.adicionarMedicamento);

// GET /api/medicamentos/admin/listar
// Listar todos os medicamentos para administração
router.get('/listar', adminController.listarMedicamentos);

// DELETE /api/medicamentos/admin/deletar/:medicamentoId
// Deletar um medicamento
router.delete('/deletar/:medicamentoId', adminController.deletarMedicamento);

module.exports = router;