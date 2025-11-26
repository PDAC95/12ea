import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

/**
 * useAdminUsers - Custom hook para gestión admin de usuarios
 *
 * Features:
 * - Obtener lista de usuarios con paginación y búsqueda
 * - Actualizar usuario (role, status)
 * - Eliminar usuario
 * - Estados de loading y error
 *
 * Sprint 5+ - Panel Admin de Usuarios
 *
 * @returns {Object} Hook state and methods
 */
const useAdminUsers = () => {
  const [users, setUsers] = useState([]);
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
   * Fetch users con paginación y búsqueda
   */
  const fetchUsers = useCallback(async (page = 1, search = '') => {
    console.log('🔍 [DEBUG] Fetching admin users...');
    console.log('📋 [DEBUG] Params:', { page, search, limit: pagination.limit });

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

      console.log('📡 [DEBUG] Making request to /admin/users with params:', params);
      const response = await api.get('/admin/users', { params });

      console.log('✅ [DEBUG] Response received:', response.data);
      console.log('📊 [DEBUG] Users data:', response.data.data?.users);
      console.log('📈 [DEBUG] Total users:', response.data.data?.pagination?.total);

      // FIX: Backend retorna { success, data: { users, pagination } }
      // No response.data.users sino response.data.data.users
      const users = response.data.data?.users || [];
      const paginationData = response.data.data?.pagination || {};

      console.log('💾 [DEBUG] Setting users:', users.length, 'usuarios');

      setUsers(users);
      setPagination({
        total: paginationData.total || 0,
        page: paginationData.page || 1,
        limit: paginationData.limit || 10,
        totalPages: paginationData.totalPages || 0,
        hasNext: paginationData.hasNext || false,
        hasPrev: paginationData.hasPrev || false,
      });
    } catch (err) {
      console.error('❌ [DEBUG] Error fetching users:', err);
      console.error('❌ [DEBUG] Error response:', err.response?.data);
      setError(err.response?.data?.message || err.response?.data?.error?.message || 'Error al cargar los usuarios');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  /**
   * Actualizar usuario (role, isActive, isVerified)
   */
  const updateUser = async (userId, userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.put(`/admin/users/${userId}`, userData);

      // Actualizar en la lista local
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, ...response.data.data } : user
        )
      );

      return { success: true, data: response.data.data };
    } catch (err) {
      console.error('Error updating user:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error?.message || 'Error al actualizar el usuario';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Eliminar usuario
   */
  const deleteUser = async (userId) => {
    setLoading(true);
    setError(null);

    try {
      await api.delete(`/admin/users/${userId}`);

      // Remover de la lista local
      setUsers((prev) => prev.filter((user) => user._id !== userId));

      // Actualizar total
      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
      }));

      return { success: true };
    } catch (err) {
      console.error('Error deleting user:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error?.message || 'Error al eliminar el usuario';
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
      fetchUsers(1, query);
    },
    [fetchUsers]
  );

  /**
   * Cambiar de página
   */
  const handlePageChange = useCallback(
    (newPage) => {
      fetchUsers(newPage, searchQuery);
    },
    [fetchUsers, searchQuery]
  );

  /**
   * Fetch inicial
   */
  useEffect(() => {
    fetchUsers(1, '');
  }, []);

  return {
    // State
    users,
    pagination,
    loading,
    error,
    searchQuery,

    // Methods
    fetchUsers,
    updateUser,
    deleteUser,
    handleSearch,
    handlePageChange,
    setError,
  };
};

export default useAdminUsers;
