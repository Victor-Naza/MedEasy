const Categoria = require('./categoria');
const Medicamento = require('./medicamento');

Categoria.hasMany(Medicamento, {
  foreignKey: 'id_categoria',
  as: 'medicamentos'
});

Medicamento.belongsTo(Categoria, {
  foreignKey: 'id_categoria',
  as: 'categoria'
});

module.exports = { Categoria, Medicamento };
