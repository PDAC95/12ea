import { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import DashboardLayout from '../../dashboard/components/DashboardLayout';
import { BusinessList, FiltersBar, BusinessDetailModal } from '../components';
import useDebounce from '../../../shared/hooks/useDebounce';

/**
 * BusinessDirectoryPage - Página principal del directorio de negocios
 *
 * Ruta: /dashboard/businesses (protegida)
 *
 * Features:
 * - Header con título y descripción
 * - FiltersBar con búsqueda, categoría y ciudad
 * - Grid de negocios con BusinessList
 * - Paginación con scroll to top
 * - Modal de detalles al hacer click en card
 * - Debounce en búsqueda (300ms)
 * - Layout responsive con DashboardLayout
 * - Navegación integrada en sidebar
 *
 * Sprint 2 - US-005: Directorio de Negocios
 * - Task 5.4 ✅ Frontend - BusinessList Component
 * - Task 5.5 ✅ Frontend - Búsqueda y Filtros
 * - Task 5.6 ✅ Frontend - Vista Detallada
 * - Task 5.7 ✅ Frontend - Paginación
 *
 * @returns {JSX.Element} Página del directorio de negocios
 */
const BusinessDirectoryPage = () => {
  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');

  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1);

  // Estados del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  // Debounce del término de búsqueda (300ms)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Resetear página a 1 cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, category, city]);

  // Handler para limpiar todos los filtros
  const handleClearFilters = () => {
    setSearchTerm('');
    setCategory('');
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

  // Handler para abrir modal con negocio seleccionado
  const handleBusinessClick = (business) => {
    setSelectedBusiness(business);
    setIsModalOpen(true);
  };

  // Handler para cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBusiness(null);
  };

  return (
    <DashboardLayout>
      {/* Header Section */}
      <div className="mb-8">
        {/* Icon + Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Directorio de Negocios</h1>
            <p className="text-gray-600 mt-1">
              Descubre negocios de mujeres latinas emprendedoras
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
      </div>

      {/* Filters Bar */}
      <FiltersBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        category={category}
        onCategoryChange={setCategory}
        city={city}
        onCityChange={setCity}
        onClearFilters={handleClearFilters}
      />

      {/* Business List - usa debouncedSearchTerm para evitar fetch excesivos */}
      <BusinessList
        searchTerm={debouncedSearchTerm}
        category={category}
        city={city}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onBusinessClick={handleBusinessClick}
      />

      {/* Business Detail Modal */}
      <BusinessDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        business={selectedBusiness}
      />

      {/* TODO: Agregar en futuros sprints:
          - Testing E2E automatizado
          - Optimizaciones de performance
          - Exportación de resultados a CSV/PDF
      */}
    </DashboardLayout>
  );
};

export default BusinessDirectoryPage;
