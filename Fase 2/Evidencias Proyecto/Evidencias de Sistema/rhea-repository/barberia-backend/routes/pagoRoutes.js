const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');

// Rutas para los pagos
router.post('/', pagoController.createPago);
router.get('/cita/:id_cita', pagoController.getPagosByCita);
router.get('/:id', pagoController.getPagoById);

module.exports = router;
