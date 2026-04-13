const Categoria = require('./categoria');
const Medicamento = require('./medicamento');
const User = require('./user');
const Transcricao = require('./transcricao');

Categoria.hasMany(Medicamento, {
  foreignKey: 'id_categoria',
  as: 'medicamentos'
});

Medicamento.belongsTo(Categoria, {
  foreignKey: 'id_categoria',
  as: 'categoria'
});

User.hasMany(Transcricao, {
  foreignKey: 'user_id',
  as: 'transcricoes'
});

Transcricao.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'usuario'
});

module.exports = { Categoria, Medicamento, User, Transcricao };
