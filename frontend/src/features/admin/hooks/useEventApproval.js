import { useState } from 'react';
import api from '../../../shared/utils/api';

/**
 * useEventApproval - Custom hook para gestionar aprobación de eventos
 *
 * Features:
 * - Fetch de eventos pendientes con paginación
 * - Aprobar eventos (cambia status a "approved" e isActive=true)
 * - Rechazar eventos (cambia status a "rejected")
 * - Estados de loading, error y paginación
 *
 * Sprint 5 - US-5.10: User Submission Workflows
 * Task 5.10.3 - Admin Approval Workflow
 *
 * @returns {Object} - { events, loading, error, pagination, fetchPendingEvents, approveEvent, rejectEvent }
 */
export const useEventApproval = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
  });

  /**
   * Fetch eventos pendientes desde el backend
   * @param {number} page - Número de página (default: 1)
   */
  const fetchPendingEvents = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/admin/events/pending?page=${page}&limit=10`);
      setEvents(response.data.data.events);
      setPagination(response.data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar eventos pendientes');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Aprobar un evento pendiente
   * @param {string} eventId - ID del evento a aprobar
   * @returns {Promise} - Response del backend
   */
  const approveEvent = async (eventId) => {
    try {
      const response = await api.patch(`/admin/events/${eventId}/approve`);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Error al aprobar evento');
    }
  };

  /**
   * Rechazar un evento pendiente
   * @param {string} eventId - ID del evento a rechazar
   * @param {string} reason - Razón del rechazo (opcional)
   * @returns {Promise} - Response del backend
   */
  const rejectEvent = async (eventId, reason) => {
    try {
      const response = await api.patch(`/admin/events/${eventId}/reject`, {
        reason: reason || undefined,
      });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Error al rechazar evento');
    }
  };

  return {
    events,
    loading,
    error,
    pagination,
    fetchPendingEvents,
    approveEvent,
    rejectEvent,
  };
};
