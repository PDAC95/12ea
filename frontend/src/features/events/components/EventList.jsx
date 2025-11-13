import { useState } from 'react';
import PropTypes from 'prop-types';
import { Calendar, AlertCircle } from 'lucide-react';
import EventCard from '../../dashboard/components/EventCard';
import DirectoryCardSkeleton from '../../../shared/components/common/DirectoryCardSkeleton';
import Pagination from '../../../shared/components/common/Pagination';
import useEvents from '../../../shared/hooks/useEvents';

/**
 * EventList - Lista de eventos con filtros y paginación
 *
 * Features:
 * - Grid responsive de eventos (3 cols desktop, 2 tablet, 1 móvil)
 * - Filtros por modalidad (virtual/presencial/híbrido)
 * - Loading states con skeletons
 * - Empty state cuando no hay eventos
 * - Error state
 * - Paginación integrada
 * - Click handler para abrir detalle
 *
 * Sprint 3 - US-004: Ver y Registrarse en Eventos
 * Task 4.6 - Frontend EventList Component
 *
 * @param {Function} onEventClick - Handler al hacer click en un evento
 * @returns {JSX.Element} Lista de eventos
 */
const EventList = ({ onEventClick }) => {
  // Estados de filtros
  const [selectedMode, setSelectedMode] = useState(''); // '' = todos, 'virtual', 'presencial', 'híbrido'
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch events usando custom hook
  const { events, loading, error, pagination } = useEvents({
    mode: selectedMode,
    page: currentPage,
    limit: 12,
  });

  /**
   * Handler para cambiar filtro de modalidad
   */
  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    setCurrentPage(1); // Reset a página 1 al cambiar filtros
  };

  /**
   * Handler para cambiar de página
   */
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);

    // Scroll to top suave
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  /**
   * Opciones de filtro de modalidad
   */
  const modeFilters = [
    { value: '', label: 'Todos los eventos' },
    { value: 'virtual', label: 'Virtual' },
    { value: 'presencial', label: 'Presencial' },
    { value: 'híbrido', label: 'Híbrido' },
  ];

  return (
    <div className="space-y-6">
      {/* Filtros de Modalidad */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Modalidad</h3>
        <div className="flex flex-wrap gap-2">
          {modeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleModeChange(filter.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedMode === filter.value
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Contador de resultados */}
        {!loading && !error && (
          <p className="text-sm text-gray-600 mt-3">
            {pagination.total} {pagination.total === 1 ? 'evento encontrado' : 'eventos encontrados'}
          </p>
        )}
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
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-700 font-medium mb-2">Error al cargar eventos</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && events.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay eventos disponibles</h3>
          <p className="text-gray-600 mb-4">
            {selectedMode
              ? `No encontramos eventos con la modalidad "${selectedMode}".`
              : 'No hay eventos próximos en este momento.'}
          </p>
          {selectedMode && (
            <button
              onClick={() => handleModeChange('')}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              Ver todos los eventos
            </button>
          )}
        </div>
      )}

      {/* Events Grid */}
      {!loading && !error && events.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} onClick={() => onEventClick(event)} />
            ))}
          </div>

          {/* Paginación */}
          {pagination.pages > 1 && (
            <div className="flex justify-center pt-4">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

EventList.propTypes = {
  onEventClick: PropTypes.func.isRequired,
};

export default EventList;
