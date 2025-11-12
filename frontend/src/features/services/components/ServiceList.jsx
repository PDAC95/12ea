import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';
import ServiceCard from './ServiceCard';
import DirectoryCardSkeleton from '../../../shared/components/common/DirectoryCardSkeleton';
import Pagination from '../../../shared/components/common/Pagination';
import api from '../../../shared/utils/api';

/**
 * ServiceList - Lista principal de servicios con fetch y grid responsive
 *
 * Features:
 * - Fetch desde API /api/v1/services
 * - Soporta filtros: búsqueda, tipo de servicio, ciudad
 * - Paginación con 20 items por página
 * - Grid responsive (3 columnas desktop, 2 tablet, 1 móvil)
 * - Loading skeleton mientras carga
 * - Error handling con mensaje amigable
 * - Empty state si no hay servicios
 * - Retry automático en caso de error
 *
 * Sprint 2 - Task 6.5
 *
 * @param {Object} props
 * @param {string} props.searchTerm - Término de búsqueda (debounced)
 * @param {string} props.serviceType - Tipo de servicio seleccionado
 * @param {string} props.city - Ciudad seleccionada
 * @param {number} props.currentPage - Página actual
 * @param {Function} props.onPageChange - Callback al cambiar de página
 * @param {Function} props.onServiceClick - Callback al hacer click en un servicio
 * @returns {JSX.Element} Lista de servicios
 */
const ServiceList = ({
  searchTerm = '',
  serviceType = '',
  city = '',
  currentPage = 1,
  onPageChange,
  onServiceClick,
}) => {
  const [services, setServices] = useState([]);
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
   * Fetch de servicios desde la API con filtros y paginación
   */
  const fetchServices = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Construir query params basados en filtros activos + paginación
      const params = {
        page: currentPage,
        limit: 20, // 20 items por página
      };
      if (searchTerm) params.search = searchTerm;
      if (serviceType) params.serviceType = serviceType;
      if (city) params.city = city;

      // Fetch desde /api/v1/services con query params
      const response = await api.get('/services', { params });

      // Verificar estructura de respuesta
      if (response.data && response.data.success) {
        // Extraer datos y paginación
        const data = response.data.data;
        const serviceData = data?.items || data || [];

        setServices(serviceData);

        // Extraer información de paginación si existe
        if (data?.pagination) {
          setPagination(data.pagination);
        } else {
          // Fallback si no hay paginación en la respuesta
          setPagination({
            currentPage: 1,
            totalPages: 1,
            totalItems: serviceData.length,
            hasNext: false,
            hasPrev: false,
          });
        }
      } else {
        throw new Error('Formato de respuesta inválido');
      }
    } catch (err) {
      console.error('Error al obtener servicios:', err);
      setError(err.response?.data?.message || 'Error al cargar los servicios. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch cuando cambian los filtros o la página
  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, serviceType, city, currentPage]);

  /**
   * Render: Loading State
   */
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mostrar 6 skeletons mientras carga */}
        {[...Array(6)].map((_, index) => (
          <DirectoryCardSkeleton key={index} />
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
        <h3 className="text-lg font-semibold text-red-900 mb-2">Error al cargar servicios</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={fetchServices}
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
  if (services.length === 0) {
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
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay servicios disponibles
          </h3>
          <p className="text-gray-600">
            Pronto agregaremos servicios a nuestro directorio. ¡Vuelve pronto!
          </p>
        </div>
      </div>
    );
  }

  /**
   * Render: Success State - Grid de servicios
   */
  return (
    <div>
      {/* Header con contador */}
      <div className="mb-6">
        <p className="text-gray-600">
          Mostrando <span className="font-semibold text-gray-900">{services.length}</span> servicios
        </p>
      </div>

      {/* Grid de servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard
            key={service._id}
            service={service}
            onClick={() => onServiceClick && onServiceClick(service)}
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

ServiceList.propTypes = {
  searchTerm: PropTypes.string,
  serviceType: PropTypes.string,
  city: PropTypes.string,
  currentPage: PropTypes.number,
  onPageChange: PropTypes.func,
  onServiceClick: PropTypes.func,
};

export default ServiceList;
