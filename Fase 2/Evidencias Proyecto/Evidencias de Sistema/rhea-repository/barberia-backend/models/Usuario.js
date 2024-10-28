const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Negocio = require('./Negocio');
const DisponibilidadEmpleado = require('./DisponibilidadEmpleado');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  contrasena_hash : {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING(20),
  },
  cargo: {
    type: DataTypes.STRING(50),  
  },
  creado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  ultimo_login: {
    type: DataTypes.DATE,
  },
  cuenta_bloqueada: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  intentos_fallidos: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  token_registro: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  token_recuperacion: {
    type: DataTypes.STRING(255),
  },
  foto_perfil: {
    type: DataTypes.BLOB,
  },
}, {
  timestamps: false,
  tableName: 'usuario',
});

module.exports = Usuario;

