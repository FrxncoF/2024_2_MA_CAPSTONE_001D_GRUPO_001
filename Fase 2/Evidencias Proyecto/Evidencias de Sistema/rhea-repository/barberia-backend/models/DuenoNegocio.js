const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Negocio = require('./Negocio');

const DuenoNegocio = sequelize.define('DuenoNegocio', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  id_usuario: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  id_negocio: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
}, {
  tableName: 'dueno_negocio',
  timestamps: false,
});

module.exports = DuenoNegocio;
