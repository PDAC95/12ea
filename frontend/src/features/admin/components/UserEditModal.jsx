import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, User, Shield, CheckCircle, XCircle, Loader2 } from 'lucide-react';

/**
 * UserEditModal - Modal para editar usuario admin
 *
 * Features:
 * - Editar role (admin/user)
 * - Editar isActive (activo/inactivo)
 * - Editar isVerified (verificado/no verificado)
 * - Validaciones
 * - Loading states
 *
 * Sprint 5+ - Panel Admin de Usuarios
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Estado de apertura del modal
 * @param {Object} props.user - Usuario a editar
 * @param {Function} props.onClose - Callback para cerrar modal
 * @param {Function} props.onSubmit - Callback para enviar formulario
 * @param {boolean} props.isLoading - Estado de carga
 * @param {string} props.submitError - Error de envío
 * @returns {JSX.Element} Modal de edición de usuario
 */
const UserEditModal = ({ isOpen, user, onClose, onSubmit, isLoading, submitError }) => {
  const [formData, setFormData] = useState({
    role: 'user',
    isActive: true,
    isVerified: false,
  });

  /**
   * Inicializar form con datos del usuario
   */
  useEffect(() => {
    if (user) {
      setFormData({
        role: user.role || 'user',
        isActive: user.isActive !== undefined ? user.isActive : true,
        isVerified: user.isVerified !== undefined ? user.isVerified : false,
      });
    }
  }, [user]);

  /**
   * Handle input change
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  /**
   * Handle submit
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen || !user) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Editar Usuario</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* User Info Display */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Nombre:</span>
              <span className="font-medium text-gray-900">
                {user.preferredName || user.fullName || 'Sin nombre'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-900">{user.email}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Registrado:</span>
              <span className="font-medium text-gray-900">
                {new Date(user.createdAt).toLocaleDateString('es-CA')}
              </span>
            </div>
          </div>

          {/* Role Select */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary-600" />
                Rol del Usuario *
              </div>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
            >
              <option value="user">Usuario Regular</option>
              <option value="admin">Administrador</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Los administradores tienen acceso completo al panel de administración
            </p>
          </div>

          {/* isActive Checkbox */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              disabled={isLoading}
              className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <label htmlFor="isActive" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2 mb-1">
                {formData.isActive ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm font-medium text-gray-900">Usuario Activo</span>
              </div>
              <p className="text-xs text-gray-600">
                Los usuarios inactivos no pueden iniciar sesión en la plataforma
              </p>
            </label>
          </div>

          {/* isVerified Checkbox */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="isVerified"
              name="isVerified"
              checked={formData.isVerified}
              onChange={handleChange}
              disabled={isLoading}
              className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <label htmlFor="isVerified" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2 mb-1">
                {formData.isVerified ? (
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-sm font-medium text-gray-900">Email Verificado</span>
              </div>
              <p className="text-xs text-gray-600">
                Marca esta opción si el usuario ha verificado su email
              </p>
            </label>
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

UserEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    _id: PropTypes.string,
    email: PropTypes.string,
    preferredName: PropTypes.string,
    fullName: PropTypes.string,
    role: PropTypes.oneOf(['user', 'admin']),
    isActive: PropTypes.bool,
    isVerified: PropTypes.bool,
    createdAt: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  submitError: PropTypes.string,
};

export default UserEditModal;
