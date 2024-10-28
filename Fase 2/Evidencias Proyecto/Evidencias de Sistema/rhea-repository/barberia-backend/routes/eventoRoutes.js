const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');

// Ruta para crear un evento
router.post('/eventos', eventoController.createEvento);

// Ruta para obtener todos los eventos de un usuario
router.get('/eventos/:userId', eventoController.getEventos);

// Ruta para actualizar un evento
router.put('/eventos/:id', eventoController.updateEvento);

// Ruta para eliminar un evento
router.delete('/eventos/:id', eventoController.deleteEvento);

module.exports = router;
