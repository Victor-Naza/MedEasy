const { DataTypes } = require('sequelize');
const { sequelize } = require('../services/db');

const Medicamento = sequelize.define('Medicamento', {
  id_medicamento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  principio_ativo: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  via_administracao: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  concentracao: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  apresentacao: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  unidade_dose: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  id_categoria: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'categorias',
      key: 'id_categoria'
    }
  }
}, {
  tableName: 'medicamentos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Medicamento;