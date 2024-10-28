const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const Negocio = require('../models/Negocio');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token no proporcionado o mal formado.' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Busca al usuario e incluye el negocio relacionado
    const usuario = await Usuario.findOne({
      where: { id: decoded.id },
      include: [{ model: Negocio, as: 'negocio' }],
    });

    if (!usuario) {
      console.error('Usuario no encontrado.');
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Adjuntar los datos al objeto req.user
    req.user = {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      id_negocio: usuario.negocio ? usuario.negocio.id : null,
      negocio: usuario.negocio ? {
        id: usuario.negocio.id,
        nombre: usuario.negocio.nombre,
        telefono: usuario.negocio.telefono,
        direccion: usuario.negocio.direccion,
        horario_inicio: usuario.negocio.horario_inicio,
        horario_cierre: usuario.negocio.horario_cierre,
        correo: usuario.negocio.correo,
        descripcion: usuario.negocio.descripcion,
        activo: usuario.negocio.activo,
        logo: usuario.negocio.logo,
        categoria: usuario.negocio.categoria,
        latitud: usuario.negocio.latitud,
        longitud: usuario.negocio.longitud,
        id_dueno: usuario.negocio.id_dueno,
      } : {},
    };

    console.log('Usuario autenticado:', req.user); // Verificar los datos
    next();
  } catch (error) {
    console.error('Error en el middleware de autenticación:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token no válido.' });
    }
    res.status(500).json({ message: 'Error de autenticación.' });
  }
};

module.exports = authMiddleware;