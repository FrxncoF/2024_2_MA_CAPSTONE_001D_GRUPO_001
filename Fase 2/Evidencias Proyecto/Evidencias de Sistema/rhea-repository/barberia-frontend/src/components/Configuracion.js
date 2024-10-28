// src/components/Configuracion.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Configuracion = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    contraseñaActual: '',
    nuevaContraseña: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData({
          nombre: response.data.nombre,
          correo: response.data.correo,
          telefono: response.data.telefono,
          contraseñaActual: '',
          nuevaContraseña: ''
        });
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    };

    fetchUserData();
  }, []);

  const validate = () => {
    const newErrors = {};

    if (!formData.nombre.match(/^[a-zA-Z\s]+$/)) {
      newErrors.nombre = 'El nombre solo debe contener letras y espacios.';
    }

    if (!formData.correo.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      newErrors.correo = 'Ingrese un correo electrónico válido.';
    }

    if (!formData.telefono.match(/^\d{9}$/)) {
      newErrors.telefono = 'El teléfono debe contener  9 dígitos.';
    }

    if (formData.nuevaContraseña && formData.nuevaContraseña.length < 8) {
      newErrors.nuevaContraseña = 'La nueva contraseña debe tener al menos 8 caracteres.';
    }

    if (formData.contraseñaActual && formData.nuevaContraseña && formData.contraseñaActual === formData.nuevaContraseña) {
      newErrors.nuevaContraseña = 'La nueva contraseña no debe ser igual a la contraseña actual.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const updateData = {
        nombre: formData.nombre,
        correo: formData.correo,
        telefono: formData.telefono,
      };

      // Solo incluir la contraseña si se está actualizando
      if (formData.nuevaContraseña) {
        updateData.contraseñaActual = formData.contraseñaActual;
        updateData.nuevaContraseña = formData.nuevaContraseña;
      }

      await axios.put('http://localhost:5000/api/users/update', updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Datos actualizados correctamente');
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
      alert('Error al actualizar los datos');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Edita tu Cuenta</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Correo:</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.correo && <p className="text-red-500 text-sm">{errors.correo}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Teléfono:</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.telefono && <p className="text-red-500 text-sm">{errors.telefono}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Contraseña Actual:</label>
          <input
            type="password"
            name="contraseñaActual"
            value={formData.contraseñaActual}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.contraseñaActual && <p className="text-red-500 text-sm">{errors.contraseñaActual}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Nueva Contraseña:</label>
          <input
            type="password"
            name="nuevaContraseña"
            value={formData.nuevaContraseña}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.nuevaContraseña && <p className="text-red-500 text-sm">{errors.nuevaContraseña}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition duration-300"
        >
          Actualizar
        </button>
      </form>
    </div>
  );
};

export default Configuracion;


