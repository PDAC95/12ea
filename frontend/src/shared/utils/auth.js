/**
 * Utilidades de autenticación
 * Helpers para manejo de tokens y datos de usuario en localStorage
 */

/**
 * Obtener token de localStorage
 * @returns {string|null} Token JWT o null si no existe
 */
export const getToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    console.error('Error al obtener token:', error);
    return null;
  }
};

/**
 * Guardar token en localStorage
 * @param {string} token - Token JWT
 */
export const saveToken = (token) => {
  try {
    localStorage.setItem('token', token);
  } catch (error) {
    console.error('Error al guardar token:', error);
  }
};

/**
 * Eliminar token de localStorage
 */
export const removeToken = () => {
  try {
    localStorage.removeItem('token');
  } catch (error) {
    console.error('Error al eliminar token:', error);
  }
};

/**
 * Obtener usuario de localStorage
 * @returns {object|null} Datos del usuario o null si no existe
 */
export const getUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return null;
  }
};

/**
 * Guardar usuario en localStorage
 * @param {object} user - Datos del usuario
 */
export const saveUser = (user) => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error al guardar usuario:', error);
  }
};

/**
 * Eliminar usuario de localStorage
 */
export const removeUser = () => {
  try {
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
  }
};

/**
 * Limpiar todos los datos de autenticación de localStorage
 */
export const clearAuth = () => {
  removeToken();
  removeUser();
};

/**
 * Verificar si el usuario está autenticado (tiene token)
 * @returns {boolean} true si está autenticado, false si no
 */
export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

/**
 * Verificar si el usuario es admin
 * @returns {boolean} true si es admin, false si no
 */
export const isAdmin = () => {
  const user = getUser();
  return user?.role === 'admin';
};

/**
 * Obtener nombre para display (preferredName o fullName)
 * @returns {string} Nombre del usuario o "Usuario"
 */
export const getDisplayName = () => {
  const user = getUser();
  return user?.preferredName || user?.fullName || 'Usuario';
};
