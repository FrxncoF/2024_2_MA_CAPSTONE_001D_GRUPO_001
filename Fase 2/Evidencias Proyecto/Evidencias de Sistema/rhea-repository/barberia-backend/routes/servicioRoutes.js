const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicioController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, servicioController.getServicios);
router.post('/', authMiddleware, servicioController.addServicio);
router.put('/:id', authMiddleware, servicioController.updateServicio);
router.delete('/:id', authMiddleware, servicioController.deleteServicio);
router.get('/negocio/:id_negocio', servicioController.getServiciosByNegocio);

module.exports = router;
