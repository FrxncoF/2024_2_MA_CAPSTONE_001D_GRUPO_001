const Servicio = require('../models/Servicio');

exports.getServicios = async (req, res) => {
  try {
    const { id_negocio } = req.user; // Verifica que id_negocio proviene del middleware
    if (!id_negocio) {
      return res.status(400).json({ message: 'El usuario no tiene un negocio asociado' });
    }

    const servicios = await Servicio.findAll({ where: { id_negocio } });
    res.json(servicios);
  } catch (error) {
    console.error('Error al obtener los servicios:', error);
    res.status(500).json({ message: 'Error al obtener los servicios' });
  }
};

exports.addServicio = async (req, res) => {
  try {
    const { nombre, descripcion, duracion, precio, disponible } = req.body;
    const { id_negocio } = req.user;

    // Asegúrate de que `id_negocio` esté presente
    if (!id_negocio) {
      return res.status(400).json({ message: 'El usuario no tiene un negocio asociado' });
    }

    const nuevoServicio = await Servicio.create({
      nombre,
      descripcion,
      duracion,
      precio,
      disponible,
      id_negocio,
    });

    res.status(201).json({ message: 'Servicio creado con éxito', servicio: nuevoServicio });
  } catch (error) {
    console.error('Error al agregar el servicio:', error);
    res.status(500).json({ message: 'Error al agregar el servicio' });
  }
};


exports.updateServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, duracion, precio, disponible } = req.body;
    const servicio = await Servicio.findByPk(id);

    if (!servicio) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    await servicio.update({
      nombre,
      descripcion,
      duracion,
      precio,
      disponible,
    });

    res.json(servicio);
  } catch (error) {
    console.error('Error al actualizar el servicio:', error);
    res.status(500).json({ message: 'Error al actualizar el servicio' });
  }
};

exports.getServiciosByNegocio = async (req, res) => {
  try {
    const servicios = await Servicio.findAll({ where: { id_negocio: req.params.id_negocio } });
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los servicios' });
  }
};

exports.getServicioById = async (req, res) => {
  try {
    const servicio = await Servicio.findByPk(req.params.id);
    if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });

    res.json(servicio);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el servicio' });
  }
};

exports.deleteServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const servicio = await Servicio.findByPk(id);

    if (!servicio) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    await servicio.destroy();
    res.status(200).json({ message: 'Servicio eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el servicio:', error);
    res.status(500).json({ message: 'Error al eliminar el servicio' });
  }
};