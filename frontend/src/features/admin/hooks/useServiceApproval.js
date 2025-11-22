import { useState } from 'react';
import api from '../../../shared/utils/api';

/**
 * useServiceApproval - Custom hook para gestionar aprobación de servicios
 *
 * Features:
 * - Fetch de servicios pendientes con paginación
 * - Aprobar servicios (cambia status a "approved")
 * - Rechazar servicios (cambia status a "rejected" con razón)
 * - Estados de loading, error y paginación
 *
 * Sprint 5+ - Service Proposal System
 * Patrón basado en useBusinessApproval.js
 *
 * @returns {Object} - { services, loading, error, pagination, fetchPendingServices, approveService, rejectService }
 */
export const useServiceApproval = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 20,
  });

  /**
   * Fetch servicios pendientes desde el backend
   * @param {number} page - Número de página (default: 1)
   */
  const fetchPendingServices = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/admin/services/pending?page=${page}&limit=20`);
      setServices(response.data.data.services);
      setPagination(response.data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar servicios pendientes');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Aprobar un servicio pendiente
   * @param {string} serviceId - ID del servicio a aprobar
   * @returns {Promise} - Response del backend
   */
  const approveService = async (serviceId) => {
    try {
      const response = await api.patch(`/admin/services/${serviceId}/approve`);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Error al aprobar servicio');
    }
  };

  /**
   * Rechazar un servicio pendiente
   * @param {string} serviceId - ID del servicio a rechazar
   * @param {string} reason - Razón del rechazo (requerido)
   * @returns {Promise} - Response del backend
   */
  const rejectService = async (serviceId, reason) => {
    try {
      const response = await api.patch(`/admin/services/${serviceId}/reject`, {
        reason,
      });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Error al rechazar servicio');
    }
  };

  return {
    services,
    loading,
    error,
    pagination,
    fetchPendingServices,
    approveService,
    rejectService,
  };
};

export default useServiceApproval;
