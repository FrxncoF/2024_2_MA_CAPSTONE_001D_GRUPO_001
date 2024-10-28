// models/Servicio.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Negocio = require('./Negocio');

const Servicio = sequelize.define('Servicio', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  duracion: {
    type: DataTypes.INTEGER, // duración en minutos
    allowNull: false,
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  categoria: {
    type: DataTypes.STRING(50),
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  id_negocio: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
}, {
  tableName: 'servicio',
  timestamps: false,
});

module.exports = Servicio;
