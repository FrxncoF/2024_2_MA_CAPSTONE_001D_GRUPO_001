import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay, isValid as dateFnsIsValid, parseISO } from 'date-fns';
import es from 'date-fns/locale/es';
import Modal from 'react-modal';
import axios from 'axios';

const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

Modal.setAppElement('#root');

const colorPalette = ["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33F3", "#33FFF3"]; // Colores predefinidos para categorías

const Calendario = () => {
  const [user, setUser] = useState({ nombre: '', correo: '', id_negocio: null });
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', start: new Date(), end: new Date(), description: '', category: '' });
  const [formError, setFormError] = useState('');
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState(''); // Estado para la nueva categoría

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    axios
      .get('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data);
        const negocio = response.data.negocio;
        if (negocio && negocio.id) {
          cargarEventos(negocio.id);
        }
      })
      .catch((error) => {
        localStorage.removeItem('token');
      });
  }, []);
  const handleDeleteEvent = (event) => {
    // Aquí va la lógica para eliminar un evento
  };
  const cargarEventos = async (id_negocio) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/eventos/${id_negocio}`);
      const eventosConFechaCorrecta = response.data.map(evento => ({
        ...evento,
        start: parseISO(evento.start),
        end: parseISO(evento.end),
      }));
      setEvents(eventosConFechaCorrecta);
    } catch (error) {
      console.error('Error al cargar los eventos:', error);
    }
  };

  const getCategoryColor = (categoryName) => {
    const index = categories.findIndex((cat) => cat.nombre === categoryName);
    return colorPalette[index % colorPalette.length];
  };

  const openModal = (slotInfo) => {
    setNewEvent({
      title: '',
      start: slotInfo.start ? new Date(slotInfo.start) : new Date(),
      end: slotInfo.end ? new Date(slotInfo.end) : new Date(),
      description: '',
      category: '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setFormError('');
    setModalOpen(false);
  };

  const validateForm = () => {
    if (!newEvent.title.trim()) {
      setFormError('El título es obligatorio.');
      return false;
    }
    if (!dateFnsIsValid(newEvent.start) || !dateFnsIsValid(newEvent.end)) {
      setFormError('Las fechas de inicio y fin deben ser válidas.');
      return false;
    }
    if (newEvent.start >= newEvent.end) {
      setFormError('La fecha de inicio debe ser anterior a la fecha de finalización.');
      return false;
    }
    if (!newEvent.category.trim()) {
      setFormError('La categoría es obligatoria.');
      return false;
    }
    if (newEvent.description.length < 10 || newEvent.description.length > 100) {
      setFormError('La descripción debe tener entre 10 y 100 caracteres.');
      return false;
    }
    return true;
  };

  const handleAddEvent = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!user.negocio || !user.negocio.id) {
        alert('No se encontró un negocio asociado al usuario.');
        return;
      }

      const formattedEvent = {
        ...newEvent,
        start: new Date(newEvent.start),
        end: new Date(newEvent.end),
        userId: user.negocio.id,
      };

      const response = await axios.post(
        'http://localhost:5000/api/eventos',
        formattedEvent,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEvents([...events, {
        ...response.data,
        start: new Date(response.data.start),
        end: new Date(response.data.end),
      }]);
      closeModal();
    } catch (error) {
      console.error('Error al añadir el evento:', error);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, { nombre: newCategory }]);
      setNewCategory('');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Calendario Personal del Dueño del Negocio</h2>
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <Calendar
          localizer={localizer}
          events={events.map(event => ({
            ...event,
            color: getCategoryColor(event.category), // Asigna color basado en la categoría
          }))}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          selectable
          onSelectSlot={(slotInfo) => openModal(slotInfo)}
          onSelectEvent={(event) => handleDeleteEvent(event)}
          messages={{
            next: "Siguiente",
            previous: "Anterior",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            agenda: "Agenda",
            date: "Fecha",
            time: "Hora",
            event: "Evento",
          }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.color,
              color: 'white',
              borderRadius: '0.5rem',
              padding: '0.2rem',
            },
          })}
        />
      </div>

      {/* Sección para crear nueva categoría */}
      <div className="bg-gray-100 rounded-lg shadow-md p-4 mt-4">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Crear Nueva Categoría</h3>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nombre de la categoría"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Añadir
          </button>
        </div>
        <div className="mt-4">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Categorías Existentes:</h4>
          <ul className="list-disc pl-5 text-gray-600">
            {categories.map((category, index) => (
              <li key={index} style={{ color: getCategoryColor(category.nombre) }}>
                {category.nombre}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal para añadir un evento */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        contentLabel="Añadir Evento"
        className="fixed inset-0 flex items-center justify-center p-4 z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
      >
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full">
          <h3 className="text-2xl font-bold mb-4">Añadir un Evento</h3>
          {formError && <p className="text-red-500 mb-4">{formError}</p>}
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Título del Evento:</label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Descripción:</label>
              <textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Fecha de Inicio:</label>
              <input
                type="datetime-local"
                value={dateFnsIsValid(newEvent.start) ? format(newEvent.start, "yyyy-MM-dd'T'HH:mm") : ''}
                onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Fecha de Finalización:</label>
              <input
                type="datetime-local"
                value={dateFnsIsValid(newEvent.end) ? format(newEvent.end, "yyyy-MM-dd'T'HH:mm") : ''}
                onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Categoría:</label>
              <select
                value={newEvent.category}
                onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione una categoría</option>
                {categories.map((category) => (
                  <option key={category.nombre} value={category.nombre}>
                    {category.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddEvent}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
              >
                Añadir Evento
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="ml-2 bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition duration-200"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Calendario;

