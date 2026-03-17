const { DataTypes } = require('sequelize');
const { sequelize } = require('../services/db');

const Categoria = sequelize.define('Categoria', {
  id_categoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  icone: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  cor: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
}, {
  tableName: 'categorias',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Categoria;