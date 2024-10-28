import React, { useState } from 'react';
import Modal from './Modal'; 

const Profesionales = () => {
  const [showModal, setShowModal] = useState(false); // Estado para manejar el modal
  const openModal = () => setShowModal(true);  // Función para abrir el modal
  const closeModal = () => setShowModal(false); // Función para cerrar el modal
  
  return (
    <div>
      <h1>Profesionales</h1>
      
      {/* Botón para invitar un colaborador */}
      <button 
        onClick={openModal} 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Invitar Colaborador
      </button>

      {/* Modal para invitar colaborador */}
      {showModal && <Modal closeModal={closeModal} />}
    </div>
  );
};

export default Profesionales;