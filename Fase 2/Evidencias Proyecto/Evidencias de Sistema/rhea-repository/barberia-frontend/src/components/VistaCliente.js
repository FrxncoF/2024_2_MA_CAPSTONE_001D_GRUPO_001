// src/components/VistaCliente.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const VistaCliente = () => {
  const { nombre } = useParams(); // Obtener el nombre del negocio desde la URL
  const [negocio, setNegocio] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedServicio, setSelectedServicio] = useState(null);

  useEffect(() => {
    // Función para obtener información del negocio, servicios y horarios
    const fetchData = async () => {
      try {
        // Obtener el negocio por su nombre
        const responseNegocio = await axios.get(`http://localhost:5000/api/negocios/${nombre}`);
        setNegocio(responseNegocio.data);

        // Obtener los servicios del negocio usando el ID del negocio
        const responseServicios = await axios.get(`http://localhost:5000/api/servicios/negocio/${responseNegocio.data.id}`);
        setServicios(responseServicios.data);

        // Obtener los horarios del negocio usando el ID del negocio
        const responseHorarios = await axios.get(`http://localhost:5000/api/horarios/negocio/${responseNegocio.data.id}`);
        setHorarios(responseHorarios.data);

        setLoading(false);
      } catch (error) {
        setError('No se pudo obtener la información del negocio, los servicios o los horarios.');
        setLoading(false);
      }
    };

    fetchData();
  }, [nombre]);

  const handleOpenModal = (servicio) => {
    setSelectedServicio(servicio);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedServicio(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6 flex gap-6">
      {/* Parte principal de la vista */}
      <div className="flex-grow bg-white shadow-md rounded-md p-6">
        {/* Encabezado del negocio */}
        <div className="flex items-center mb-6">
          <img
            src={negocio.logo}
            alt="Logo del negocio"
            className="w-24 h-24 rounded-full mr-4 object-cover"
          />
          <h2 className="text-3xl font-bold">{negocio.nombre}</h2>
        </div>

        {/* Servicios del negocio */}
        <div className="mt-6">
          <h3 className="text-2xl font-semibold mb-4">Servicios</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {servicios.map((servicio) => (
              <div key={servicio.id} className="bg-gray-100 p-4 rounded-md shadow-sm hover:bg-gray-200 transition duration-300">
                <h4 className="text-xl font-bold">{servicio.nombre}</h4>
                <p><strong>Duración:</strong> {servicio.duracion} minutos</p>
                <p><strong>Precio:</strong> ${servicio.precio}</p>
                <p><strong>Categoría:</strong> {servicio.categoria}</p>
                <button
                  onClick={() => handleOpenModal(servicio)}
                  className="mt-2 text-blue-500 underline hover:text-blue-700"
                >
                  Ver descripción
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Información detallada del negocio */}
      <div className="w-96 bg-gray-100 shadow-md rounded-md p-6">
        <h3 className="text-2xl font-bold mb-4">Información del Negocio</h3>
        <p><strong>Teléfono:</strong> {negocio.telefono}</p>
        <p><strong>Dirección:</strong> {negocio.direccion}</p>
        <p><strong>Correo:</strong> {negocio.correo}</p>
        <p><strong>Descripción:</strong> {negocio.descripcion}</p>
        <p><strong>Categoría:</strong> {negocio.categoria}</p>

        {/* Horario del negocio */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Horario</h3>
          {horarios.length > 0 ? (
            <ul>
              {diasSemana.map((dia) => {
                const horario = horarios.find(h => h.dia_semana === dia);
                return (
                  <li key={dia} className="flex justify-between">
                    <span>{dia}</span>
                    <span>
                      {horario && horario.activo
                        ? `${horario.hora_inicio} - ${horario.hora_fin}`
                        : 'Cerrado'}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No se encontraron horarios.</p>
          )}
        </div>
      </div>

      {/* Modal para la descripción del servicio */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
            <h4 className="text-2xl font-bold mb-4">{selectedServicio.nombre}</h4>
            <p className="mb-4">{selectedServicio.descripcion}</p>
            <button
              onClick={handleCloseModal}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VistaCliente;


