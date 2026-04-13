const { DataTypes } = require('sequelize');
const { sequelize } = require('../services/db');

const Transcription = sequelize.define(
  'Transcription',
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
    title: {
      type: DataTypes.STRING(255),
      defaultValue: 'Untitled consultation',
      field: 'titulo',
    },
    content: {
      type: DataTypes.TEXT,
      defaultValue: '',
      field: 'conteudo',
    },
    patientName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'paciente_nome',
    },
    durationSeconds: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'duracao_segundos',
    },
  },
  {
    tableName: 'transcricoes',
    underscored: true, // maps createdAt -> created_at, updatedAt -> updated_at
  }
);

module.exports = Transcription;
