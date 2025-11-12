import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';
import BusinessCard from './BusinessCard';
import BusinessCardSkeleton from './BusinessCardSkeleton';
import Pagination from '../../../shared/components/common/Pagination';
import api from '../../../shared/utils/api';

/**
 * BusinessList - Lista principal de negocios con fetch y grid responsive
 *
 * Features:
 * - Fetch desde API /api/v1/businesses
 * - Soporta filtros: búsqueda, categoría, ciudad
 * - Paginación con 20 items por página
 * - Grid responsive (3 columnas desktop, 2 tablet, 1 móvil)
 * - Loading skeleton mientras carga
 * - Error handling con mensaje amigable
 * - Empty state si no hay negocios
 * - Retry automático en caso de error
 *
 * Sprint 2 - Task 5.4 + 5.5 + 5.7
 *
 * @param {Object} props
 * @param {string} props.searchTerm - Término de búsqueda (debounced)
 * @param {string} props.category - Categoría seleccionada
 * @param {string} props.city - Ciudad seleccionada
 * @param {number} props.currentPage - Página actual
 * @param {Function} props.onPageChange - Callback al cambiar de página
 * @param {Function} props.onBusinessClick - Callback al hacer click en un negocio
 * @returns {JSX.Element} Lista de negocios
 */
const BusinessList = ({
  searchTerm = '',
  category = '',
  city = '',
  currentPage = 1,
  onPageChange,
  onBusinessClick,
}) => {
  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false,
  });

  /**
   * Fetch de negocios desde la API con filtros y paginación
   */
  const fetchBusinesses = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Construir query params basados en filtros activos + paginación
      const params = {
        page: currentPage,
        limit: 20, // 20 items por página
      };
      if (searchTerm) params.search = searchTerm;
      if (category) params.category = category;
      if (city) params.city = city;

      // Fetch desde /api/v1/businesses con query params
      const response = await api.get('/businesses', { params });

      // Verificar estructura de respuesta
      if (response.data && response.data.success) {
        // Extraer datos y paginación
        const data = response.data.data;
        const businessData = data?.items || data || [];

        setBusinesses(businessData);

        // Extraer información de paginación si existe
        if (data?.pagination) {
          setPagination(data.pagination);
        } else {
          // Fallback si no hay paginación en la respuesta
          setPagination({
            currentPage: 1,
            totalPages: 1,
            totalItems: businessData.length,
            hasNext: false,
            hasPrev: false,
          });
        }
      } else {
        throw new Error('Formato de respuesta inválido');
      }
    } catch (err) {
      console.error('Error al obtener negocios:', err);
      setError(err.response?.data?.message || 'Error al cargar los negocios. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch cuando cambian los filtros o la página
  useEffect(() => {
    fetchBusinesses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, category, city, currentPage]);

  /**
   * Render: Loading State
   */
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mostrar 6 skeletons mientras carga */}
        {[...Array(6)].map((_, index) => (
          <BusinessCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  /**
   * Render: Error State
   */
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-900 mb-2">Error al cargar negocios</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={fetchBusinesses}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  /**
   * Render: Empty State
   */
  if (businesses.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay negocios disponibles
          </h3>
          <p className="text-gray-600">
            Pronto agregaremos negocios a nuestro directorio. ¡Vuelve pronto!
          </p>
        </div>
      </div>
    );
  }

  /**
   * Render: Success State - Grid de negocios
   */
  return (
    <div>
      {/* Header con contador */}
      <div className="mb-6">
        <p className="text-gray-600">
          Mostrando <span className="font-semibold text-gray-900">{businesses.length}</span> negocios
        </p>
      </div>

      {/* Grid de negocios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((business) => (
          <BusinessCard
            key={business._id}
            business={business}
            onClick={() => onBusinessClick && onBusinessClick(business)}
          />
        ))}
      </div>

      {/* Paginación */}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        itemsPerPage={20}
        onPageChange={onPageChange}
      />
    </div>
  );
};

BusinessList.propTypes = {
  searchTerm: PropTypes.string,
  category: PropTypes.string,
  city: PropTypes.string,
  currentPage: PropTypes.number,
  onPageChange: PropTypes.func,
  onBusinessClick: PropTypes.func,
};

export default BusinessList;
