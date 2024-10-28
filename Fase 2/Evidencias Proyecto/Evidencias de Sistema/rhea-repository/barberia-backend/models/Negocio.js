const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario'); 
const HorarioNegocio = require('./HorarioNegocio'); 

const Negocio = sequelize.define('Negocio', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  horario_inicio: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  horario_cierre: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  descripcion: {
    type: DataTypes.TEXT,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  logo: {
    type: DataTypes.STRING, // Ajusta según tu manejo de imágenes
  },
  categoria: {
    type: DataTypes.STRING(100),
  },
  latitud: {
    type: DataTypes.DECIMAL,
  },
  longitud: {
    type: DataTypes.DECIMAL,
  },
}, {
  timestamps: false,
  tableName: 'negocio',
});



module.exports = Negocio;
