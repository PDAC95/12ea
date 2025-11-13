import { useState } from 'react';
import PropTypes from 'prop-types';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import EventCard from '../../dashboard/components/EventCard';
import DirectoryCardSkeleton from '../../../shared/components/common/DirectoryCardSkeleton';

/**
 * MyEventsSection - Sección de "Mis Eventos" con tabs próximos/pasados
 *
 * Features:
 * - Tabs para cambiar entre próximos y pasados
 * - Grid responsive de eventos (3 cols desktop, 2 tablet, 1 móvil)
 * - Click en evento para ver detalle
 * - Loading states con skeletons
 * - Empty states personalizados por tab
 * - Error state
 * - Contador de eventos por categoría
 *
 * Sprint 3 - US-004: Ver y Registrarse en Eventos
 * Task 4.8 - Frontend MyEvents Section
 *
 * @param {Object} props
 * @param {Array} props.upcomingEvents - Eventos próximos
 * @param {Array} props.pastEvents - Eventos pasados
 * @param {boolean} props.loading - Estado de carga
 * @param {string} props.error - Mensaje de error
 * @param {Function} props.onEventClick - Handler al hacer click en un evento
 * @returns {JSX.Element} Sección de mis eventos
 */
const MyEventsSection = ({ upcomingEvents, pastEvents, loading, error, onEventClick }) => {
  // Estado del tab activo: 'upcoming' | 'past'
  const [activeTab, setActiveTab] = useState('upcoming');

  // Determinar eventos a mostrar según tab activo
  const eventsToShow = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  /**
   * Tabs configuration
   */
  const tabs = [
    {
      id: 'upcoming',
      label: 'Próximos Eventos',
      count: upcomingEvents.length,
      icon: Calendar,
    },
    {
      id: 'past',
      label: 'Eventos Pasados',
      count: pastEvents.length,
      icon: Clock,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${
                    isActive
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`
                      ml-2 py-0.5 px-2 rounded-full text-xs font-semibold
                      ${
                        isActive
                          ? 'bg-primary-100 text-primary-600'
                          : 'bg-gray-100 text-gray-600'
                      }
                    `}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <DirectoryCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-700 font-medium mb-2">Error al cargar tus eventos</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Empty State - Próximos */}
      {!loading && !error && activeTab === 'upcoming' && upcomingEvents.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No tienes eventos próximos
          </h3>
          <p className="text-gray-600 mb-4">
            Explora el catálogo de eventos y regístrate en actividades que te interesen.
          </p>
          <a
            href="/dashboard/events"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            <Calendar className="w-4 h-4" />
            Ver eventos disponibles
          </a>
        </div>
      )}

      {/* Empty State - Pasados */}
      {!loading && !error && activeTab === 'past' && pastEvents.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay eventos pasados</h3>
          <p className="text-gray-600">Aún no has asistido a ningún evento.</p>
        </div>
      )}

      {/* Events Grid */}
      {!loading && !error && eventsToShow.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventsToShow.map((registration) => {
            // El evento viene en registration.event (populated)
            const event = registration.event;

            return (
              <div key={registration._id} className="relative">
                <EventCard event={event} onClick={() => onEventClick(event)} />

                {/* Badge de "Registrado" en esquina superior izquierda */}
                <div className="absolute top-2 left-2 z-10">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded-full shadow-lg">
                    ✓ Registrado
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info adicional si está viendo pasados */}
      {!loading && !error && activeTab === 'past' && pastEvents.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Los eventos pasados se mantienen en tu historial para que puedas
            recordar las actividades en las que participaste.
          </p>
        </div>
      )}
    </div>
  );
};

MyEventsSection.propTypes = {
  upcomingEvents: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
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
    })
  ).isRequired,
  pastEvents: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
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
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onEventClick: PropTypes.func.isRequired,
};

export default MyEventsSection;
