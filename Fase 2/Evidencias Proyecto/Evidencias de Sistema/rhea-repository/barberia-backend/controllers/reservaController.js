const { Reserva } = require('../models/Reserva');

exports.createReserva = async (req, res) => {
  const { id_cliente, id_negocio, id_empleado, fecha, estado, comentario_cliente } = req.body;

  try {
    const reserva = await Reserva.create({
      id_cliente,
      id_negocio,
      id_empleado,
      fecha,
      estado,
      comentario_cliente,
    });
    res.json(reserva);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la reserva' });
  }
};

exports.getReservasByNegocio = async (req, res) => {
  try {
    const reservas = await Reserva.findAll({ where: { id_negocio: req.params.id_negocio } });
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las reservas' });
  }
};

exports.getReservaById = async (req, res) => {
  try {
    const reserva = await Reserva.findByPk(req.params.id);
    if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });

    res.json(reserva);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la reserva' });
  }
};
