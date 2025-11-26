import PropTypes from 'prop-types';
import { CalendarDays, Loader2, AlertCircle, Clock, MapPin, Monitor, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * MyEventsList - Lista de eventos próximos registrados por el usuario
 *
 * Features:
 * - Cards de eventos con imagen, título, fecha, hora, modo
 * - Badges de modo: virtual (azul), presencial (verde)
 * - Loading state
 * - Error state
 * - Empty state con CTA
 * - Click para ver más detalles
 *
 * Sprint 5+ - Sistema de Perfil de Usuario
 *
 * @param {Object} props
 * @param {Array} props.events - Lista de eventos
 * @param {boolean} props.loading - Estado de carga
 * @param {string} props.error - Mensaje de error
 * @returns {JSX.Element} Lista de eventos
 */
const MyEventsList = ({ events, loading, error }) => {
  const navigate = useNavigate();

  /**
   * Get mode badge styling
   */
  const getModeBadge = (mode) => {
    const modes = {
      virtual: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: Monitor,
        label: 'Virtual',
      },
      presencial: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: MapPin,
        label: 'Presencial',
      },
    };

    return modes[mode] || modes.virtual;
  };

  /**
   * Format event date
   */
  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  /**
   * Format event time
   */
  const formatEventTime = (timeString) => {
    if (!timeString) return '';
    // Time comes as "HH:MM" from backend
    return timeString;
  };

  /**
   * Loading State
   */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl border border-gray-200">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-3" />
        <p className="text-gray-600 font-medium">Cargando tus eventos...</p>
      </div>
    );
  }

  /**
   * Error State
   */
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-red-700 font-medium mb-2">Error al cargar eventos</p>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  /**
   * Empty State
   */
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
        <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2 font-medium">No tienes eventos próximos</p>
        <p className="text-sm text-gray-500 mb-4">
          Explora nuestros eventos y regístrate en los que te interesen
        </p>
        <button
          onClick={() => navigate('/dashboard/events')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium shadow-sm"
        >
          Ver eventos disponibles
        </button>
      </div>
    );
  }

  /**
   * Events Grid
   */
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((registration) => {
        const event = registration.event;
        if (!event) return null;

        const modeBadge = getModeBadge(event.mode);
        const ModeIcon = modeBadge.icon;

        return (
          <div
            key={registration._id}
            onClick={() => navigate('/dashboard/events')}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
          >
            {/* Event Image */}
            <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100 overflow-hidden">
              {event.image ? (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <CalendarDays className="w-20 h-20 text-primary-300" />
                </div>
              )}

              {/* Mode Badge */}
              <div className="absolute top-3 right-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${modeBadge.bg} ${modeBadge.text} shadow-md`}
                >
                  <ModeIcon className="w-3.5 h-3.5" />
                  {modeBadge.label}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-3">
              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                {event.title}
              </h3>

              {/* Date & Time */}
              <div className="space-y-2">
                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarDays className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  <span className="capitalize">{formatEventDate(event.date)}</span>
                </div>

                {/* Time */}
                {event.time && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-primary-500 flex-shrink-0" />
                    <span>{formatEventTime(event.time)}</span>
                  </div>
                )}
              </div>

              {/* Location / Link */}
              {event.mode === 'presencial' && event.location && (
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
              )}

              {event.mode === 'virtual' && event.eventLink && (
                <div className="flex items-start gap-2 text-sm text-blue-600">
                  <Monitor className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-1 font-medium">Evento virtual</span>
                </div>
              )}

              {/* Capacity Info */}
              {event.capacity && (
                <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <Users className="w-4 h-4" />
                  <span>
                    Capacidad: {event.registeredCount || 0} / {event.capacity}
                  </span>
                </div>
              )}

              {/* Registration Status */}
              <div className="pt-3 border-t border-gray-100">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                  ✓ Registrada
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

MyEventsList.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      event: PropTypes.shape({
        _id: PropTypes.string,
        title: PropTypes.string.isRequired,
        image: PropTypes.string,
        date: PropTypes.string.isRequired,
        time: PropTypes.string,
        mode: PropTypes.oneOf(['virtual', 'presencial']).isRequired,
        location: PropTypes.string,
        eventLink: PropTypes.string,
        capacity: PropTypes.number,
        registeredCount: PropTypes.number,
      }),
    })
  ),
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

export default MyEventsList;
