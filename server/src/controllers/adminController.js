const { Categoria, Medicamento } = require('../models/associations');

// Buscar todas as categorias
exports.getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll({ order: [['nome', 'ASC']] });
    res.json(categorias);
  } catch (error) {
    console.error('❌ Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro ao buscar categorias', details: error.message });
  }
};

// Adicionar novo medicamento
exports.adicionarMedicamento = async (req, res) => {
  const {
    nome,
    principio_ativo,
    via_administracao,
    concentracao,
    apresentacao,
    unidade_dose,
    id_categoria
  } = req.body;

  if (!nome || !via_administracao) {
    return res.status(400).json({ error: 'Nome e via de administração são obrigatórios' });
  }

  try {
    const novoMedicamento = await Medicamento.create({
      nome,
      principio_ativo,
      via_administracao,
      concentracao,
      apresentacao,
      unidade_dose,
      id_categoria
    });

    res.status(201).json({
      message: 'Medicamento adicionado com sucesso',
      medicamento: {
        id: novoMedicamento.id_medicamento,
        nome: novoMedicamento.nome,
        categoria_id: id_categoria
      }
    });
  } catch (error) {
    console.error('❌ Erro ao adicionar medicamento:', error);
    res.status(500).json({ error: 'Erro ao adicionar medicamento', details: error.message });
  }
};

// Listar medicamentos para administração
exports.listarMedicamentos = async (req, res) => {
  try {
    const medicamentos = await Medicamento.findAll({
      include: [{ model: Categoria, as: 'categoria' }],
      order: [['nome', 'ASC']]
    });

    res.json(medicamentos.map(med => ({
      id: med.id_medicamento,
      nome: med.nome,
      principio_ativo: med.principio_ativo,
      apresentacao: med.apresentacao,
      via_administracao: med.via_administracao,
      concentracao: med.concentracao,
      unidade_dose: med.unidade_dose,
      categoria: med.categoria?.nome
    })));
  } catch (error) {
    console.error('❌ Erro ao listar medicamentos:', error);
    res.status(500).json({ error: 'Erro ao listar medicamentos', details: error.message });
  }
};

// Deletar medicamento
exports.deletarMedicamento = async (req, res) => {
  const { medicamentoId } = req.params;

  try {
    const deletado = await Medicamento.destroy({ where: { id_medicamento: medicamentoId } });

    if (deletado === 0) {
      return res.status(404).json({ error: 'Medicamento não encontrado' });
    }

    res.json({ message: 'Medicamento deletado com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao deletar medicamento:', error);
    res.status(500).json({ error: 'Erro ao deletar medicamento', details: error.message });
  }
};
