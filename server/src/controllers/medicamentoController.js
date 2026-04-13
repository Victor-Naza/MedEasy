const { Categoria, Medicamento } = require('../models/associations');

// Buscar todas as categorias
exports.getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll({
      include: [{
        model: Medicamento,
        as: 'medicamentos',
        required: true
      }],
      order: [['nome', 'ASC']]
    });

    const categoriasFormatadas = categorias.map(categoria => ({
      id: categoria.id_categoria,
      nome: categoria.nome,
      icone: categoria.icone,
      cor: categoria.cor,
      quantidade_medicamentos: categoria.medicamentos.length
    }));

    res.json(categoriasFormatadas);
  } catch (error) {
    console.error('❌ Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro ao buscar categorias', details: error.message });
  }
};

// Buscar medicamentos por categoria
exports.getMedicamentosPorCategoria = async (req, res) => {
  const { categoriaId } = req.params;

  try {
    const medicamentos = await Medicamento.findAll({
      where: { id_categoria: categoriaId },
      include: [{ model: Categoria, as: 'categoria' }],
      order: [['nome', 'ASC']]
    });

    const medicamentosFormatados = medicamentos.map(med => ({
      id: med.id_medicamento,
      nome: med.nome,
      principio_ativo: med.principio_ativo,
      apresentacao: med.apresentacao,
      via_administracao: med.via_administracao,
      concentracao: med.concentracao,
      unidade_dose: med.unidade_dose,
      categoria: med.categoria?.nome
    }));

    res.json(medicamentosFormatados);
  } catch (error) {
    console.error('❌ Erro ao buscar medicamentos:', error);
    res.status(500).json({ error: 'Erro ao buscar medicamentos', details: error.message });
  }
};

// Buscar detalhes de um medicamento
exports.getMedicamentoDetalhes = async (req, res) => {
  const { medicamentoId } = req.params;

  try {
    const medicamento = await Medicamento.findByPk(medicamentoId, {
      include: [{ model: Categoria, as: 'categoria' }]
    });

    if (!medicamento) {
      return res.status(404).json({ error: 'Medicamento não encontrado' });
    }

    res.json({
      id: medicamento.id_medicamento,
      nome: medicamento.nome,
      principio_ativo: medicamento.principio_ativo,
      apresentacao: medicamento.apresentacao,
      via_administracao: medicamento.via_administracao,
      concentracao: medicamento.concentracao,
      unidade_dose: medicamento.unidade_dose,
      categoria: medicamento.categoria?.nome
    });
  } catch (error) {
    console.error('❌ Erro ao buscar detalhes do medicamento:', error);
    res.status(500).json({ error: 'Erro ao buscar detalhes do medicamento', details: error.message });
  }
};

// Busca geral de medicamentos
exports.buscarMedicamentos = async (req, res) => {
  const { termo } = req.query;
  const { Op } = require('sequelize');

  try {
    const whereClause = {};

    if (termo) {
      whereClause[Op.or] = [
        { nome: { [Op.like]: `%${termo}%` } },
        { principio_ativo: { [Op.like]: `%${termo}%` } }
      ];
    }

    const medicamentos = await Medicamento.findAll({
      where: whereClause,
      include: [{ model: Categoria, as: 'categoria' }],
      order: [['nome', 'ASC']],
      limit: 50
    });

    res.json(medicamentos.map(med => ({
      id: med.id_medicamento,
      nome: med.nome,
      principio_ativo: med.principio_ativo,
      apresentacao: med.apresentacao,
      via_administracao: med.via_administracao,
      concentracao: med.concentracao,
      categoria: med.categoria?.nome
    })));
  } catch (error) {
    console.error('❌ Erro na busca de medicamentos:', error);
    res.status(500).json({ error: 'Erro na busca de medicamentos', details: error.message });
  }
};
