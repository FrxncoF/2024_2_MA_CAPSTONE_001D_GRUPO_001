// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

export const login = async (correo, contraseña) => {
  const response = await axios.post(`${API_URL}/login`, { correo, contraseña });
  
  if (response.data.token) {
    // Guarda el token en localStorage
    localStorage.setItem('token', response.data.token);
  }

  return response.data;
};

export const register = async (nombre, correo, contraseña, telefono, rol) => {
  const response = await axios.post(`${API_URL}/register`, {
    nombre, correo, contraseña, telefono, rol
  });

  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getToken = () => {
  return localStorage.getItem('token');
};
