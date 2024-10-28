const { DisponibilidadEmpleado } = require('../models/DisponibilidadEmpleado');

exports.createDisponibilidad = async (req, res) => {
  const { id_usuario, fecha, hora_inicio, hora_fin, disponible } = req.body;

  try {
    const disponibilidad = await DisponibilidadEmpleado.create({
      id_usuario,
      fecha,
      hora_inicio,
      hora_fin,
      disponible,
    });
    res.json(disponibilidad);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar disponibilidad' });
  }
};

exports.getDisponibilidadByEmpleado = async (req, res) => {
  try {
    const disponibilidad = await DisponibilidadEmpleado.findAll({ where: { id_usuario: req.params.id_usuario } });
    res.json(disponibilidad);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener disponibilidad' });
  }
};

exports.getDisponibilidadById = async (req, res) => {
  try {
    const disponibilidad = await DisponibilidadEmpleado.findByPk(req.params.id);
    if (!disponibilidad) return res.status(404).json({ error: 'Disponibilidad no encontrada' });

    res.json(disponibilidad);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener disponibilidad' });
  }
};
