import axios from 'axios';
import { API_URL } from '../config/constants';

/**
 * Instancia de Axios configurada con interceptors para autenticación
 * Incluye manejo automático de JWT tokens y errores 401
 */

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Timeout de 10 segundos
});

/**
 * Request Interceptor
 * Agrega el JWT token a todas las peticiones si existe
 */
api.interceptors.request.use(
  (config) => {
    // Obtener token de localStorage
    const token = localStorage.getItem('token');

    // Si existe token, agregarlo al header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Manejar error en la configuración de la request
    console.error('Error en request interceptor:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Maneja respuestas exitosas y errores, especialmente 401 (no autenticado)
 */
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, retornarla tal cual
    return response;
  },
  (error) => {
    // Manejar errores de respuesta
    if (error.response) {
      const { status } = error.response;

      // Si el error es 401 (No autorizado), hacer logout automático
      if (status === 401) {
        console.warn('Sesión expirada o token inválido. Cerrando sesión...');

        // Limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Redirigir a login (solo si no estamos ya en login)
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }

      // Si el error es 403 (Prohibido)
      if (status === 403) {
        console.error('No tienes permisos para acceder a este recurso');
      }

      // Si el error es 404 (No encontrado)
      if (status === 404) {
        console.error('Recurso no encontrado:', error.config.url);
      }

      // Si el error es 500 (Error del servidor)
      if (status === 500) {
        console.error('Error del servidor. Intenta de nuevo más tarde.');
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error('No se recibió respuesta del servidor:', error.request);
    } else {
      // Algo sucedió al configurar la petición
      console.error('Error al configurar la petición:', error.message);
    }

    // Rechazar la promesa con el error para que pueda ser manejado por el componente
    return Promise.reject(error);
  }
);

export default api;
