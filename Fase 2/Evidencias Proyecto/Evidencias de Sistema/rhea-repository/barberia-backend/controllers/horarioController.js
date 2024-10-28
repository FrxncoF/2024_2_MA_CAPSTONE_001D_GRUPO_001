const HorarioNegocio = require('../models/HorarioNegocio');
const Negocio = require('../models/Negocio'); // Para verificar que el negocio existe

// Controlador para actualizar los horarios del negocio
exports.actualizarHorario = async (req, res) => {
  const { id } = req.params; // Cambiado de id_negocio a id
  const { horario } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID del negocio no proporcionado.' });
  }

  if (!Array.isArray(horario) || horario.length === 0) {
    return res.status(400).json({ error: 'Horarios no proporcionados o formato incorrecto.' });
  }

  try {
    // Verificar si el negocio existe
    const negocio = await Negocio.findByPk(id); // Cambiado id_negocio a id
    if (!negocio) {
      return res.status(404).json({ error: 'Negocio no encontrado.' });
    }

    // Eliminar horarios antiguos del negocio
    await HorarioNegocio.destroy({ where: { id_negocio: id } });

    // Insertar los nuevos horarios
    const nuevosHorarios = horario.map((h) => ({
      id_negocio: id,
      dia_semana: h.dia,
      hora_inicio: h.desde,
      hora_fin: h.hasta,
      activo: !h.cerrado,
    }));

    await HorarioNegocio.bulkCreate(nuevosHorarios);

    res.status(200).json({ message: 'Horarios actualizados correctamente.' });
  } catch (error) {
    console.error('Error al actualizar los horarios:', error);
    res.status(500).json({ error: 'Error al actualizar los horarios.' });
  }
};

// Controlador para obtener los horarios de un negocio
exports.getHorariosByNegocio = async (req, res) => {
  const { id } = req.params;

  try {
    const horarios = await HorarioNegocio.findAll({
      where: { id_negocio: id },
      include: { model: Negocio, as: 'negocio' },
    });

    if (!horarios || horarios.length === 0) {
      return res.status(404).json({ message: 'No se encontraron horarios para este negocio.' });
    }

    // Extraer solo los datos necesarios
    const horariosData = horarios.map(horario => {
      return {
        id: horario.id,
        id_negocio: horario.id_negocio,
        dia_semana: horario.dia_semana,
        hora_inicio: horario.hora_inicio,
        hora_fin: horario.hora_fin,
        activo: horario.activo,
      };
    });

    res.json(horariosData);  // Enviar solo los datos
  } catch (error) {
    console.error('Error al obtener los horarios:', error);
    res.status(500).json({ message: 'Error al obtener los horarios.' });
  }
};


