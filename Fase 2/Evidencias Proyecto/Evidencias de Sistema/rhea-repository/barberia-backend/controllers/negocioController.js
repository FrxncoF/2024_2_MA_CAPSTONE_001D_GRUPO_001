const  Negocio  = require('../models/Negocio'); // Asegúrate de que la ruta sea correcta
const  DuenoNegocio  = require('../models/DuenoNegocio'); // Tabla intermedia para la relación de Dueño-Negocio
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');

// Controlador para crear un nuevo negocio
exports.createNegocio = async (req, res) => {
  try {
    const { nombre, telefono, direccion, horario_inicio, horario_cierre, categoria } = req.body;
    const id_dueno = req.user.id; // ID del usuario dueño desde el token
    const correo = req.user.correo; // Obtener el correo del usuario desde el token

    console.log('Correo del usuario:', correo);

    // Verificar si el nombre del negocio ya está en uso
    const negocioExists = await Negocio.findOne({ where: { nombre } });
    if (negocioExists) {
      return res.status(400).json({ message: 'El nombre del negocio ya está en uso.' });
    }

    // Crear el negocio con los datos proporcionados
    const negocio = await Negocio.create({
      nombre,
      telefono,
      direccion,
      horario_inicio,
      horario_cierre,
      correo,
      id_dueno,
      categoria,
      descripcion, // Ahora incluye la categoría
    });
    console.log('Negocio creado:', negocio);

    // Relacionar el negocio con el dueño
    const relacionDuenoNegocio = await DuenoNegocio.create({
      id_dueno: req.user.id,
      id_negocio: negocio.id,
    });
    console.log('Relación Dueño-Negocio creada:', relacionDuenoNegocio);

    res.json(negocio); // Devolver el negocio creado en la respuesta
  } catch (error) {
    console.error('Error al crear el negocio:', error);
    res.status(500).json({ error: 'Error al crear el negocio' });
  }
};

// Controlador para obtener todos los negocios
exports.getAllNegocios = async (req, res) => {
  try {
    const negocios = await Negocio.findAll();
    res.json(negocios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los negocios' });
  }
};

// Controlador para obtener un negocio por su ID
exports.getNegocioById = async (req, res) => {
  try {
    const { id } = req.params;
    const negocio = await Negocio.findByPk(id);

    if (!negocio) {
      return res.status(404).json({ message: 'Negocio no encontrado' });
    }

    res.status(200).json(negocio);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el negocio' });
  }
};

// Controlador para actualizar los datos de un negocio, incluyendo la categoría
exports.updateNegocio = async (req, res) => {
  try {
    const { nombre, telefono, correo, categoria, direccion, horario_inicio, horario_cierre, descripcion } = req.body;
    // Validación de la descripción
    if (descripcion) {
      // Longitud mínima y máxima
      if (descripcion.length < 10 || descripcion.length > 300) {
        return res.status(400).json({ message: 'La descripción debe tener entre 10 y 300 caracteres.' });
      }

      // Validación de caracteres permitidos (solo letras, números y caracteres comunes)
      const descripcionRegex = /^[a-zA-Z0-9\s.,!?'"]+$/;
      if (!descripcionRegex.test(descripcion)) {
        return res.status(400).json({ message: 'La descripción contiene caracteres no permitidos.' });
      }
    }
    
    // Inicializa logoUrl con null
    let logoUrl = null;

    // Si se sube un nuevo logo, genera la URL
    if (req.file) {
      logoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    // Buscar el negocio por ID
    const negocio = await Negocio.findByPk(req.params.id);
    if (!negocio) {
      return res.status(404).json({ message: 'Negocio no encontrado.' });
    }

    // Actualizar los datos del negocio
    await negocio.update({
      nombre,
      telefono,
      correo,
      categoria,
      direccion,
      horario_inicio,
      horario_cierre,
      descripcion,
      logo: logoUrl || negocio.logo, // Si no se sube un logo nuevo, mantener el actual
    });

    res.status(200).json({ message: 'Negocio actualizado exitosamente', negocio });
  } catch (error) {
    console.error('Error al actualizar el negocio:', error);
    res.status(500).json({ message: 'Error al actualizar el negocio.' });
  }
};


// Controlador para actualizar solo la categoría del negocio
exports.updateCategoria = async (req, res) => {
  try {
    const { categoria } = req.body;
    const { id } = req.params;

    // Verificar que la categoría ha sido proporcionada
    if (!categoria) {
      return res.status(400).json({ message: 'Categoría no proporcionada.' });
    }

    // Buscar el negocio por ID
    const negocio = await Negocio.findByPk(id);
    if (!negocio) {
      return res.status(404).json({ message: 'Negocio no encontrado.' });
    }

    // Actualizar la categoría del negocio
    await negocio.update({ categoria });

    res.status(200).json({ message: 'Categoría actualizada correctamente.', categoria: negocio.categoria });
  } catch (error) {
    console.error('Error al actualizar la categoría:', error);
    res.status(500).json({ message: 'Error al actualizar la categoría.' });
  }
};


