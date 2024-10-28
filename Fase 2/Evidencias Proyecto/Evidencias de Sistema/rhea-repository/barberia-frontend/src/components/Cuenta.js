import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const categorias = [
  'Barbería', 
  'salón de manicura y pedicura', 
  'Spa', 
  'Masajes', 
  'Peluquería', 
  'Centro de Estética', 
  'Salón de Belleza', 
  'Depilación',
  'Tratamientos Faciales'
];


const Cuenta = () => {
  const navigate = useNavigate();

  // Estado para el usuario logeado
  const [user, setUser] = useState({ nombre: '', correo: '', id_negocio: null });

  // Estado para los horarios, inicializado como un array vacío por defecto
  const [horarios, setHorarios] = useState([]);

  // Estado para la categoría seleccionada
  const [categoria, setCategoria] = useState('');
  // estado para descripcion
  const [descripcion, setDescripcion] = useState('');
  // Estado para el archivo del logo
  const [logoFile, setLogoFile] = useState(null);
  const [logoUrl, setLogoUrl] = useState('');

  // Obtener el usuario logeado y su negocio al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
  
    axios
      .get('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log('Usuario autenticado:', response.data);
        setUser(response.data);
  
        const negocio = response.data.negocio;
        if (negocio && negocio.id) {
          console.log('Cargando horarios para el negocio:', negocio.id);
          fetchHorarios(negocio.id);
          setCategoria(negocio.categoria || ''); // Establecer la categoría si ya existe
          setDescripcion(negocio.descripcion || '');
          setLogoUrl(negocio.logo || '');
        } else {
          console.error('El usuario no tiene un negocio asociado:', negocio);
          alert('No se encontró un negocio asociado. Verifica tus datos.');
        }
      })
      .catch((error) => {
        console.error('Error al obtener el usuario:', error);
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, [navigate]);

  

  // Función para obtener los horarios desde el backend
  const fetchHorarios = async (id_negocio) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/horarios/negocio/${id_negocio}`);

      // Asegúrate de que la respuesta es un array
      const fetchedHorarios = Array.isArray(response.data) ? response.data.map(horario => ({
        dia: horario.dia_semana,
        desde: horario.hora_inicio,
        hasta: horario.hora_fin,
        cerrado: !horario.activo
      })) : diasSemana.map((dia) => ({
        dia: dia,
        desde: '08:00',  // Valores predeterminados
        hasta: '19:00',
        cerrado: false,
      }));
      
      setHorarios(fetchedHorarios);
    } catch (error) {
      console.error('Error al obtener los horarios:', error);
      setHorarios(diasSemana.map((dia) => ({
        dia: dia,
        desde: '08:00',  // Valores predeterminados
        hasta: '19:00',
        cerrado: false,
      })));
    }
  };

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked, dataset } = e.target;
    const nuevosHorarios = [...horarios];
  
    // Obtener el índice del horario que se está modificando
    const index = dataset.index;
  
    // Realizar la validación
    if (name === "desde" && nuevosHorarios[index].hasta && value >= nuevosHorarios[index].hasta) {
      alert("La hora de apertura debe ser anterior a la hora de cierre.");
      return; // No actualiza si el valor no es válido
    } else if (name === "hasta" && nuevosHorarios[index].desde && value <= nuevosHorarios[index].desde) {
      alert("La hora de cierre debe ser posterior a la hora de apertura.");
      return; // No actualiza si el valor no es válido
    }
  
    // Actualizar el valor del campo dependiendo de si es checkbox o input de tipo time
    if (type === "checkbox") {
      nuevosHorarios[index][name] = checked; // Actualizar el estado del checkbox
    } else {
      nuevosHorarios[index][name] = value; // Actualizar otros campos
    }
  
    setHorarios(nuevosHorarios);
  };

  // Manejar cambio de la categoría seleccionada
  const handleCategoriaChange = async (e) => {
    const nuevaCategoria = e.target.value;
    setCategoria(nuevaCategoria);
  
    try {
      const token = localStorage.getItem('token');
  
      if (!user.negocio || !user.negocio.id) {
        alert('No se encontró un negocio asociado al usuario.');
        return;
      }
  
      // Enviar la categoría al backend
      await axios.put(
        `http://localhost:5000/api/negocios/${user.negocio.id}/categoria`,
        { categoria: nuevaCategoria },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      alert('Categoría actualizada correctamente.');
    } catch (error) {
      console.error('Error al actualizar la categoría:', error);
    }
  };

  // Informacion Negocio
  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
     // Validación de la descripción en el frontend
  if (descripcion.length < 10 || descripcion.length > 100) {
    alert('La descripción debe tener entre 10 y 100 caracteres.');
    return;
  }

  const descripcionRegex = /^[a-zA-Z0-9\s.,!?'"]+$/;
  if (!descripcionRegex.test(descripcion)) {
    alert('La descripción contiene caracteres no permitidos. Solo se permiten letras, números y algunos caracteres comunes.');
    return;
  }

    console.log({ categoria, descripcion });
    console.log('Token obtenido:', token);
    const formData = new FormData();
    formData.append('categoria', categoria);
    formData.append('descripcion', descripcion);
    if (logoFile) {
      formData.append('logo', logoFile);  // Añadir el archivo del logo si existe
    }
    try {
      if (!user.negocio.id) {
        alert('No se encontró un negocio asociado al usuario.');
        return;
      }
  
      const response = await axios.put(`http://localhost:5000/api/negocios/${user.negocio.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      

      alert('Datos actualizados correctamente.');
      setLogoUrl(response.data.negocio.logo);
    } catch (error) {
      if (error.response && error.response.data.message) {
        alert(`Error: ${error.response.data.message}`); // Mostrar el mensaje de error del backend
      } else {
        console.error('Error al actualizar la información del negocio:', error);
      }
    }
  };

  // Manejar cambios en la subida del logo
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file); // Setea el archivo para subir
      setLogoUrl(URL.createObjectURL(file)); // Mostrar la nueva imagen como preview
    }
  };

  // Enviar los datos del formulario de horarios al backend
  const handleHorarioSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      if (!user.negocio.id) {
        alert('No se encontró un negocio asociado al usuario.');
        return;
      }

      const horariosFormateados = horarios.map(h => ({
        dia: h.dia,
        desde: h.desde,
        hasta: h.hasta,
        cerrado: h.cerrado
      }));

      const response = await axios.put(
        `http://localhost:5000/api/horarios/negocio/${user.negocio.id}`,
        { horario: horariosFormateados },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert('Horarios actualizados correctamente.');

      // Verifica si `response.data` es un array
      if (Array.isArray(response.data)) {
        const horariosActualizados = response.data.map(h => ({
          dia: h.dia_semana,
          desde: h.hora_inicio,
          hasta: h.hora_fin,
          cerrado: !h.activo,
        }));

        setHorarios(horariosActualizados);
      } else {
        console.error('La respuesta del servidor no es un array:', response.data);
        
      }
    } catch (error) {
      console.error('Error al actualizar los horarios:', error);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">
        ¡Bienvenido <span className="text-purple-500">{user.nombre}</span>!
      </h1>
      <p className="mb-8">Comencemos con el proceso de completar la información de tu negocio.</p>
      
      {/* Formulario para categoría */}
      <form className="bg-white p-6 rounded shadow-md space-y-6 mb-6">
  <div>
    <label className="block font-semibold mb-2">Tipo de Negocio</label>
    <select
      value={categoria}
      onChange={handleCategoriaChange}  // Llamamos directamente a la función al cambiar la categoría
      className="p-2 border rounded w-full bg-gray-100"
    >
      <option value="">Selecciona una categoría</option>
      {categorias.map((cat, index) => (
        <option key={index} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  </div>

  {/* Campo para descripción del negocio */}
  <div>
    <label  className="block font-semibold mb-2">Descripción del negocio</label>
    <textarea
      value={descripcion}
      onChange={(e) => setDescripcion(e.target.value)}
      className="p-2 border rounded w-full bg-gray-100"
      placeholder="Describe tu negocio aquí"
    />
  </div>
  {/* Mostrar el logo del negocio si existe */}
  {logoUrl && (
        <div className="mb-6">
          <img src={logoUrl} alt="Logo del negocio" className="w-48 h-48 object-cover" />
          <p className="text-green-500">Imagen del logo ya cargada. Si subes otra, reemplazará la actual.</p>
        </div>
      )}
    
      {/* Campo para subir el logo del negocio */}
      <div>
          <label className="block font-semibold mb-2">Logo del negocio</label>
          <input
            type="file"
            onChange={handleLogoChange}
            className="p-2 border rounded w-full bg-gray-100"
            accept="image/*"
          />
        </div>
  <button
    type="button"
    onClick={handleSubmit}
    className="bg-purple-500 text-white px-4 py-2 rounded"
  >
    Guardar Datos del Negocio
  </button>
</form>

      {/* Formulario para horario */}
      <form onSubmit={handleHorarioSubmit} className="bg-white p-6 rounded shadow-md space-y-6">
        <div>
          <label className="block font-semibold mb-2">Horario de Apertura</label>
          {Array.isArray(horarios) && horarios.length > 0 && horarios.map((dia, index) => (
            <div key={index} className="flex items-center space-x-4 mb-2">
              <span className="w-20">{dia.dia}</span>
              <input
                type="time"
                name="desde"
                value={dia.desde}
                data-index={index}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <input
                type="time"
                name="hasta"
                value={dia.hasta}
                data-index={index}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="cerrado"
                  checked={dia.cerrado}
                  data-index={index}
                  onChange={handleChange}
                />
                <span>Cerrado</span>
              </label>
            </div>
          ))}
        </div>
        <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded">
          Guardar Horarios
        </button>
      </form>
    </div>
  );
};

export default Cuenta;

