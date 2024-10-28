const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');

const Evento = sequelize.define('Evento', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  start: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true, // Categoría del evento (Cita importante, Tarea administrativa, etc.)
  },
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: Usuario, // Hace referencia al modelo Usuario
      key: 'id',
    },
  },
});

module.exports = Evento;