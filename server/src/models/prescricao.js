const { DataTypes } = require('sequelize');
const { sequelize } = require('../services/db');

const Prescricao = sequelize.define('Prescricao', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Users', key: 'id' },
  },
  patient_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  patient_age: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  symptoms: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  treatment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  ia_suggestion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'prescricoes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Prescricao;
