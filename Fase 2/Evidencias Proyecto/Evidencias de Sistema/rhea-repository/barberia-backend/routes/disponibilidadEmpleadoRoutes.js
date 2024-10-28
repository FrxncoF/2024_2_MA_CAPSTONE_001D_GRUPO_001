const express = require('express');
const router = express.Router();
const disponibilidadController = require('../controllers/disponibilidadEmpleadoController');

// Rutas para la disponibilidad de empleados
router.post('/', disponibilidadController.createDisponibilidad); // Crear disponibilidad
router.get('/empleado/:id_usuario', disponibilidadController.getDisponibilidadByEmpleado); 
router.get('/:id', disponibilidadController.getDisponibilidadById); // Obtener disponibilidad por ID

module.exports = router;
