const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); //Importamos el middleware de autenticación
const empleadoController = require('../controllers/empleadoController');

// Rutas de empleados
router.post('/', empleadoController.createEmpleado);
router.get('/negocio/:id_negocio', empleadoController.getEmpleadosByNegocio);
router.get('/:id', empleadoController.getEmpleadoById);

// Rutas para la creación de empleados por correo
router.post('/crear', authMiddleware, empleadoController.crearEmpleado); // Ruta para crear empleado. Agregamos el middleware de autenticación a la ruta de creación de empleado por correo
router.get('/registro/:token', empleadoController.mostrarFormularioRegistro); // Mostrar formulario
router.post('/registro/:token', empleadoController.completarRegistroEmpleado); // Completar registro

module.exports = router;
