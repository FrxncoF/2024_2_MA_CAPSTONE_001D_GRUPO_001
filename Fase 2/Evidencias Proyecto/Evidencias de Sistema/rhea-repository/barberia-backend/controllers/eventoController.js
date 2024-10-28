const Evento = require('../models/Evento');

exports.createEvento = async (req, res) => {
  try {
    const { title, start, end, description, category, userId } = req.body;
    const nuevoEvento = await Evento.create({
      title,
      start,
      end,
      description,
      category,
      userId,
    });
    res.status(201).json(nuevoEvento);
  } catch (error) {
    console.error('Error al crear el evento:', error);
    res.status(500).json({ error: 'Error al crear el evento' });
  }
};
  
  // Obtener todos los eventos
  exports.getEventos = async (req, res) => {
    try {
      const { userId } = req.params; // Obtener el userId de los parámetros de la ruta
      const eventos = await Evento.findAll({
        where: {
          userId,
        },
      });
      res.status(200).json(eventos);
    } catch (error) {
      console.error('Error al obtener los eventos:', error);
      res.status(500).json({ error: 'Error al obtener los eventos' });
    }
  };
  
  // Actualizar un evento
  exports.updateEvento = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, start, end, description, category } = req.body;
      const evento = await Evento.findByPk(id);
      if (!evento) {
        return res.status(404).json({ error: 'Evento no encontrado' });
      }
      evento.title = title;
      evento.start = start;
      evento.end = end;
      evento.description = description;
      evento.category = category;
      await evento.save();
      res.status(200).json(evento);
    } catch (error) {
      console.error('Error al actualizar el evento:', error);
      res.status(500).json({ error: 'Error al actualizar el evento' });
    }
  };
  
  // Eliminar un evento
  exports.deleteEvento = async (req, res) => {
    try {
      const { id } = req.params;
      const evento = await Evento.findByPk(id);
      if (!evento) {
        return res.status(404).json({ error: 'Evento no encontrado' });
      }
      await evento.destroy();
      res.status(200).json({ message: 'Evento eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
      res.status(500).json({ error: 'Error al eliminar el evento' });
    }
  };
 