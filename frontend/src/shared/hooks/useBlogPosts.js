import { useState, useEffect } from 'react';
import api from '../utils/api';

/**
 * useBlogPosts - Custom hook para obtener posts del blog
 *
 * Features:
 * - Data fetching con Axios
 * - Loading y error states
 * - Filtros: category
 * - Paginación
 * - Auto-refetch cuando cambian filtros
 * - Manejo de errores
 *
 * Sprint 3 - US-007: Blog Comunitario
 * Task 7.3 - Frontend BlogList Component
 *
 * @param {Object} params - Parámetros de filtros
 * @param {string} params.category - Categoría: 'emprendimiento' | 'salud' | 'educacion' | etc. | ''
 * @param {number} params.page - Número de página actual
 * @param {number} params.limit - Items por página (default: 9)
 * @returns {Object} { posts, loading, error, pagination, refetch }
 */
const useBlogPosts = ({ category = '', page = 1, limit = 9 } = {}) => {
  const [posts, setPosts] = useState([]);
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
   * Función para obtener posts del backend
   */
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Construir query params
      const params = {
        page,
        limit,
        status: 'published', // Solo posts publicados
      };

      // Agregar category solo si está definido
      if (category) {
        params.category = category;
      }

      // Hacer request al backend
      const response = await api.get('/blog', { params });

      // Extraer data y pagination del response
      // Backend response: { success, count, total, pagination, data }
      const { data: postsData, pagination: paginationData } = response.data;

      setPosts(postsData);
      setPagination(paginationData);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      const errorMessage =
        err.response?.data?.error?.message || 'Error al cargar los posts. Intenta de nuevo.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar fetchPosts cuando cambian los parámetros
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, page, limit]);

  return {
    posts,
    loading,
    error,
    pagination,
    refetch: fetchPosts, // Permitir refetch manual
  };
};

export default useBlogPosts;
