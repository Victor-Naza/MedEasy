const { Categoria, Medicamento, Posologia } = require('../models/associations');

// Buscar todas as categorias por faixa etária
exports.getCategoriasPorFaixaEtaria = async (req, res) => {
  console.log('🔍 Buscando categorias por faixa etária:', req.params.faixaEtaria);
  
  const { faixaEtaria } = req.params;

  try {
    const categorias = await Categoria.findAll({
      include: [{
        model: Medicamento,
        as: 'medicamentos',
        include: [{
          model: Posologia,
          as: 'posologias',
          where: { faixa_etaria: faixaEtaria },
          required: true
        }],
        required: true
      }],
      order: [['nome', 'ASC']]
    });

    // Formatar resposta para o frontend
    const categoriasFormatadas = categorias.map(categoria => ({
      id: categoria.id_categoria,
      nome: categoria.nome,
      icone: categoria.icone,
      cor: categoria.cor,
      quantidade_medicamentos: categoria.medicamentos.length
    }));

    console.log('✅ Categorias encontradas:', categoriasFormatadas.length);
    res.json(categoriasFormatadas);
  } catch (error) {
    console.error('❌ Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro ao buscar categorias', details: error.message });
  }
};

// Buscar medicamentos por categoria e faixa etária
exports.getMedicamentosPorCategoria = async (req, res) => {
  console.log('🔍 Buscando medicamentos:', req.params);
  
  const { categoriaId, faixaEtaria } = req.params;

  try {
    const medicamentos = await Medicamento.findAll({
      where: { id_categoria: categoriaId },
      include: [{
        model: Posologia,
        as: 'posologias',
        where: { faixa_etaria: faixaEtaria },
        required: true
      }, {
        model: Categoria,
        as: 'categoria'
      }],
      order: [['nome', 'ASC']]
    });

    // Formatar resposta para o frontend
    const medicamentosFormatados = medicamentos.map(med => ({
      id: med.id_medicamento,
      nome: med.nome,
      principio_ativo: med.principio_ativo,
      apresentacao: med.apresentacao,
      vias: [med.via_administracao],
      concentracao: med.concentracao,
      unidade_dose: med.unidade_dose,
      posologias: med.posologias.map(pos => ({
        id: pos.id_posologia,
        dose_mg_kg_min: pos.dose_mg_kg_min,
        dose_mg_kg_max: pos.dose_mg_kg_max,
        frequencia_dia: pos.frequencia_dia,
        dose_max_mg_dia: pos.dose_max_mg_dia,
        formula_calculo: pos.formula_calculo,
        observacoes: pos.observacoes,
        faixa_idade_min_meses: pos.faixa_idade_min_meses,
        faixa_idade_max_meses: pos.faixa_idade_max_meses
      }))
    }));

    console.log('✅ Medicamentos encontrados:', medicamentosFormatados.length);
    res.json(medicamentosFormatados);
  } catch (error) {
    console.error('❌ Erro ao buscar medicamentos:', error);
    res.status(500).json({ error: 'Erro ao buscar medicamentos', details: error.message });
  }
};

// Buscar detalhes de um medicamento específico
exports.getMedicamentoDetalhes = async (req, res) => {
  console.log('🔍 Buscando detalhes do medicamento:', req.params.medicamentoId);
  
  const { medicamentoId, faixaEtaria } = req.params;

  try {
    const medicamento = await Medicamento.findByPk(medicamentoId, {
      include: [{
        model: Posologia,
        as: 'posologias',
        where: { faixa_etaria: faixaEtaria }
      }, {
        model: Categoria,
        as: 'categoria'
      }]
    });

    if (!medicamento) {
      return res.status(404).json({ error: 'Medicamento não encontrado' });
    }

    // Pegar a posologia principal (primeira encontrada)
    const posologiaPrincipal = medicamento.posologias[0];
    
    const medicamentoFormatado = {
      id: medicamento.id_medicamento,
      nome: medicamento.nome,
      principio_ativo: medicamento.principio_ativo,
      apresentacao: medicamento.apresentacao,
      vias: [medicamento.via_administracao],
      concentracao: medicamento.concentracao,
      unidade_dose: medicamento.unidade_dose,
      // Para compatibilidade com o frontend atual
      dosePorKg: posologiaPrincipal?.dose_mg_kg_min || posologiaPrincipal?.dose_mg_kg_max || 0,
      unidade: 'mg/kg/dose',
      observacoes: posologiaPrincipal?.observacoes || '',
      categoria: medicamento.categoria?.nome,
      posologias: medicamento.posologias
    };

    console.log('✅ Detalhes do medicamento encontrados');
    res.json(medicamentoFormatado);
  } catch (error) {
    console.error('❌ Erro ao buscar detalhes do medicamento:', error);
    res.status(500).json({ error: 'Erro ao buscar detalhes do medicamento', details: error.message });
  }
};

