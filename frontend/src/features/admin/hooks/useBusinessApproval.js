import { useState } from 'react';
import api from '../../../shared/utils/api';

/**
 * useBusinessApproval - Custom hook para gestionar aprobación de negocios
 *
 * Features:
 * - Fetch de negocios pendientes con paginación
 * - Aprobar negocios (cambia status a "approved")
 * - Rechazar negocios (cambia status a "rejected" con razón)
 * - Estados de loading, error y paginación
 *
 * Sprint 5+ - Business Proposal System
 * PLAN-BUSINESS-PROPOSAL-SYSTEM.md - PARTE 2
 *
 * @returns {Object} - { businesses, loading, error, pagination, fetchPendingBusinesses, approveBusiness, rejectBusiness }
 */
export const useBusinessApproval = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 20,
  });

  /**
   * Fetch negocios pendientes desde el backend
   * @param {number} page - Número de página (default: 1)
   */
  const fetchPendingBusinesses = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/admin/business/pending?page=${page}&limit=20`);
      setBusinesses(response.data.data.businesses);
      setPagination(response.data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar negocios pendientes');
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Aprobar un negocio pendiente
   * @param {string} businessId - ID del negocio a aprobar
   * @returns {Promise} - Response del backend
   */
  const approveBusiness = async (businessId) => {
    try {
      const response = await api.patch(`/admin/business/${businessId}/approve`);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Error al aprobar negocio');
    }
  };

  /**
   * Rechazar un negocio pendiente
   * @param {string} businessId - ID del negocio a rechazar
   * @param {string} reason - Razón del rechazo (requerido)
   * @returns {Promise} - Response del backend
   */
  const rejectBusiness = async (businessId, reason) => {
    try {
      const response = await api.patch(`/admin/business/${businessId}/reject`, {
        reason,
      });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Error al rechazar negocio');
    }
  };

  return {
    businesses,
    loading,
    error,
    pagination,
    fetchPendingBusinesses,
    approveBusiness,
    rejectBusiness,
  };
};

export default useBusinessApproval;
