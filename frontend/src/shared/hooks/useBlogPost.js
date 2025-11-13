import { useState, useEffect } from 'react';
import api from '../utils/api';

/**
 * useBlogPost - Custom hook para obtener un post individual por slug
 *
 * Features:
 * - Data fetching con Axios
 * - Loading y error states
 * - Auto-fetch cuando cambia el slug
 * - Manejo de errores (404, etc.)
 *
 * Sprint 3 - US-007: Blog Comunitario
 * Task 7.4 - Frontend BlogPost Component
 *
 * @param {string} slug - Slug del post a obtener
 * @returns {Object} { post, loading, error, refetch }
 */
const useBlogPost = (slug) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Función para obtener el post del backend
   */
  const fetchPost = async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Hacer request al backend
      const response = await api.get(`/blog/${slug}`);

      // Extraer post del response
      // Backend response: { success, data: post }
      const postData = response.data.data;

      setPost(postData);
    } catch (err) {
      console.error('Error fetching blog post:', err);

      if (err.response?.status === 404) {
        setError('Post no encontrado');
      } else {
        const errorMessage =
          err.response?.data?.error?.message || 'Error al cargar el post. Intenta de nuevo.';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar fetchPost cuando cambia el slug
  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return {
    post,
    loading,
    error,
    refetch: fetchPost, // Permitir refetch manual
  };
};

export default useBlogPost;
