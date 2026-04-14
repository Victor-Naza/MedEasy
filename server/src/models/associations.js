const Categoria = require('./categoria');
const Medicamento = require('./medicamento');
const User = require('./user');
const Transcription = require('./transcription');
const Prescricao = require('./prescricao');

Categoria.hasMany(Medicamento, {
  foreignKey: 'id_categoria',
  as: 'medicamentos',
});

Medicamento.belongsTo(Categoria, {
  foreignKey: 'id_categoria',
  as: 'categoria',
});

User.hasMany(Transcription, {
  foreignKey: 'user_id',
  as: 'transcriptions',
});

Transcription.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

User.hasMany(Prescricao, { foreignKey: 'user_id', as: 'prescricoes' });
Prescricao.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = { Categoria, Medicamento, User, Transcription, Prescricao };
