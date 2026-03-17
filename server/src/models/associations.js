const Categoria = require('./categoria');
const Medicamento = require('./medicamento');
const Posologia = require('./posologia');

// Definir associações
Categoria.hasMany(Medicamento, {
  foreignKey: 'id_categoria',
  as: 'medicamentos'
});

Medicamento.belongsTo(Categoria, {
  foreignKey: 'id_categoria',
  as: 'categoria'
});

Medicamento.hasMany(Posologia, {
  foreignKey: 'id_medicamento',
  as: 'posologias'
});

Posologia.belongsTo(Medicamento, {
  foreignKey: 'id_medicamento',
  as: 'medicamento'
});

module.exports = {
  Categoria,
  Medicamento,
  Posologia
};