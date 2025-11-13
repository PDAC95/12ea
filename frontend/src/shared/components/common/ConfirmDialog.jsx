import PropTypes from 'prop-types';
import { X, AlertTriangle } from 'lucide-react';

/**
 * ConfirmDialog - Modal de confirmación reutilizable
 *
 * Features:
 * - Backdrop con overlay oscuro
 * - Título y mensaje personalizables
 * - Botones Confirmar/Cancelar
 * - Colores personalizables (danger, warning, info)
 * - Loading state en botón de confirmación
 * - Escape key para cerrar
 *
 * Sprint 3 - US-009: Panel Admin
 * Task 9.7 - AdminBusinessList
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Estado del modal (abierto/cerrado)
 * @param {Function} props.onClose - Callback para cerrar modal
 * @param {Function} props.onConfirm - Callback para confirmar acción
 * @param {string} props.title - Título del modal
 * @param {string} props.message - Mensaje de confirmación
 * @param {string} [props.confirmText='Confirmar'] - Texto del botón confirmar
 * @param {string} [props.cancelText='Cancelar'] - Texto del botón cancelar
 * @param {string} [props.variant='danger'] - Variante de color (danger, warning, info)
 * @param {boolean} [props.isLoading=false] - Estado de carga
 * @returns {JSX.Element|null} Modal de confirmación
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  isLoading = false,
}) => {
  if (!isOpen) return null;

  /**
   * Obtener colores según variante
   */
  const getColors = () => {
    const colors = {
      danger: {
        icon: 'text-red-600 bg-red-100',
        button: 'bg-red-600 hover:bg-red-700',
      },
      warning: {
        icon: 'text-yellow-600 bg-yellow-100',
        button: 'bg-yellow-600 hover:bg-yellow-700',
      },
      info: {
        icon: 'text-blue-600 bg-blue-100',
        button: 'bg-blue-600 hover:bg-blue-700',
      },
    };
    return colors[variant] || colors.danger;
  };

  const colors = getColors();

  /**
   * Handler para ESC key
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 rounded-full ${colors.icon} flex items-center justify-center flex-shrink-0`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 id="confirm-dialog-title" className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        <p className="text-gray-600 mb-6 pl-16">{message}</p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 min-w-[100px] justify-center ${colors.button}`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Procesando...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  variant: PropTypes.oneOf(['danger', 'warning', 'info']),
  isLoading: PropTypes.bool,
};

export default ConfirmDialog;
