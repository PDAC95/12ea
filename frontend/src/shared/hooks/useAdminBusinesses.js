import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

/**
 * useAdminBusinesses - Custom hook para gestión admin de negocios
 *
 * Features:
 * - Obtener lista de negocios con paginación y búsqueda
 * - Crear nuevo negocio
 * - Actualizar negocio existente
 * - Eliminar negocio
 * - Estados de loading y error
 *
 * Sprint 3 - US-009: Panel Admin
 * Task 9.7 - AdminBusinessList
 *
 * @returns {Object} Hook state and methods
 */
const useAdminBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Fetch businesses con paginación y búsqueda
   */
  const fetchBusinesses = useCallback(async (page = 1, search = '') => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page,
        limit: pagination.limit,
      };

      if (search) {
        params.search = search;
      }

      const response = await api.get('/businesses', { params });

      setBusinesses(response.data.businesses || []);
      setPagination({
        total: response.data.total || 0,
        page: response.data.page || 1,
        limit: response.data.limit || 10,
        totalPages: response.data.totalPages || 0,
        hasNext: response.data.hasNext || false,
        hasPrev: response.data.hasPrev || false,
      });
    } catch (err) {
      console.error('Error fetching businesses:', err);
      setError(err.response?.data?.message || 'Error al cargar los negocios');
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  /**
   * Crear nuevo negocio
   */
  const createBusiness = async (businessData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/businesses', businessData);

      // Refetch para actualizar lista
      await fetchBusinesses(pagination.page, searchQuery);

      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error creating business:', err);
      const errorMessage = err.response?.data?.message || 'Error al crear el negocio';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualizar negocio existente
   */
  const updateBusiness = async (businessId, businessData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.put(`/businesses/${businessId}`, businessData);

      // Actualizar en la lista local
      setBusinesses((prev) =>
        prev.map((business) =>
          business._id === businessId ? { ...business, ...response.data } : business
        )
      );

      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error updating business:', err);
      const errorMessage = err.response?.data?.message || 'Error al actualizar el negocio';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Eliminar negocio
   */
  const deleteBusiness = async (businessId) => {
    setLoading(true);
    setError(null);

    try {
      await api.delete(`/businesses/${businessId}`);

      // Remover de la lista local
      setBusinesses((prev) => prev.filter((business) => business._id !== businessId));

      // Actualizar total
      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
      }));

      return { success: true };
    } catch (err) {
      console.error('Error deleting business:', err);
      const errorMessage = err.response?.data?.message || 'Error al eliminar el negocio';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Búsqueda con debounce
   */
  const handleSearch = useCallback(
    (query) => {
      setSearchQuery(query);
      fetchBusinesses(1, query);
    },
    [fetchBusinesses]
  );

  /**
   * Cambiar de página
   */
  const handlePageChange = useCallback(
    (newPage) => {
      fetchBusinesses(newPage, searchQuery);
    },
    [fetchBusinesses, searchQuery]
  );

  /**
   * Fetch inicial
   */
  useEffect(() => {
    fetchBusinesses(1, '');
  }, []);

  return {
    // State
    businesses,
    pagination,
    loading,
    error,
    searchQuery,

    // Methods
    fetchBusinesses,
    createBusiness,
    updateBusiness,
    deleteBusiness,
    handleSearch,
    handlePageChange,
    setError,
  };
};

export default useAdminBusinesses;
