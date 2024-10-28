// backend/models/HorarioNegocio.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HorarioNegocio = sequelize.define('Horario_Negocio', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  id_negocio: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  dia_semana: {
    type: DataTypes.STRING(15),
    allowNull: false,
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  hora_fin: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: false,
  tableName: 'Horario_Negocio',
});

module.exports = HorarioNegocio;

