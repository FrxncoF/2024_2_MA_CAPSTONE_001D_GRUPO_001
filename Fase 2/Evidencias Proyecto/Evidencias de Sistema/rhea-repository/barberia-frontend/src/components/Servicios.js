import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    duracion: '',
    precio: '',
    disponible: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState('');
  // Obtener los servicios al cargar el componente
  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/servicios', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setServicios(response.data); // Guardar los servicios obtenidos
    } catch (error) {
      console.error('Error al obtener los servicios:', error);
      setMessage({ type: 'error', text: 'Error al obtener los servicios.' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validaciones específicas para cada campo
    if (name === 'nombre' && !/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]*$/.test(value)) return;
    if (name === 'duracion' && (!/^\d*$/.test(value) || value.length > 4)) return;
    if (name === 'descripcion') {
      if (value.length > 100) {
        setError('La descripción no debe exceder los 100 caracteres.');
        return;
      } else if (value.length < 10 && value.length > 0) {
        setError('La descripción debe tener al menos 10 caracteres.');
      } else {
        setError('');
      }
    }

    if (name === 'precio') {
      const numericValue = value.replace(/\D/g, '');
      setForm({ ...form, precio: numericValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (form.descripcion.length < 10 || form.descripcion.length > 100) {
      setError('La descripción debe tener entre 10 y 100 caracteres.');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const formData = { ...form, precio: parseFloat(form.precio) };
  
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/servicios/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage({ type: 'success', text: 'Servicio actualizado con éxito.' });
      } else {
        await axios.post('http://localhost:5000/api/servicios', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage({ type: 'success', text: 'Servicio creado con éxito.' });
      }
  
      setForm({ nombre: '', descripcion: '', duracion: '', precio: '', disponible: true });
      setIsEditing(false);
      setError('');
      fetchServicios(); // Recargar servicios
    } catch (error) {
      console.error('Error al guardar el servicio:', error);
      setMessage({ type: 'error', text: 'Error al guardar el servicio.' });
    }
  };

  const handleEdit = (servicio) => {
    setForm(servicio);
    setIsEditing(true);
    setEditingId(servicio.id);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/servicios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ type: 'success', text: 'Servicio eliminado con éxito.' });
      fetchServicios(); // Recargar servicios
    } catch (error) {
      console.error('Error al eliminar el servicio:', error);
      setMessage({ type: 'error', text: 'Error al eliminar el servicio.' });
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Servicios</h1>
      {message && (
        <div
          className={`p-2 rounded ${
            message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white mb-4`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md space-y-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del Servicio"
          value={form.nombre}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="descripcion"
          placeholder="Descripción (máx. 100 caracteres)"
          value={form.descripcion}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          maxLength="100"
        />
        <input
          type="text"
          name="duracion"
          placeholder="Duración (minutos)"
          value={form.duracion}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">$</span>
          <input
            type="text"
            name="precio"
            placeholder="Precio"
            value={form.precio}
            onChange={handleChange}
            className="w-full p-2 pl-8 border rounded"
            required
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="disponible"
            checked={form.disponible}
            onChange={(e) => setForm({ ...form, disponible: e.target.checked })}
          />
          <label className="ml-2">Disponible</label>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          {isEditing ? 'Actualizar Servicio' : 'Agregar Servicio'}
        </button>
      </form>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Lista de Servicios</h2>
        {servicios.map((servicio) => (
          <div key={servicio.id} className="bg-white p-4 rounded shadow-md mb-2">
            <h3 className="text-lg font-bold">{servicio.nombre}</h3>
            <p>{servicio.descripcion}</p>
            <p>Duración: {servicio.duracion} minutos</p>
            <p>Precio: ${servicio.precio}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(servicio)}
                className="bg-yellow-500 text-white p-2 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(servicio.id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Servicios;