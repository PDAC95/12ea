import { Calendar, Clock, MapPin, Video, Users } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * EventCard - Card individual de evento
 *
 * Features:
 * - Imagen de evento
 * - Título del evento
 * - Fecha y hora formateadas
 * - Modalidad (virtual/presencial)
 * - Cupos disponibles con indicador visual
 * - Clickeable con onClick handler
 * - Diseño compacto y responsive
 * - Hover effect sutil
 *
 * @param {Object} event - Datos del evento
 * @param {string} event._id - ID del evento
 * @param {string} event.title - Título del evento
 * @param {string} event.date - Fecha en formato ISO (YYYY-MM-DD)
 * @param {string} event.time - Hora en formato HH:MM
 * @param {string} event.mode - Modalidad: "virtual" | "presencial" | "híbrido"
 * @param {string} event.image - URL de la imagen
 * @param {string} event.location - Ubicación (opcional para presencial)
 * @param {number} event.capacity - Capacidad máxima
 * @param {number} event.registeredCount - Cantidad de registrados
 * @param {Function} onClick - Handler al hacer click en el card
 * @returns {JSX.Element} Card de evento
 */
const EventCard = ({ event, onClick }) => {
  /**
   * Formatea la fecha a un formato legible en español
   * @param {string} dateStr - Fecha en formato YYYY-MM-DD o ISO Date
   * @returns {string} Fecha formateada (ej: "20 Nov")
   */
  const formatDate = (dateStr) => {
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

  // Calcular cupos disponibles
  const availableSpots = event.capacity - (event.registeredCount || 0);
  const isFull = availableSpots <= 0;
  const isAlmostFull = availableSpots <= 5 && !isFull;

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
    >
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
          ) : event.mode === 'presencial' ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full shadow-sm">
              <MapPin className="w-3 h-3" />
              Presencial
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500 text-white text-xs font-medium rounded-full shadow-sm">
              <Video className="w-3 h-3" />
              Híbrido
            </span>
          )}
        </div>

        {/* Full Badge - Solo si está lleno */}
        {isFull && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-sm">
              LLENO
            </span>
          </div>
        )}
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

          {/* Location (solo para eventos presenciales o híbridos) */}
          {(event.mode === 'presencial' || event.mode === 'híbrido') && event.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-green-500" />
              <span className="truncate">{event.location}</span>
            </div>
          )}

          {/* Cupos disponibles */}
          <div className="flex items-center gap-2 text-sm">
            <Users
              className={`w-4 h-4 ${
                isFull ? 'text-red-500' : isAlmostFull ? 'text-orange-500' : 'text-gray-500'
              }`}
            />
            <span
              className={`font-medium ${
                isFull ? 'text-red-600' : isAlmostFull ? 'text-orange-600' : 'text-gray-600'
              }`}
            >
              {isFull
                ? 'Sin cupos'
                : isAlmostFull
                  ? `Quedan ${availableSpots} cupos`
                  : `${availableSpots} cupos disponibles`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    mode: PropTypes.oneOf(['virtual', 'presencial', 'híbrido']).isRequired,
    image: PropTypes.string.isRequired,
    location: PropTypes.string,
    capacity: PropTypes.number.isRequired,
    registeredCount: PropTypes.number,
  }).isRequired,
  onClick: PropTypes.func,
};

export default EventCard;
