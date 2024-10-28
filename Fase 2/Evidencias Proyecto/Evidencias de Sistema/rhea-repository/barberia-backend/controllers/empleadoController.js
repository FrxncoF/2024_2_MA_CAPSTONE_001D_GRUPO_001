const { EmpleadoNegocio } = require('../models/EmpleadoNegocio');
const { negocio } = require('../models/Negocio');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const db = require('../config/database');
const sendEmail = require('../utils/sendEmail');
const dayjs = require('dayjs');


exports.createEmpleado = async (req, res) => {
  const { id_usuario, id_negocio, cargo } = req.body;

  try {
    const empleado = await EmpleadoNegocio.create({
      id_usuario,
      id_negocio,
      cargo,
    });
    res.json(empleado);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar empleado' });
  }
};

exports.getEmpleadosByNegocio = async (req, res) => {
  try {
    const empleados = await EmpleadoNegocio.findAll({ where: { id_negocio: req.params.id_negocio } });
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
};

exports.getEmpleadoById = async (req, res) => {
  try {
    const empleado = await EmpleadoNegocio.findByPk(req.params.id);
    if (!empleado) return res.status(404).json({ error: 'Empleado no encontrado' });

    res.json(empleado);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener empleado' });
  }
};

// Funciones para creación de empleados por correo
exports.crearEmpleado = async (req, res) => {
  const { correo } = req.body;

  // Verificar si req.user tiene los datos correctos
  if (!req.user || !req.user.id) {
    // Cambio: Verificación adicional para asegurar que req.user exista
    return res.status(401).json({ message: 'Usuario no autenticado.' });
  }

  try {
    // Obtener el id del dueño de la sesión (verificado desde req.user por el authMiddleware)
    const id_dueno = req.user.id;

    // Buscar el negocio asociado al dueño autenticado
    const [negocio] = await db.query('SELECT id, nombre FROM negocio WHERE id_dueno = :id_dueno', {
      replacements: { id_dueno }, // Cambio: Usamos el id del dueño autenticado para buscar el negocio
      type: db.QueryTypes.SELECT
    });

    if (!negocio) {
      return res.status(400).json({ message: 'Negocio no encontrado para el dueño actual.' });
    }

    const id_negocio = negocio.id;

    // Verificar si el empleado ya tiene una cuenta
    const userExists = await db.query(
      'SELECT * FROM usuario WHERE correo = :correo',
      {
        replacements: { correo },
        type: db.QueryTypes.SELECT
      }
    );

    if (userExists.length > 0) {
      return res.status(400).json({ message: 'El empleado ya tiene una cuenta.' });
    }
    // Crear un token aleatorio para un usuario con nombre generico
    // Crear un token de contraseña hash temporal
    const token = crypto.randomBytes(32).toString('hex');
    const temporaryPasswordHash = await bcrypt.hash('temporal', 10);

    // Crear un nuevo usuario con el token y la contraseña temporal
    const [newUser] = await db.query(
      'INSERT INTO usuario (nombre, correo, contrasena_hash, token_registro, cuenta_bloqueada, creado_en) VALUES (:nombre, :correo, :contrasena_hash, :token, :cuenta_bloqueada, NOW())',
      {
        replacements: { 
          nombre: 'Usuario Temporal', // Nombre temporal
          correo,
          contrasena_hash: temporaryPasswordHash, // Contraseña temporal
          token,
          cuenta_bloqueada: true 
        }
      }
    );
    const id_usuario = newUser;
    
    // Asignar el empleado a empleado_negocio
    await db.query(
      'INSERT INTO empleado_negocio (id_usuario, id_negocio) VALUES (:id_usuario, :id_negocio)',
      {
        replacements: { id_usuario, id_negocio }
      }
    );

    // Enviar correo con el token de registro
    const verificationLink = `http://localhost:3000/registro/${token}`;
    const emailContent = {
      link_registro: verificationLink, 
      nombre_negocio: negocio.nombre 
    };

    // ID de la plantilla de SendGrid
    await sendEmail(correo, 'd-c95ad51a50de4de8bc649de798c7c872', emailContent);

    res.status(200).json({ message: 'Correo enviado al empleado.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear empleado.' });
  }
};

exports.mostrarFormularioRegistro = async (req, res) => {
  const { token } = req.params;
  try {
    const [user] = await db.query('SELECT * FROM usuario WHERE token_registro = :token', {
      replacements: { token },
      type: db.QueryTypes.SELECT
    });
    if (!user) {
      return res.status(400).json({ message: 'Token inválido.' });
    }
    res.status(200).json({ message: 'Mostrar el formulario de registro' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al verificar token.' });
  }
};

exports.completarRegistroEmpleado = async (req, res) => {
  const { token } = req.params;
  const { nombre, contraseña, telefono, cargo, disponibilidad } = req.body;
  try {

    //Buscar el usuario con el token
    const [user] = await db.query('SELECT * FROM usuario WHERE token_registro = :token', {
      replacements: { token },
      type: db.QueryTypes.SELECT
    });

    // comprobar si el usuario existe y no tiene id
    if (!user || !user.id) {
      return res.status(400).json({ message: 'Token inválido o usuario no encontrado.' });
    }
    const id_usuario = user.id;

    //Buscar el id_negocio relacionado con ese usuario en la tabla empleado_negocio
    const [negocio] = await db.query(
      'SELECT id_negocio FROM empleado_negocio WHERE id_usuario = :id_usuario',
      {
        replacements: { id_usuario },
        type: db.QueryTypes.SELECT
      }
    );

    if (!negocio || !negocio.id_negocio) {
      return res.status(400).json({ message: 'No se encontró el negocio asociado al empleado.' });
    }
    const id_negocio = negocio.id_negocio;

    //Hashear la contraseña temporal
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    //Actualizar los datos del usuario
    await db.query(
      'UPDATE usuario SET nombre = :nombre, contrasena_hash = :hashedPassword, telefono = :telefono, cargo = :cargo,  cuenta_bloqueada = false WHERE id = :id_usuario',
      {
        replacements: {
          nombre,
          hashedPassword,
          telefono,
          cargo,
          id_usuario,
        }
      }
    );
    
    // Borrar la disponibilidad anterior si existía
    await db.query('DELETE FROM disponibilidad_empleado WHERE id_usuario = :id_usuario', {
      replacements: { id_usuario },
      type: db.QueryTypes.DELETE
    });

    // Asegurarse de que la disponibilidad está presente
    if (!disponibilidad) {
      return res.status(400).json({ message: 'La disponibilidad es requerida.' });
    }

    // Guardar la disponibilidad del empleado por día
    const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

    // Guardar la disponibilidad del empleado por cada día
    for (const dia of dias) {
      const diaDisponibilidad = disponibilidad[dia] || { disponible: false, hora_inicio: '00:00:00', hora_fin: '00:00:00' };

      // Convertir las horas al formato adecuado (solo HH:mm:ss)
      const hora_inicio = diaDisponibilidad.hora_inicio ? dayjs(diaDisponibilidad.hora_inicio).format('HH:mm:ss') : '00:00:00';
      const hora_fin = diaDisponibilidad.hora_fin ? dayjs(diaDisponibilidad.hora_fin).format('HH:mm:ss') : '00:00:00';

      // Insertar cada día en la base de datos, aunque no esté disponible
      await db.query(
        'INSERT INTO disponibilidad_empleado (id_usuario, id_negocio, dia_semana, hora_inicio, hora_fin, disponible) VALUES (:id_usuario, :id_negocio, :dia_semana, :hora_inicio, :hora_fin, :disponible)',
        {
          replacements: {
            id_usuario,
            id_negocio,
            dia_semana: dia,
            hora_inicio,
            hora_fin,
            disponible: diaDisponibilidad.disponible ? 1 : 0 // disponible = 0 si no está disponible
          }
        }
      );
    }

    res.status(200).json({ message: 'Registro completado con éxito y disponibilidad guardada.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al completar el registro.' });
  }
};