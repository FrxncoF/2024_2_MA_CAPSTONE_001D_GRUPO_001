// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import PanelReservas from './components/PanelReservas';
import Servicios from './components/Servicios';
import Profesionales from './components/Profesionales';
import Notificaciones from './components/Notificaciones';
import Calendario from './components/Calendario';
import Configuracion from './components/Configuracion';
import Soporte from './components/Soporte';
import Login from './components/Login';
import Register from './components/Register';
import Cuenta from './components/Cuenta';
import VistaCliente from './components/VistaCliente'; // Importar VistaCliente
import RegistroEmpleado from './components/RegistroEmpleado'; // Importar RegistroEmpleado
import './index.css';

// Función PrivateRoute para proteger rutas privadas
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const AppContent = () => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';
  const showSidebar = token && !isAuthRoute;

  return (
    <div className="flex">
      {/* Mostrar la barra lateral solo en rutas privadas */}
      {showSidebar && <Sidebar tieneNegocio={true} />}

      <div className={`flex-grow p-4 ${showSidebar ? 'ml-64' : ''}`}>
        <Routes>
          {/* Ruta pública para la VistaCliente con un ID dinámico */}
          <Route path="/cliente/:id_negocio" element={<VistaCliente />} />

          {/* Rutas públicas para Login y Registro */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Nueva ruta pública para registro del empleado usando el token */}
          <Route path="/registro/:token" element={<RegistroEmpleado />} />

          {/* Rutas privadas protegidas */}
          <Route path="/" element={<Navigate to="/cuenta" replace />} />
          <Route path="/cuenta" element={<PrivateRoute><Cuenta /></PrivateRoute>} />
          <Route path="/panel-reservas" element={<PrivateRoute><PanelReservas /></PrivateRoute>} />
          <Route path="/servicios" element={<PrivateRoute><Servicios /></PrivateRoute>} />
          <Route path="/profesionales" element={<PrivateRoute><Profesionales /></PrivateRoute>} />
          <Route path="/notificaciones" element={<PrivateRoute><Notificaciones /></PrivateRoute>} />
          <Route path="/calendario" element={<PrivateRoute><Calendario /></PrivateRoute>} />
          <Route path="/configuracion" element={<PrivateRoute><Configuracion /></PrivateRoute>} />
          <Route path="/soporte" element={<PrivateRoute><Soporte /></PrivateRoute>} />
          <Route path="/negocio/:nombre" element={<VistaCliente />} />

          {/* Redireccionar rutas no encontradas */}
          <Route path="*" element={<Navigate to={token ? "/" : "/login"} replace />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
