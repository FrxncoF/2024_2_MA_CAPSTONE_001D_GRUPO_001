// src/components/Sidebar.js
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {FaSignOutAlt} from 'react-icons/fa';
import { FcMenu , FcPlanner ,FcBusinessman,FcPlus, FcManager,FcSms,FcCalendar,FcAutomatic,FcSupport      } from "react-icons/fc";
import logo from '../assets/images/logo.png';

const Sidebar = ({ tieneNegocio }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={`h-screen bg-gray-900 text-white shadow-lg flex flex-col fixed top-0 left-0 transition-width duration-300 ${isMenuOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-4 flex items-center justify-between">
        <button onClick={toggleMenu} className="text-white hover:text-purple-500 focus:outline-none mr-4">
          <FcMenu  size={24} />
        </button>
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo Rhea Reserve" className="h-10 w-10" />
          {isMenuOpen && <span className="text-2xl font-bold">Rhea Reserve</span>}
        </div>
      </div>
      <ul className="mt-6 space-y-2 flex-grow">
        {tieneNegocio && (
          <>
            <li>
              <Link
                to="/Cuenta"
                className={`flex items-center space-x-3 p-2 px-4 rounded transition-colors duration-200 ${isActive('/Cuenta') ? 'bg-purple-500' : 'hover:bg-gray-700'}`}
              >
                <FcBusinessman />
                {isMenuOpen && <span>Negocio</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/panel-reservas"
                className={`flex items-center space-x-3 p-2 px-4 rounded transition-colors duration-200 ${isActive('/panel-reservas') ? 'bg-purple-500' : 'hover:bg-gray-700'}`}
              >
                <FcPlanner  />
                {isMenuOpen && <span>Panel de Reservas</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/servicios"
                className={`flex items-center space-x-3 p-2 px-4 rounded transition-colors duration-200 ${isActive('/servicios') ? 'bg-purple-500' : 'hover:bg-gray-700'}`}
              >
                <FcPlus />
                {isMenuOpen && <span>Servicios</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/profesionales"
                className={`flex items-center space-x-3 p-2 px-4 rounded transition-colors duration-200 ${isActive('/profesionales') ? 'bg-purple-500' : 'hover:bg-gray-700'}`}
              >
                <FcManager />
                {isMenuOpen && <span>Profesionales</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/notificaciones"
                className={`flex items-center space-x-3 p-2 px-4 rounded transition-colors duration-200 ${isActive('/notificaciones') ? 'bg-purple-500' : 'hover:bg-gray-700'}`}
              >
                <FcSms />
                {isMenuOpen && <span>Notificaciones</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/calendario"
                className={`flex items-center space-x-3 p-2 px-4 rounded transition-colors duration-200 ${isActive('/calendario') ? 'bg-purple-500' : 'hover:bg-gray-700'}`}
              >
                <FcCalendar />
                {isMenuOpen && <span>Calendario</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/configuracion"
                className={`flex items-center space-x-3 p-2 px-4 rounded transition-colors duration-200 ${isActive('/configuracion') ? 'bg-purple-500' : 'hover:bg-gray-700'}`}
              >
                <FcAutomatic />
                {isMenuOpen && <span>Configuración</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/soporte"
                className={`flex items-center space-x-3 p-2 px-4 rounded transition-colors duration-200 ${isActive('/soporte') ? 'bg-purple-500' : 'hover:bg-gray-700'}`}
              >
                <FcSupport/>
                {isMenuOpen && <span>Soporte</span>}
              </Link>
            </li>
          </>
        )}
      </ul>
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition-colors duration-200"
        >
          <FaSignOutAlt className="mr-2" />
          {isMenuOpen && <span>Cerrar sesión</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;