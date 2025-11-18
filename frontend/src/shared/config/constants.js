/**
 * Constantes globales de la aplicación
 */

/**
 * URL base de la API backend
 * En producción: https://api.entreamigas.ca/api/v1
 * En desarrollo: http://localhost:8000/api/v1
 */
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

/**
 * URL del frontend
 * En producción: https://entreamigas.ca
 * En desarrollo: http://localhost:5173
 */
export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';

/**
 * Nombre de la aplicación
 */
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Entre Amigas';

/**
 * Entorno actual (development, production)
 */
export const ENV = import.meta.env.VITE_ENV || import.meta.env.MODE || 'development';

/**
 * Determinar si estamos en producción
 */
export const IS_PRODUCTION = ENV === 'production';

/**
 * Determinar si estamos en desarrollo
 */
export const IS_DEVELOPMENT = ENV === 'development';
