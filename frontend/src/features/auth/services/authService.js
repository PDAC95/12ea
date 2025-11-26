import api from '@/shared/utils/api';

/**
 * Servicio de Autenticación
 * Maneja todas las operaciones relacionadas con autenticación de usuarios
 * Usa la instancia de axios configurada con interceptors JWT
 */

const authService = {
  /**
   * Registrar un nuevo usuario
   * @param {Object} userData - Datos del usuario a registrar
   * @param {string} userData.fullName - Nombre completo
   * @param {string} userData.preferredName - Nombre preferido
   * @param {string} userData.email - Email
   * @param {string} userData.password - Contraseña
   * @param {string} userData.confirmPassword - Confirmación de contraseña
   * @param {string} userData.phone - Teléfono
   * @param {string} userData.birthday - Fecha de nacimiento (YYYY-MM-DD)
   * @param {string} userData.city - Ciudad
   * @returns {Promise<Object>} Respuesta del servidor
   * @throws {Error} Si hay error en el registro
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      if (error.response) {
        // El servidor respondió con un error
        const errorData = error.response.data;
        const errorMessage =
          errorData?.message || 'Error al registrar usuario';

        // Si hay errores de validación específicos, incluirlos
        if (errorData?.errors && Array.isArray(errorData.errors)) {
          const validationErrors = errorData.errors
            .map((err) => err.message || err.msg)
            .join(', ');
          throw new Error(validationErrors);
        }

        throw new Error(errorMessage);
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        throw new Error('No se pudo conectar con el servidor');
      } else {
        // Error al configurar la petición
        throw new Error('Error al procesar la solicitud de registro');
      }
    }
  },

  /**
   * Iniciar sesión
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña
   * @param {boolean} [rememberMe=false] - Si debe extender la duración del token
   * @returns {Promise<Object>} { token: string, user: Object }
   * @throws {Error} Si las credenciales son inválidas
   */
  login: async (email, password, rememberMe = false) => {
    try {
      const response = await api.post('/auth/login', { email, password, rememberMe });
      return response.data;
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data;
        const errorMessage =
          errorData?.message || 'Error al iniciar sesión';
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('No se pudo conectar con el servidor');
      } else {
        throw new Error('Error al procesar la solicitud de inicio de sesión');
      }
    }
  },

  /**
   * Verificar email con token
   * @param {string} token - Token de verificación del email
   * @returns {Promise<Object>} Respuesta del servidor
   * @throws {Error} Si el token es inválido o expiró
   */
  verifyEmail: async (token) => {
    try {
      const response = await api.get(`/auth/verify-email/${token}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data;
        const errorMessage =
          errorData?.message || 'Error al verificar el email';
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('No se pudo conectar con el servidor');
      } else {
        throw new Error('Error al procesar la solicitud de verificación');
      }
    }
  },

  /**
   * Solicitar recuperación de contraseña
   * @param {string} email - Email del usuario
   * @returns {Promise<Object>} Respuesta del servidor
   * @throws {Error} Si hay error en la solicitud
   */
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data;
        const errorMessage =
          errorData?.message ||
          'Error al solicitar recuperación de contraseña';
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('No se pudo conectar con el servidor');
      } else {
        throw new Error('Error al procesar la solicitud de recuperación');
      }
    }
  },

  /**
   * Restablecer contraseña con token
   * @param {string} token - Token de restablecimiento
   * @param {string} password - Nueva contraseña
   * @param {string} confirmPassword - Confirmación de nueva contraseña
   * @returns {Promise<Object>} Respuesta del servidor
   * @throws {Error} Si el token es inválido o expiró
   */
  resetPassword: async (token, password, confirmPassword) => {
    try {
      const response = await api.post(`/auth/reset-password/${token}`, {
        password,
        confirmPassword,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data;
        const errorMessage =
          errorData?.message || 'Error al restablecer la contraseña';
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('No se pudo conectar con el servidor');
      } else {
        throw new Error('Error al procesar la solicitud de restablecimiento');
      }
    }
  },

  /**
   * Obtener datos del usuario autenticado actual
   * Requiere JWT token en localStorage (se agrega automáticamente por axios interceptor)
   * @returns {Promise<Object>} Datos del usuario actual
   * @throws {Error} Si no está autenticado o hay error
   */
  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data;
        const errorMessage =
          errorData?.message || 'Error al obtener datos del usuario';
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('No se pudo conectar con el servidor');
      } else {
        throw new Error('Error al procesar la solicitud');
      }
    }
  },

  /**
   * Actualizar perfil del usuario autenticado
   * Se usa para completar datos faltantes después de Google OAuth
   * @param {Object} profileData - Datos a actualizar
   * @param {string} [profileData.phone] - Teléfono
   * @param {string} [profileData.birthday] - Fecha de nacimiento (YYYY-MM-DD)
   * @param {string} [profileData.city] - Ciudad
   * @returns {Promise<Object>} Respuesta del servidor con usuario actualizado
   * @throws {Error} Si hay error en la actualización
   */
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/update-profile', profileData);
      return response.data;
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data;
        const errorMessage =
          errorData?.message || 'Error al actualizar perfil';

        // Si hay errores de validación específicos, incluirlos
        if (errorData?.errors && Array.isArray(errorData.errors)) {
          const validationErrors = errorData.errors
            .map((err) => err.message || err.msg)
            .join(', ');
          throw new Error(validationErrors);
        }

        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('No se pudo conectar con el servidor');
      } else {
        throw new Error('Error al procesar la solicitud de actualización');
      }
    }
  },
};

// Exportar métodos individuales para importación con destructuring
export const { register, login, verifyEmail, forgotPassword, resetPassword, getMe, updateProfile } = authService;

export default authService;
