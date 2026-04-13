const { DataTypes } = require('sequelize');
const { sequelize } = require('../services/db');
const crypto = require('crypto');

const Invite = sequelize.define('Invite', {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => crypto.randomUUID(),
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('médico'),
    defaultValue: 'médico',
    allowNull: false
  },
  token: {
    type: DataTypes.UUID,
    defaultValue: () => crypto.randomUUID(),
    unique: true,
    allowNull: false
  },
  acessado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  usado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  expira_em: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'invites',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Invite;
