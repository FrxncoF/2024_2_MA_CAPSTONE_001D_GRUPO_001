// backend/models/DisponibilidadEmpleado.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');

const DisponibilidadEmpleado = sequelize.define('Disponibilidad_Empleado', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  id_usuario: {
    type: DataTypes.BIGINT,
    references: { 
      model: 'usuario',
      key: 'id',
    },
    allowNull: false,
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
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: false,
  tableName: 'disponibilidad_empleado',
});

module.exports = DisponibilidadEmpleado;
