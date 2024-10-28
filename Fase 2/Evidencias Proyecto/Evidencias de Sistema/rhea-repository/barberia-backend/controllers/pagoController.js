const  Pago  = require('../models/Pago');

exports.createPago = async (req, res) => {
  const { id_cita, monto, estado } = req.body;

  try {
    const pago = await Pago.create({
      id_cita,
      monto,
      estado,
    });
    res.json(pago);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el pago' });
  }
};

exports.getPagosByCita = async (req, res) => {
  try {
    const pagos = await Pago.findAll({ where: { id_cita: req.params.id_cita } });
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los pagos' });
  }
};

exports.getPagoById = async (req, res) => {
  try {
    const pago = await Pago.findByPk(req.params.id);
    if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });

    res.json(pago);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el pago' });
  }
};
