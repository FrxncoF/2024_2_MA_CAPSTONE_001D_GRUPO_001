// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contraseña: '',
    telefono: '',
    nombreNegocio: '',
    telefonoNegocio: '',
    direccionNegocio: '',
    horario_inicio: '',
    horario_cierre: '',
    cargo: 'Dueño',
  });

  const [errors, setErrors] = useState({});
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    const nameRegex = /^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/;
    const addressRegex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|org|net|edu)$/;
    const passwordRegex = /^\S+$/;
    const phoneRegex = /^\d+$/;

    if (!nameRegex.test(formData.nombre)) {
      newErrors.nombre = 'El nombre solo puede contener letras y espacios.';
    }
    if (!emailRegex.test(formData.correo)) {
      newErrors.correo = 'El correo no es válido. Debe terminar en .com, .org, .net o .edu.';
    }
    if (!passwordRegex.test(formData.contraseña) || formData.contraseña.length < 8) {
      newErrors.contraseña = 'La contraseña debe tener al menos 8 caracteres y no contener espacios.';
    }
    if (!phoneRegex.test(formData.telefono) || formData.telefono.length !== 9) {
      newErrors.telefono = 'El teléfono debe tener exactamente 9 dígitos.';
    }
    if (!phoneRegex.test(formData.telefonoNegocio || formData.telefono.length !== 9)) {
      newErrors.telefonoNegocio = 'El teléfono del negocio solo puede contener números.';
    }
    if (!addressRegex.test(formData.direccionNegocio)) {
      newErrors.direccionNegocio = 'La dirección solo puede contener letras, números y espacios.';
    }
    if (formData.horario_inicio >= formData.horario_cierre) {
      newErrors.horario_cierre = 'El horario de cierre debe ser después del de apertura.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === 'nombre' || name === 'nombreNegocio') && !/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]*$/.test(value)) {
      return;
    }

    if (name === 'telefono' && (value.length > 9 || !/^\d*$/.test(value))) {
      return;
    }

    if (name === 'telefonoNegocio' && !/^\d*$/.test(value)) {
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setResponseMessage('Por favor, corrige los errores antes de continuar.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/users/register', formData);
      const { token } = response.data;
      localStorage.setItem('token', token);
      navigate('/panel-reservas');
    } catch (error) {
      console.error('Error al registrar:', error);

      // Mostrar mensaje específico si el correo o el nombre del negocio ya están en uso
      if (error.response && error.response.data.message) {
        setResponseMessage(error.response.data.message);
      } else {
        setResponseMessage('Error al registrar el usuario. Intenta de nuevo más tarde.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 space-y-6">
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-gray-700 mb-4">
                ¡Crea Tu <span className="text-purple-500">Cuenta</span>!
              </h2>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre Completo"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500"
              />
              {errors.nombre && <p className="text-red-500">{errors.nombre}</p>}

              <input
                type="email"
                name="correo"
                placeholder="Correo Electrónico"
                value={formData.correo}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500"
              />
              {errors.correo && <p className="text-red-500">{errors.correo}</p>}

              <input
                type="password"
                name="contraseña"
                placeholder="Contraseña"
                value={formData.contraseña}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500"
              />
              {errors.contraseña && <p className="text-red-500">{errors.contraseña}</p>}

              <input
                type="tel"
                name="telefono"
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500"
              />
              {errors.telefono && <p className="text-red-500">{errors.telefono}</p>}
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-700 mb-4">
                ¡Registra Tu <span className="text-purple-500">Negocio</span>!
              </h2>
              <input
                type="text"
                name="nombreNegocio"
                placeholder="Nombre del Negocio"
                value={formData.nombreNegocio}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500"
              />
              {errors.nombreNegocio && <p className="text-red-500">{errors.nombreNegocio}</p>}

              <input
                type="text"
                name="direccionNegocio"
                placeholder="Dirección del Negocio"
                value={formData.direccionNegocio}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500"
              />
              {errors.direccionNegocio && <p className="text-red-500">{errors.direccionNegocio}</p>}

              <input
                type="time"
                name="horario_inicio"
                value={formData.horario_inicio}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500"
              />
              {errors.horario_inicio && <p className="text-red-500">{errors.horario_inicio}</p>}

              <input
                type="time"
                name="horario_cierre"
                value={formData.horario_cierre}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500"
              />
              {errors.horario_cierre && <p className="text-red-500">{errors.horario_cierre}</p>}

              <input
                type="tel"
                name="telefonoNegocio"
                placeholder="Teléfono del Negocio"
                value={formData.telefonoNegocio}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500"
              />
              {errors.telefonoNegocio && <p className="text-red-500">{errors.telefonoNegocio}</p>}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 transition"
            >
              Crear Cuenta
            </button>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-purple-500 hover:underline"
            >
              ¿Ya tienes una cuenta? Inicia sesión
            </button>
          </div>
        </form>

        {responseMessage && (
          <div className="mt-4 text-center text-red-500">{responseMessage}</div>
        )}
      </div>
    </div>
  );
};

export default Register;