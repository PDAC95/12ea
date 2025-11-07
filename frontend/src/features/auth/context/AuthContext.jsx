import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

// Crear el contexto de autenticación
const AuthContext = createContext();

/**
 * AuthProvider - Proveedor del contexto de autenticación
 * Maneja el estado global de autenticación de la aplicación
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * loadUser - Carga el usuario desde localStorage al montar
   * Verifica si existe un token guardado y lo restaura
   */
  const loadUser = useCallback(() => {
    try {
      setIsLoading(true);
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error al cargar usuario desde localStorage:', error);
      // Si hay error al parsear, limpiar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * login - Guarda el token y usuario en localStorage y state
   * @param {string} authToken - Token JWT del backend
   * @param {object} userData - Datos del usuario autenticado
   */
  const login = useCallback((authToken, userData) => {
    try {
      // Guardar en localStorage
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));

      // Actualizar estado
      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error al guardar datos de autenticación:', error);
      throw new Error('No se pudo completar el inicio de sesión');
    }
  }, []);

  /**
   * logout - Limpia el token y usuario de localStorage y state
   */
  const logout = useCallback(() => {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Limpiar estado
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  /**
   * updateUser - Actualiza los datos del usuario en el estado y localStorage
   * @param {object} updatedUserData - Datos actualizados del usuario
   */
  const updateUser = useCallback((updatedUserData) => {
    try {
      const newUserData = { ...user, ...updatedUserData };
      localStorage.setItem('user', JSON.stringify(newUserData));
      setUser(newUserData);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  }, [user]);

  // Auto-login al montar el componente
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Valor del contexto que se proveerá a los componentes hijos
  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    loadUser,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * useAuth - Hook personalizado para acceder al contexto de autenticación
 * @returns {object} Contexto de autenticación con estado y funciones
 * @throws {Error} Si se usa fuera del AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }

  return context;
};

export default AuthContext;
