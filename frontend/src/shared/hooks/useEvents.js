import { useState, useEffect } from 'react';
import api from '../utils/api';

/**
 * useEvents - Custom hook para obtener eventos con filtros
 *
 * Features:
 * - Data fetching con Axios
 * - Loading y error states
 * - Filtros: mode (modalidad), futureOnly
 * - Paginación
 * - Auto-refetch cuando cambian filtros
 * - Manejo de errores
 *
 * Sprint 3 - US-004: Ver y Registrarse en Eventos
 * Task 4.6 - Frontend EventList Component
 *
 * @param {Object} params - Parámetros de filtros
 * @param {string} params.mode - Modalidad: 'virtual' | 'presencial' | 'híbrido' | ''
 * @param {number} params.page - Número de página actual
 * @param {number} params.limit - Items por página (default: 12)
 * @returns {Object} { events, loading, error, pagination, refetch }
 */
const useEvents = ({ mode = '', page = 1, limit = 12 } = {}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false,
  });

  /**
   * Función para obtener eventos del backend
   */
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Construir query params
      const params = {
        page,
        limit,
        futureOnly: true, // Solo eventos futuros
      };

      // Agregar mode solo si está definido
      if (mode) {
        params.mode = mode;
      }

      // Hacer request al backend
      const response = await api.get('/events', { params });

      // Extraer data y pagination del response
      // Backend response: { success, count, total, pagination, data }
      const { data: eventsData, pagination: paginationData } = response.data;

      setEvents(eventsData);
      setPagination(paginationData);
    } catch (err) {
      console.error('Error fetching events:', err);
      const errorMessage =
        err.response?.data?.error?.message || 'Error al cargar los eventos. Intenta de nuevo.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar fetchEvents cuando cambian los parámetros
  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, page, limit]);

  return {
    events,
    loading,
    error,
    pagination,
    refetch: fetchEvents, // Permitir refetch manual
  };
};

export default useEvents;
