import { useEffect, useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  Link2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import PropTypes from 'prop-types';
import { useAuth } from '../../auth/context/AuthContext';
import api from '../../../shared/utils/api';

/**
 * EventDetailModal - Modal de detalle de evento con registro
 *
 * Features:
 * - Información completa del evento
 * - Botón "Registrarme" funcional
 * - Estados: lleno, ya registrado, fecha pasada, registrando
 * - Confirmación de registro con email
 * - Mensajes de éxito/error
 * - Overlay oscuro con click para cerrar
 * - Modal centrado responsive
 * - Bloquea scroll del body
 * - Cierre con Escape key
 * - Animaciones suaves
 *
 * Sprint 3 - US-004: Ver y Registrarse en Eventos
 * Task 4.7 - Frontend EventDetail Component
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Estado de apertura del modal
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Object} props.event - Datos completos del evento
 * @returns {JSX.Element|null} Modal o null si está cerrado
 */
const EventDetailModal = ({ isOpen, onClose, event }) => {
  const { user } = useAuth();

  // Estados del registro
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);

  // Formatear fecha completa
  const formatFullDate = (dateStr) => {
    // Validar que dateStr no sea undefined o vacío
    if (!dateStr) return 'Fecha no disponible';

    // Manejar tanto formato ISO completo como YYYY-MM-DD
    let date;
    if (dateStr.includes('T')) {
      // Si ya tiene hora (formato ISO), parsear directamente
      date = new Date(dateStr);
    } else {
      // Si es solo YYYY-MM-DD, agregar hora para evitar timezone issues
      date = new Date(dateStr + 'T00:00:00');
    }

    // Validar que la fecha sea válida
    if (isNaN(date.getTime())) return 'Fecha inválida';

    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('es-ES', options);
  };

  // Formatear hora
  const formatTime = (timeStr) => {
    // Validar que timeStr no sea undefined o vacío
    if (!timeStr) return 'Hora no disponible';

    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);

    // Validar que hour sea un número válido
    if (isNaN(hour)) return 'Hora inválida';

    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes || '00'} ${ampm}`;
  };

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handler para cerrar con Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Resetear estados cuando se abre el modal
  useEffect(() => {
    if (isOpen && event) {
      setRegistrationSuccess(false);
      setRegistrationError(null);
      setIsAlreadyRegistered(false);
      // TODO: Verificar si el usuario ya está registrado (cuando esté el endpoint)
    }
  }, [isOpen, event]);

  /**
   * Handler para registrarse en el evento
   */
  const handleRegister = async () => {
    if (!event) return;

    try {
      setIsRegistering(true);
      setRegistrationError(null);

      // Llamada al endpoint de registro
      await api.post(`/events/${event._id}/register`);

      // Mostrar mensaje de éxito
      setRegistrationSuccess(true);
      setIsAlreadyRegistered(true);

      // Opcional: Cerrar modal después de 3 segundos
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      console.error('Error registering for event:', err);

      // Manejar diferentes tipos de errores
      if (err.response?.status === 400) {
        // Ya registrado o evento lleno
        const errorMsg = err.response?.data?.error?.message || 'No se pudo completar el registro';
        if (errorMsg.includes('ya registrado') || errorMsg.includes('already registered')) {
          setIsAlreadyRegistered(true);
        }
        setRegistrationError(errorMsg);
      } else if (err.response?.status === 401) {
        setRegistrationError('Debes iniciar sesión para registrarte');
      } else {
        setRegistrationError('Error al registrarte. Intenta de nuevo.');
      }
    } finally {
      setIsRegistering(false);
    }
  };

  // Si no está abierto o no hay evento, no renderizar nada
  if (!isOpen || !event) return null;

  // Extraer datos del evento
  const {
    _id,
    title,
    description,
    date,
    time,
    mode,
    location,
    link,
    capacity,
    registeredCount = 0,
    image,
  } = event;

  // Calcular estados del evento
  const availableSpots = capacity - registeredCount;
  const isFull = availableSpots <= 0;

  // Verificar si la fecha del evento ya pasó
  // Extraer solo la fecha (YYYY-MM-DD) si viene en formato ISO
  const dateOnly = date && date.includes('T') ? date.split('T')[0] : date;
  const eventDate = dateOnly && time ? new Date(`${dateOnly}T${time}`) : null;
  const isPastEvent = eventDate ? eventDate < new Date() : false;

  /**
   * Determinar si el botón de registro debe estar deshabilitado
   */
  const isRegisterDisabled =
    isFull || isPastEvent || isAlreadyRegistered || isRegistering || registrationSuccess;

  /**
   * Determinar el texto del botón de registro
   */
  const getRegisterButtonText = () => {
    if (registrationSuccess) return 'Registrado con éxito';
    if (isRegistering) return 'Registrando...';
    if (isAlreadyRegistered) return 'Ya estás registrada';
    if (isPastEvent) return 'Evento finalizado';
    if (isFull) return 'Evento lleno';
    return 'Registrarme';
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          {/* Modal Content */}
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Event Image */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img src={image} alt={title} className="w-full h-full object-cover" />

              {/* Mode Badge */}
              <div className="absolute top-4 left-4">
                {mode === 'virtual' ? (
                  <span className="inline-flex items-center gap-2 px-3 py-2 bg-primary-500 text-white text-sm font-medium rounded-full shadow-lg">
                    <Video className="w-4 h-4" />
                    Virtual
                  </span>
                ) : mode === 'presencial' ? (
                  <span className="inline-flex items-center gap-2 px-3 py-2 bg-green-500 text-white text-sm font-medium rounded-full shadow-lg">
                    <MapPin className="w-4 h-4" />
                    Presencial
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-3 py-2 bg-purple-500 text-white text-sm font-medium rounded-full shadow-lg">
                    <Video className="w-4 h-4" />
                    Híbrido
                  </span>
                )}
              </div>

              {/* Full Badge */}
              {isFull && (
                <div className="absolute top-4 right-20">
                  <span className="inline-flex items-center gap-1 px-3 py-2 bg-red-500 text-white text-sm font-bold rounded-full shadow-lg">
                    LLENO
                  </span>
                </div>
              )}
            </div>

            {/* Event Content */}
            <div className="p-6 md:p-8">
              {/* Title */}
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>

              {/* Event Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Fecha */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Fecha</p>
                    <p className="text-sm text-gray-900 font-semibold capitalize">
                      {formatFullDate(date)}
                    </p>
                  </div>
                </div>

                {/* Hora */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Hora</p>
                    <p className="text-sm text-gray-900 font-semibold">{formatTime(time)}</p>
                  </div>
                </div>

                {/* Ubicación/Link */}
                {mode === 'virtual' || mode === 'híbrido' ? (
                  link && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Link2 className="w-5 h-5 text-primary-500" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Link de acceso</p>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 hover:text-primary-700 font-semibold hover:underline"
                        >
                          Unirse al evento
                        </a>
                      </div>
                    </div>
                  )
                ) : null}

                {mode === 'presencial' || mode === 'híbrido' ? (
                  location && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Ubicación</p>
                        <p className="text-sm text-gray-900 font-semibold">{location}</p>
                      </div>
                    </div>
                  )
                ) : null}

                {/* Cupos */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Users
                    className={`w-5 h-5 ${
                      isFull ? 'text-red-500' : availableSpots <= 5 ? 'text-orange-500' : 'text-gray-500'
                    }`}
                  />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Cupos disponibles</p>
                    <p
                      className={`text-sm font-semibold ${
                        isFull
                          ? 'text-red-600'
                          : availableSpots <= 5
                            ? 'text-orange-600'
                            : 'text-gray-900'
                      }`}
                    >
                      {isFull
                        ? 'Sin cupos'
                        : `${availableSpots} de ${capacity} disponibles`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{description}</p>
              </div>

              {/* Success Message */}
              {registrationSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-green-800 font-semibold">
                      Registro exitoso
                    </p>
                    <p className="text-green-700 text-sm mt-1">
                      Te enviamos un email de confirmación con todos los detalles del evento.
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {registrationError && !registrationSuccess && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-800 font-semibold">Error al registrarse</p>
                    <p className="text-red-700 text-sm mt-1">{registrationError}</p>
                  </div>
                </div>
              )}

              {/* Register Button */}
              <button
                onClick={handleRegister}
                disabled={isRegisterDisabled}
                className={`w-full py-4 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                  isRegisterDisabled
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {isRegistering ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {getRegisterButtonText()}
                  </>
                ) : registrationSuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    {getRegisterButtonText()}
                  </>
                ) : (
                  getRegisterButtonText()
                )}
              </button>

              {/* Info adicional si no está logueado */}
              {!user && (
                <p className="text-sm text-gray-600 text-center mt-4">
                  Debes{' '}
                  <a href="/login" className="text-primary-600 hover:underline font-medium">
                    iniciar sesión
                  </a>{' '}
                  para registrarte en eventos
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

EventDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    mode: PropTypes.oneOf(['virtual', 'presencial', 'híbrido']).isRequired,
    location: PropTypes.string,
    link: PropTypes.string,
    capacity: PropTypes.number.isRequired,
    registeredCount: PropTypes.number,
    image: PropTypes.string.isRequired,
  }),
};

export default EventDetailModal;
