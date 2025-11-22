import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

/**
 * Toast - Componente de notificación temporal
 * Aparece en la esquina superior derecha con animación
 * Se cierra automáticamente después de 5 segundos
 */
const Toast = ({ type = 'success', message, onClose, duration = 5000 }) => {
  // Auto-cerrar después de `duration` milisegundos
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  // Configuración de estilos según el tipo
  const config = {
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-500',
      icon: CheckCircle,
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-500',
      icon: AlertCircle,
    },
    warning: {
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-800',
      iconColor: 'text-amber-500',
      icon: AlertTriangle,
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-500',
      icon: Info,
    },
  };

  // Validar tipo y usar 'error' como fallback si el tipo es inválido
  const validType = config[type] ? type : 'error';
  const { bgColor, borderColor, textColor, iconColor, icon: Icon } = config[validType];

  return (
    <div
      className={`fixed top-4 right-4 z-50 min-w-[320px] max-w-md ${bgColor} ${borderColor} border rounded-xl p-4 shadow-soft-lg animate-slide-in-right`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* Icono */}
        <div className={iconColor}>
          <Icon size={24} />
        </div>

        {/* Mensaje */}
        <div className={`flex-1 ${textColor}`}>
          <p className="font-medium text-sm leading-relaxed">{message}</p>
        </div>

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className={`${textColor} hover:opacity-70 transition-opacity`}
          aria-label="Cerrar notificación"
        >
          <X size={20} />
        </button>
      </div>

      {/* Barra de progreso */}
      {duration > 0 && (
        <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${
              type === 'success'
                ? 'bg-green-500'
                : type === 'error'
                ? 'bg-red-500'
                : type === 'warning'
                ? 'bg-amber-500'
                : 'bg-blue-500'
            } animate-progress`}
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      )}
    </div>
  );
};

Toast.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number,
};

export default Toast;
