const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');

// Rutas para las reservas
router.post('/', reservaController.createReserva);
router.get('/negocio/:id_negocio', reservaController.getReservasByNegocio);
router.get('/:id', reservaController.getReservaById);

module.exports = router;
