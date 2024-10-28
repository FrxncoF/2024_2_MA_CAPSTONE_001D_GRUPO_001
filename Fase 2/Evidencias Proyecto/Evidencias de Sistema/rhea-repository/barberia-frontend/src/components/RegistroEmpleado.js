import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es'; // Para asegurar el uso de formato 24h con localización

const RegistroEmpleado = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    contraseña: '',
    telefono: '',
    cargo: '',
    disponibilidad: {
      lunes: { disponible: true, hora_inicio: null, hora_fin: null },
      martes: { disponible: true, hora_inicio: null, hora_fin: null },
      miercoles: { disponible: true, hora_inicio: null, hora_fin: null },
      jueves: { disponible: true, hora_inicio: null, hora_fin: null },
      viernes: { disponible: true, hora_inicio: null, hora_fin: null },
      sabado: { disponible: true, hora_inicio: null, hora_fin: null },
      domingo: { disponible: true, hora_inicio: null, hora_fin: null },
    }
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvailabilityChange = (day, field, value) => {
    setFormData({
      ...formData,
      disponibilidad: {
        ...formData.disponibilidad,
        [day]: {
          ...formData.disponibilidad[day],
          [field]: value,
        }
      }
    });
  };

  const validateForm = () => {
    let formErrors = {};
    // Validación del nombre: solo letras y espacios
    if (!/^[a-zA-Z\s]+$/.test(formData.nombre)) {
      formErrors.nombre = 'El nombre solo debe contener letras y espacios';
    }

    // Validación de la contraseña: mínimo 6 caracteres y sin espacios
    if (formData.contraseña.length < 6 || /\s/.test(formData.contraseña)) {
      formErrors.contraseña = 'La contraseña debe tener al menos 6 caracteres y no contener espacios';
    }

    // Validación del teléfono: 9 dígitos
    if (!/^\d{9}$/.test(formData.telefono)) {
      formErrors.telefono = 'El teléfono debe tener exactamente 9 dígitos';
    }

    // Validación del cargo: solo letras
    if (!/^[a-zA-Z]+$/.test(formData.cargo)) {
      formErrors.cargo = 'El cargo solo debe contener letras';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await axios.post(`http://localhost:5000/api/empleados/registro/${token}`, formData);
        alert('Registro completado con éxito');
        navigate('/login');
      } catch (error) {
        alert('Hubo un error al completar el registro');
      }
    }
  };

  const renderDayAvailability = (day) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 capitalize">{day}</label>
      <div className="flex items-center space-x-4">
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <TimePicker
            value={formData.disponibilidad[day].hora_inicio}
            onChange={(value) => handleAvailabilityChange(day, 'hora_inicio', value)}
            ampm={false} // Formato de 24 horas
            renderInput={(params) => <input {...params} className="block w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none" />}
            disabled={!formData.disponibilidad[day].disponible}
          />
          <span className="self-center">a</span>
          <TimePicker
            value={formData.disponibilidad[day].hora_fin}
            onChange={(value) => handleAvailabilityChange(day, 'hora_fin', value)}
            ampm={false} // Formato de 24 horas
            renderInput={(params) => <input {...params} className="block w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none" />}
            disabled={!formData.disponibilidad[day].disponible}
          />
        </LocalizationProvider>
        <input
          type="checkbox"
          checked={!formData.disponibilidad[day].disponible}
          onChange={(e) => handleAvailabilityChange(day, 'disponible', !e.target.checked)}
          className="ml-4 form-checkbox"
        />
        <span className="ml-2 text-sm text-gray-600">No disponible</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Completa tu registro</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              placeholder="Ingresa tu nombre"
              required
            />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              placeholder="Ingresa tu contraseña"
              required
            />
            {errors.contraseña && <p className="text-red-500 text-xs mt-1">{errors.contraseña}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              placeholder="Ingresa tu número de teléfono"
              required
            />
            {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cargo</label>
            <input
              type="text"
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              placeholder="Ingresa tu cargo"
              required
            />
            {errors.cargo && <p className="text-red-500 text-xs mt-1">{errors.cargo}</p>}
          </div>

          {/* Render availability for each day */}
          <div className="flex items-center">
            <h3 className="text-xl font-medium text-gray-700 mt-6">Disponibilidad</h3>
            <div className="ml-2 text-gray-500 cursor-pointer align-middle" title="Si un día no deseas trabajar, marca la casilla 'No disponible' para ese día.">❓</div>
          </div>
          {['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].map(renderDayAvailability)}

          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700 focus:outline-none"
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistroEmpleado;