// backend/routes/horarioRoutes.js
const express = require('express');
const router = express.Router();
const { actualizarHorario, getHorariosByNegocio } = require('../controllers/horarioController');

router.get('/negocio/:id', getHorariosByNegocio);
router.put('/negocio/:id', actualizarHorario);

module.exports = router;