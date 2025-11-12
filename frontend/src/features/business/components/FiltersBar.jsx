import { RotateCcw } from 'lucide-react';
import PropTypes from 'prop-types';
import SearchBar from '../../../shared/components/common/SearchBar';
import FilterDropdown from '../../../shared/components/common/FilterDropdown';
import { BUSINESS_CATEGORIES } from '../../../shared/constants/categories';

/**
 * FiltersBar - Barra de filtros completa para el directorio de negocios
 *
 * Features:
 * - SearchBar con búsqueda de texto
 * - Filtro por categoría (dropdown)
 * - Filtro por ciudad (dropdown)
 * - Botón "Limpiar filtros"
 * - Layout responsive (stack en móvil, grid en desktop)
 * - Contador de filtros activos
 *
 * Sprint 2 - Task 5.5
 *
 * @param {Object} props
 * @param {string} props.searchTerm - Término de búsqueda actual
 * @param {Function} props.onSearchChange - Callback para cambio de búsqueda
 * @param {string} props.category - Categoría seleccionada
 * @param {Function} props.onCategoryChange - Callback para cambio de categoría
 * @param {string} props.city - Ciudad seleccionada
 * @param {Function} props.onCityChange - Callback para cambio de ciudad
 * @param {Function} props.onClearFilters - Callback para limpiar todos los filtros
 * @returns {JSX.Element} Barra de filtros
 */
const FiltersBar = ({
  searchTerm,
  onSearchChange,
  category,
  onCategoryChange,
  city,
  onCityChange,
  onClearFilters,
}) => {
  // Opciones de categorías (generadas dinámicamente desde constantes)
  const categoryOptions = BUSINESS_CATEGORIES.map(category => ({
    value: category,
    label: category,
  }));

  // Opciones de ciudades (sync con backend)
  const cityOptions = [
    { value: 'Toronto', label: 'Toronto' },
    { value: 'Vancouver', label: 'Vancouver' },
    { value: 'Montreal', label: 'Montreal' },
    { value: 'Calgary', label: 'Calgary' },
    { value: 'Ottawa', label: 'Ottawa' },
    { value: 'Edmonton', label: 'Edmonton' },
  ];

  // Calcular número de filtros activos
  const activeFiltersCount = [searchTerm, category, city].filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm mb-6">
      {/* Filtros Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search Bar - Toma 2 columnas en desktop */}
        <div className="md:col-span-2">
          <SearchBar
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Buscar por nombre o descripción..."
          />
        </div>

        {/* Categoría Filter */}
        <div>
          <FilterDropdown
            value={category}
            onChange={onCategoryChange}
            options={categoryOptions}
            placeholder="Todas las categorías"
          />
        </div>

        {/* Ciudad Filter */}
        <div>
          <FilterDropdown
            value={city}
            onChange={onCityChange}
            options={cityOptions}
            placeholder="Todas las ciudades"
          />
        </div>
      </div>

      {/* Footer: Clear Filters Button */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {activeFiltersCount} {activeFiltersCount === 1 ? 'filtro' : 'filtros'} activo{activeFiltersCount === 1 ? '' : 's'}
          </p>

          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
};

FiltersBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  city: PropTypes.string.isRequired,
  onCityChange: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
};

export default FiltersBar;
