const { Prescricao } = require('../models/associations');

exports.save = async (req, res) => {
  const { patient_name, patient_age, symptoms, treatment, ia_suggestion } = req.body;

  if (!patient_name || !symptoms || !treatment) {
    return res.status(400).json({ message: 'patient_name, symptoms e treatment são obrigatórios.' });
  }

  try {
    const prescricao = await Prescricao.create({
      user_id: req.userId,
      patient_name,
      patient_age: patient_age ? parseInt(patient_age, 10) : null,
      symptoms,
      treatment,
      ia_suggestion: ia_suggestion || null,
    });

    res.status(201).json(prescricao);
  } catch (error) {
    console.error('Erro ao salvar prescrição:', error.message);
    res.status(500).json({ message: 'Erro ao salvar prescrição.', details: error.message });
  }
};

exports.list = async (req, res) => {
  try {
    const prescricoes = await Prescricao.findAll({
      where: { user_id: req.userId },
      order: [['created_at', 'DESC']],
    });
    res.json(prescricoes);
  } catch (error) {
    console.error('Erro ao listar prescrições:', error.message);
    res.status(500).json({ message: 'Erro ao listar prescrições.' });
  }
};
