const { DataTypes } = require('sequelize');
const { sequelize } = require('../services/db');

const Posologia = sequelize.define('Posologia', {
  id_posologia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_medicamento: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'medicamentos',
      key: 'id_medicamento'
    }
  },
  faixa_etaria: {
    type: DataTypes.ENUM('pediatrico', 'adulto'),
    allowNull: false
  },
  faixa_idade_min_meses: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  faixa_idade_max_meses: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  dose_mg_kg_min: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  dose_mg_kg_max: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  frequencia_dia: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  dose_max_mg_dia: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true
  },
  formula_calculo: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'posologias',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Posologia;