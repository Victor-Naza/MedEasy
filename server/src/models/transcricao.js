const { DataTypes } = require('sequelize');
const { sequelize } = require('../services/db');

const Transcricao = sequelize.define(
  'Transcricao',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },
    titulo: {
      type: DataTypes.STRING(255),
      defaultValue: 'Consulta sem título',
    },
    conteudo: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    pacienteNome: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'paciente_nome',
    },
    duracaoSegundos: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'duracao_segundos',
    },
  },
  {
    tableName: 'transcricoes',
    underscored: true, // createdAt → created_at, updatedAt → updated_at
  }
);

module.exports = Transcricao;
