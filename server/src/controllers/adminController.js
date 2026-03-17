const { Categoria, Medicamento, Posologia } = require('../models/associations');

// Buscar todas as categorias para o admin
exports.getCategorias = async (req, res) => {
  try {
    console.log('🔍 Admin buscando categorias');
    
    const categorias = await Categoria.findAll({
      order: [['nome', 'ASC']]
    });

    console.log('✅ Categorias encontradas para admin:', categorias.length);
    res.json(categorias);
  } catch (error) {
    console.error('❌ Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro ao buscar categorias', details: error.message });
  }
};

// Adicionar novo medicamento
exports.adicionarMedicamento = async (req, res) => {
  console.log('🔍 Admin adicionando medicamento:', req.body);
  
  const {
    nome,
    principio_ativo,
    via_administracao,
    concentracao,
    apresentacao,
    unidade_dose,
    id_categoria,
    faixa_etaria,
    dose_mg_kg_min,
    dose_mg_kg_max,
    frequencia_dia,
    dose_max_mg_dia,
    observacoes
  } = req.body;

  // Validações básicas
  if (!nome || !apresentacao) {
    return res.status(400).json({ 
      error: 'Nome e apresentação são obrigatórios' 
    });
  }

  if (!dose_mg_kg_min && !dose_mg_kg_max) {
    return res.status(400).json({ 
      error: 'Pelo menos uma dose deve ser definida' 
    });
  }

  try {
    // Iniciar transação
    const sequelize = require('../services/db').sequelize;
    const transaction = await sequelize.transaction();

    try {
      // 1. Criar o medicamento
      console.log('🔍 Criando medicamento...');
      const novoMedicamento = await Medicamento.create({
        nome,
        principio_ativo,
        via_administracao,
        concentracao,
        apresentacao,
        unidade_dose,
        id_categoria
      }, { transaction });

      console.log('✅ Medicamento criado com ID:', novoMedicamento.id_medicamento);

      // 2. Criar a posologia
      console.log('🔍 Criando posologia...');
      const novaPosologia = await Posologia.create({
        id_medicamento: novoMedicamento.id_medicamento,
        faixa_etaria,
        dose_mg_kg_min: dose_mg_kg_min || null,
        dose_mg_kg_max: dose_mg_kg_max || null,
        frequencia_dia: frequencia_dia || null,
        dose_max_mg_dia: dose_max_mg_dia || null,
        observacoes: observacoes || null
      }, { transaction });

      console.log('✅ Posologia criada com ID:', novaPosologia.id_posologia);

      // Commit da transação
      await transaction.commit();

      console.log('✅ Medicamento adicionado com sucesso!');
      res.status(201).json({
        message: 'Medicamento adicionado com sucesso',
        medicamento: {
          id: novoMedicamento.id_medicamento,
          nome: novoMedicamento.nome,
          faixa_etaria,
          categoria_id: id_categoria
        }
      });

    } catch (error) {
      // Rollback em caso de erro
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    console.error('❌ Erro ao adicionar medicamento:', error);
    res.status(500).json({ 
      error: 'Erro ao adicionar medicamento', 
      details: error.message 
    });
  }
};

// Listar medicamentos para administração
exports.listarMedicamentos = async (req, res) => {
  try {
    console.log('🔍 Admin listando medicamentos');
    
    const medicamentos = await Medicamento.findAll({
      include: [
        {
          model: Categoria,
          as: 'categoria'
        },
        {
          model: Posologia,
          as: 'posologias'
        }
      ],
      order: [['nome', 'ASC']]
    });

    const medicamentosFormatados = medicamentos.map(med => ({
      id: med.id_medicamento,
      nome: med.nome,
      principio_ativo: med.principio_ativo,
      apresentacao: med.apresentacao,
      categoria: med.categoria?.nome,
      total_posologias: med.posologias?.length || 0,
      faixas_etarias: [...new Set(med.posologias?.map(p => p.faixa_etaria) || [])]
    }));

    console.log('✅ Medicamentos listados para admin:', medicamentosFormatados.length);
    res.json(medicamentosFormatados);
  } catch (error) {
    console.error('❌ Erro ao listar medicamentos:', error);
    res.status(500).json({ error: 'Erro ao listar medicamentos', details: error.message });
  }
};

// Deletar medicamento
exports.deletarMedicamento = async (req, res) => {
  const { medicamentoId } = req.params;
  
  try {
    console.log('🔍 Admin deletando medicamento:', medicamentoId);
    
    const sequelize = require('../services/db').sequelize;
    const transaction = await sequelize.transaction();

    try {
      // 1. Deletar posologias
      await Posologia.destroy({
        where: { id_medicamento: medicamentoId },
        transaction
      });

      // 2. Deletar medicamento
      const deletado = await Medicamento.destroy({
        where: { id_medicamento: medicamentoId },
        transaction
      });

      if (deletado === 0) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Medicamento não encontrado' });
      }

      await transaction.commit();
      
      console.log('✅ Medicamento deletado com sucesso');
      res.json({ message: 'Medicamento deletado com sucesso' });

    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    console.error('❌ Erro ao deletar medicamento:', error);
    res.status(500).json({ error: 'Erro ao deletar medicamento', details: error.message });
  }
};