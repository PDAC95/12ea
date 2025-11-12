import { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import DashboardLayout from '../../dashboard/components/DashboardLayout';
import { ServiceList, ServiceFiltersBar, ServiceDetailModal } from '../components';
import useDebounce from '../../../shared/hooks/useDebounce';

/**
 * ServiceDirectoryPage - Página principal del directorio de servicios
 *
 * Ruta: /dashboard/services (protegida)
 *
 * Features:
 * - Header con título y descripción
 * - ServiceFiltersBar con búsqueda, tipo de servicio y ciudad
 * - Grid de servicios con ServiceList
 * - Paginación con scroll to top
 * - Modal de detalles al hacer click en card
 * - Debounce en búsqueda (300ms)
 * - Layout responsive con DashboardLayout
 * - Navegación integrada en sidebar
 *
 * Sprint 2 - US-006: Directorio de Servicios
 * - Task 6.5 ✅ Frontend - ServiceList Component
 *
 * @returns {JSX.Element} Página del directorio de servicios
 */
const ServiceDirectoryPage = () => {
  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [city, setCity] = useState('');

  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1);

  // Estados del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Debounce del término de búsqueda (300ms)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Resetear página a 1 cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, serviceType, city]);

  // Handler para limpiar todos los filtros
  const handleClearFilters = () => {
    setSearchTerm('');
    setServiceType('');
    setCity('');
    setCurrentPage(1); // Reset página
  };

  // Handler para cambiar de página
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);

    // Scroll to top suave
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Handler para abrir modal con servicio seleccionado
  const handleServiceClick = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  // Handler para cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  return (
    <DashboardLayout>
      {/* Header Section */}
      <div className="mb-8">
        {/* Icon + Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Directorio de Servicios</h1>
            <p className="text-gray-600 mt-1">
              Encuentra servicios esenciales para la comunidad latina
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
      </div>

      {/* Filters Bar */}
      <ServiceFiltersBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        serviceType={serviceType}
        onServiceTypeChange={setServiceType}
        city={city}
        onCityChange={setCity}
        onClearFilters={handleClearFilters}
      />

      {/* Service List - usa debouncedSearchTerm para evitar fetch excesivos */}
      <ServiceList
        searchTerm={debouncedSearchTerm}
        serviceType={serviceType}
        city={city}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onServiceClick={handleServiceClick}
      />

      {/* Service Detail Modal */}
      <ServiceDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        service={selectedService}
      />
    </DashboardLayout>
  );
};

export default ServiceDirectoryPage;
