const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Negocio = require('./Negocio');

const EmpleadoNegocio = sequelize.define('EmpleadoNegocio', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  id_usuario: {
    type: DataTypes.BIGINT,
    references: {
      model: Usuario,
      key: 'id',
    },
    allowNull: false,
  },
  id_negocio: {
    type: DataTypes.BIGINT,
    references: {
      model: Negocio,
      key: 'id',
    },
    allowNull: false,
  },
  
}, {
  tableName: 'empleado_negocio',
  timestamps: false,
});

module.exports = EmpleadoNegocio;