// Calcular dosagem
exports.calcularDosagem = async (req, res) => {
  console.log('🔍 Calculando dosagem:', req.body);
  
  const { medicamentoId, faixaEtaria, peso, idadeMeses } = req.body;

  try {
    const medicamento = await Medicamento.findByPk(medicamentoId, {
      include: [{
        model: Posologia,
        as: 'posologias',
        where: { faixa_etaria: faixaEtaria }
      }]
    });

    if (!medicamento) {
      return res.status(404).json({ error: 'Medicamento não encontrado' });
    }

    // Encontrar posologia adequada para a idade (se especificada)
    let posologiaAdequada = medicamento.posologias[0];
    
    if (idadeMeses) {
      posologiaAdequada = medicamento.posologias.find(pos => {
        const idadeMin = pos.faixa_idade_min_meses || 0;
        const idadeMax = pos.faixa_idade_max_meses || 999999;
        return idadeMeses >= idadeMin && idadeMeses <= idadeMax;
      }) || medicamento.posologias[0];
    }

    // Calcular dose
    const pesoNum = parseFloat(peso);
    let doseCalculada = 0;
    let unidadeCalculo = 'mg';
    
    if (posologiaAdequada.formula_calculo) {
      // Se tem fórmula personalizada, usar ela
      try {
        const formula = posologiaAdequada.formula_calculo.replace(/peso_kg/g, pesoNum);
        doseCalculada = eval(formula);
      } catch (err) {
        console.error('Erro ao calcular fórmula:', err);
        doseCalculada = pesoNum * (posologiaAdequada.dose_mg_kg_min || 0);
      }
    } else {
      // Cálculo padrão: peso × dose por kg
      const dosePorKg = posologiaAdequada.dose_mg_kg_min || posologiaAdequada.dose_mg_kg_max || 0;
      doseCalculada = pesoNum * dosePorKg;
    }

    // Verificar dose máxima
    if (posologiaAdequada.dose_max_mg_dia && doseCalculada > posologiaAdequada.dose_max_mg_dia) {
      doseCalculada = posologiaAdequada.dose_max_mg_dia;
    }

    const resultado = {
      dose: Math.round(doseCalculada * 100) / 100,
      unidade: unidadeCalculo,
      frequencia_dia: posologiaAdequada.frequencia_dia,
      dose_maxima_dia: posologiaAdequada.dose_max_mg_dia,
      observacoes: posologiaAdequada.observacoes,
      medicamento: {
        nome: medicamento.nome,
        apresentacao: medicamento.apresentacao,
        concentracao: medicamento.concentracao
      }
    };

    console.log('✅ Dosagem calculada:', resultado);
    res.json(resultado);
  } catch (error) {
    console.error('❌ Erro ao calcular dosagem:', error);
    res.status(500).json({ error: 'Erro ao calcular dosagem', details: error.message });
  }
};

// Buscar medicamentos (busca geral)
exports.buscarMedicamentos = async (req, res) => {
  console.log('🔍 Busca geral de medicamentos:', req.query);
  
  const { termo, faixaEtaria } = req.query;

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
      include: [{
        model: Posologia,
        as: 'posologias',
        where: faixaEtaria ? { faixa_etaria: faixaEtaria } : {},
        required: true
      }, {
        model: Categoria,
        as: 'categoria'
      }],
      order: [['nome', 'ASC']],
      limit: 50
    });

    const medicamentosFormatados = medicamentos.map(med => ({
      id: med.id_medicamento,
      nome: med.nome,
      principio_ativo: med.principio_ativo,
      apresentacao: med.apresentacao,
      categoria: med.categoria?.nome,
      faixa_etaria: med.posologias[0]?.faixa_etaria
    }));

    console.log('✅ Medicamentos encontrados na busca:', medicamentosFormatados.length);
    res.json(medicamentosFormatados);
  } catch (error) {
    console.error('❌ Erro na busca de medicamentos:', error);
    res.status(500).json({ error: 'Erro na busca de medicamentos', details: error.message });
  }
};