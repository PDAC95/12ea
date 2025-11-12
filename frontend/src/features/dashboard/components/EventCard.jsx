import { Calendar, Clock, MapPin, Video } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * EventCard - Card individual de evento
 *
 * Features:
 * - Imagen de evento
 * - Título del evento
 * - Fecha y hora formateadas
 * - Modalidad (virtual/presencial)
 * - Diseño compacto y responsive
 * - Hover effect sutil
 *
 * @param {Object} event - Datos del evento
 * @param {number} event.id - ID del evento
 * @param {string} event.title - Título del evento
 * @param {string} event.date - Fecha en formato ISO (YYYY-MM-DD)
 * @param {string} event.time - Hora en formato HH:MM
 * @param {string} event.mode - Modalidad: "virtual" o "presencial"
 * @param {string} event.image - URL de la imagen
 * @param {string} event.location - Ubicación (opcional para presencial)
 * @returns {JSX.Element} Card de evento
 */
const EventCard = ({ event }) => {
  /**
   * Formatea la fecha a un formato legible en español
   * @param {string} dateStr - Fecha en formato YYYY-MM-DD
   * @returns {string} Fecha formateada (ej: "20 Nov")
   */
  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00'); // Agregar hora para evitar timezone issues
    const months = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  };

  /**
   * Formatea la hora a formato 12h
   * @param {string} timeStr - Hora en formato HH:MM
   * @returns {string} Hora formateada (ej: "6:00 PM")
   */
  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
      {/* Event Image */}
      <div className="relative h-40 overflow-hidden bg-gray-100">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Mode Badge */}
        <div className="absolute top-3 right-3">
          {event.mode === 'virtual' ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded-full shadow-sm">
              <Video className="w-3 h-3" />
              Virtual
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full shadow-sm">
              <MapPin className="w-3 h-3" />
              Presencial
            </span>
          )}
        </div>
      </div>

      {/* Event Info */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {event.title}
        </h3>

        {/* Date & Time */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-primary-500" />
            <span>{formatDate(event.date)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-primary-500" />
            <span>{formatTime(event.time)}</span>
          </div>

          {/* Location (solo para eventos presenciales) */}
          {event.mode === 'presencial' && event.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-green-500" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    mode: PropTypes.oneOf(['virtual', 'presencial']).isRequired,
    image: PropTypes.string.isRequired,
    location: PropTypes.string,
  }).isRequired,
};

export default EventCard;
