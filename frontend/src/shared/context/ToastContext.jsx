import { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Toast from '../components/Toast';

// Crear el contexto de Toast
const ToastContext = createContext();

/**
 * ToastProvider - Proveedor del contexto de notificaciones Toast
 * Permite mostrar notificaciones desde cualquier componente de la app
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  /**
   * showToast - Muestra una nueva notificación toast
   * @param {string} type - Tipo: 'success' | 'error' | 'warning' | 'info'
   * @param {string} message - Mensaje a mostrar
   * @param {number} duration - Duración en ms (default: 5000)
   */
  const showToast = useCallback((type, message, duration = 5000) => {
    const id = Date.now();
    const newToast = { id, type, message, duration };

    setToasts((prev) => [...prev, newToast]);
  }, []);

  /**
   * Helpers para tipos específicos de toast
   */
  const toast = {
    success: useCallback(
      (message, duration) => showToast('success', message, duration),
      [showToast]
    ),
    error: useCallback(
      (message, duration) => showToast('error', message, duration),
      [showToast]
    ),
    warning: useCallback(
      (message, duration) => showToast('warning', message, duration),
      [showToast]
    ),
    info: useCallback(
      (message, duration) => showToast('info', message, duration),
      [showToast]
    ),
  };

  /**
   * closeToast - Cierra un toast específico
   */
  const closeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, toast }}>
      {children}

      {/* Renderizar todos los toasts activos */}
      <div className="fixed top-0 right-0 z-50 pointer-events-none">
        <div className="flex flex-col gap-2 p-4 pointer-events-auto">
          {toasts.map((toastItem, index) => (
            <div
              key={toastItem.id}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Toast
                type={toastItem.type}
                message={toastItem.message}
                duration={toastItem.duration}
                onClose={() => closeToast(toastItem.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * useToast - Hook personalizado para usar el sistema de toasts
 * @returns {object} { showToast, toast: { success, error, warning, info } }
 * @throws {Error} Si se usa fuera del ToastProvider
 */
export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast debe ser usado dentro de un ToastProvider');
  }

  return context;
};

export default ToastContext;
