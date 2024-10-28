const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cita = require('./Reserva');

const Pago = sequelize.define('Pago', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  id_reserva: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  monto: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  metodo_pago: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  codigo_transaccion: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'pago',
});

module.exports = Pago;