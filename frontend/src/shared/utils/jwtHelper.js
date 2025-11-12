/**
 * JWT Helper - Utilidades para trabajar con JSON Web Tokens
 *
 * Funciones para decodificar y validar tokens JWT sin librerías externas.
 * Nota: Esto NO valida la firma del token (eso lo hace el backend).
 * Solo verifica estructura y expiración.
 *
 * Sprint 2 - Task 3.5 ✅
 */

/**
 * Decodifica el payload de un JWT
 * @param {string} token - JWT completo
 * @returns {Object|null} Payload decodificado o null si inválido
 */
export const decodeJWT = (token) => {
  try {
    if (!token || typeof token !== 'string') {
      return null;
    }

    // JWT tiene 3 partes: header.payload.signature
    const parts = token.split('.');

    if (parts.length !== 3) {
      return null;
    }

    // Decodificar la segunda parte (payload)
    const payload = parts[1];

    // Reemplazar caracteres URL-safe y agregar padding si necesario
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '='
    );

    // Decodificar Base64 y parsear JSON
    const jsonPayload = decodeURIComponent(
      atob(paddedBase64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error al decodificar JWT:', error);
    return null;
  }
};

/**
 * Verifica si un token JWT ha expirado
 * @param {string} token - JWT completo
 * @returns {boolean} true si el token está expirado, false si es válido
 */
export const isTokenExpired = (token) => {
  const payload = decodeJWT(token);

  if (!payload || !payload.exp) {
    return true; // Si no se puede decodificar o no tiene exp, considerar expirado
  }

  // exp está en segundos, Date.now() está en milisegundos
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

/**
 * Verifica si un token JWT es válido (estructura y expiración)
 * @param {string} token - JWT completo
 * @returns {boolean} true si el token es válido, false si no
 */
export const isTokenValid = (token) => {
  if (!token || typeof token !== 'string') {
    return false;
  }

  // Verificar estructura
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }

  // Verificar que no esté expirado
  return !isTokenExpired(token);
};

/**
 * Obtiene información del usuario desde el token JWT
 * @param {string} token - JWT completo
 * @returns {Object|null} Información del usuario o null si inválido
 */
export const getUserFromToken = (token) => {
  const payload = decodeJWT(token);

  if (!payload) {
    return null;
  }

  // Extraer información relevante del usuario
  return {
    id: payload.id || payload.userId || payload.sub,
    email: payload.email,
    fullName: payload.fullName,
    preferredName: payload.preferredName,
    exp: payload.exp,
    iat: payload.iat,
  };
};

/**
 * Obtiene el token desde localStorage
 * @returns {string|null} Token o null si no existe
 */
export const getStoredToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    console.error('Error al obtener token de localStorage:', error);
    return null;
  }
};

/**
 * Verifica si hay una sesión válida
 * @returns {boolean} true si hay token válido en localStorage
 */
export const hasValidSession = () => {
  const token = getStoredToken();
  return token ? isTokenValid(token) : false;
};
