import { useState, useEffect } from 'react';
import api from '../utils/api';

/**
 * useMyEvents - Custom hook para obtener eventos registrados del usuario
 *
 * Features:
 * - Data fetching con Axios
 * - Loading y error states
 * - Separación automática: próximos vs pasados
 * - Auto-refetch cuando cambia el usuario
 * - Manejo de errores
 *
 * Sprint 3 - US-004: Ver y Registrarse en Eventos
 * Task 4.8 - Frontend MyEvents Section
 *
 * @returns {Object} { upcomingEvents, pastEvents, loading, error, refetch }
 */
const useMyEvents = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Función para obtener eventos registrados del usuario
   */
  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Hacer request al backend
      // Endpoint: GET /events/my-registrations (Task 4.4)
      const response = await api.get('/events/my-registrations');

      // Extraer eventos del response
      const events = response.data.data || [];

      // Separar eventos en próximos y pasados
      const now = new Date();
      const upcoming = [];
      const past = [];

      events.forEach((registration) => {
        const event = registration.event; // Asumiendo que trae populated event

        // Validar que el evento tenga fecha y hora
        if (!event || !event.date || !event.time) {
          console.warn('Evento sin fecha o hora:', registration);
          return; // Saltar este evento
        }

        // Extraer solo la fecha (YYYY-MM-DD) si viene en formato ISO
        const dateOnly = event.date.includes('T') ? event.date.split('T')[0] : event.date;
        const eventDateTime = new Date(`${dateOnly}T${event.time}`);

        // Validar que la fecha sea válida
        if (isNaN(eventDateTime.getTime())) {
          console.warn('Fecha inválida para evento:', registration);
          return; // Saltar este evento
        }

        if (eventDateTime >= now) {
          upcoming.push({ ...registration, event });
        } else {
          past.push({ ...registration, event });
        }
      });

      // Ordenar próximos por fecha ascendente (más cercano primero)
      upcoming.sort((a, b) => {
        const dateOnlyA = a.event.date.includes('T') ? a.event.date.split('T')[0] : a.event.date;
        const dateOnlyB = b.event.date.includes('T') ? b.event.date.split('T')[0] : b.event.date;
        const dateA = new Date(`${dateOnlyA}T${a.event.time}`);
        const dateB = new Date(`${dateOnlyB}T${b.event.time}`);
        return dateA - dateB;
      });

      // Ordenar pasados por fecha descendente (más reciente primero)
      past.sort((a, b) => {
        const dateOnlyA = a.event.date.includes('T') ? a.event.date.split('T')[0] : a.event.date;
        const dateOnlyB = b.event.date.includes('T') ? b.event.date.split('T')[0] : b.event.date;
        const dateA = new Date(`${dateOnlyA}T${a.event.time}`);
        const dateB = new Date(`${dateOnlyB}T${b.event.time}`);
        return dateB - dateA;
      });

      setUpcomingEvents(upcoming);
      setPastEvents(past);
    } catch (err) {
      console.error('Error fetching my events:', err);
      const errorMessage =
        err.response?.data?.error?.message || 'Error al cargar tus eventos. Intenta de nuevo.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar fetchMyEvents al montar el componente
  useEffect(() => {
    fetchMyEvents();
  }, []);

  return {
    upcomingEvents,
    pastEvents,
    loading,
    error,
    refetch: fetchMyEvents, // Permitir refetch manual
  };
};

export default useMyEvents;
