const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database'); // Configuración de la base de 
const bodyParser = require('body-parser');
require('./models/associations'); // Asociaciones entre modelos

// Importa tus modelos explícitamente
const Usuario = require('./models/Usuario');
const Negocio = require('./models/Negocio');
const Servicio = require('./models/Servicio');
const HorarioNegocio = require('./models/HorarioNegocio');
const DisponibilidadEmpleado = require('./models/DisponibilidadEmpleado');
const Reserva = require('./models/Reserva');
const DuenoNegocio = require('./models/DuenoNegocio');
const EmpleadoNegocio = require('./models/EmpleadoNegocio');
const Pago = require('./models/Pago');
const Cliente = require('./models/Cliente');
const Evento = require('./models/Evento');


// Importa tus rutas
const userRoutes = require('./routes/userRoutes');
const negocioRoutes = require('./routes/negocioRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const empleadoRoutes = require('./routes/empleadoRoutes');
const servicioRoutes = require('./routes/servicioRoutes');
const pagoRoutes = require('./routes/pagoRoutes');
const horarioRoutes = require('./routes/horarioRoutes');
const disponibilidadEmpleadoRoutes = require('./routes/disponibilidadEmpleadoRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const eventoRoutes = require('./routes/eventoRoutes');
const app = express();

// Middleware para procesar JSON y habilitar CORS
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Registrar las rutas
app.use('/api/users', userRoutes);
app.use('/api/negocios', negocioRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/disponibilidadEmpleado', disponibilidadEmpleadoRoutes);
app.use('/api/horarios', horarioRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api', eventoRoutes);

// Función asincrónica para sincronizar la base de datos en el orden correcto
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos exitosa.');

    await Usuario.sync({ force: false });
    await Negocio.sync({ force: false });
    await Cliente.sync({ force: false });
    await EmpleadoNegocio.sync({ force: false });
    await DuenoNegocio.sync({ force: false });
    await Servicio.sync({ force: false });
    await HorarioNegocio.sync({ force: false });
    await DisponibilidadEmpleado.sync({ force: false });
    await Reserva.sync({ force: false });
    await Pago.sync({ force: false });
    await Evento.sync({ force: false });

    console.log('Tablas sincronizadas correctamente.');
  } catch (error) {
    console.error('Error al conectar o sincronizar la base de datos:', error);
  }
};

// Iniciar la sincronización de la base de datos
syncDatabase();

// Iniciar el servidor en el puerto configurado
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
