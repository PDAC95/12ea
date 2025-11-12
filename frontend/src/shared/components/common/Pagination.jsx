import { ChevronLeft, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * Pagination - Componente reutilizable de paginación
 *
 * Features:
 * - Muestra número de página actual y total
 * - Botones Previous/Next con iconos
 * - Deshabilita botones en límites (primera/última página)
 * - Información de items mostrados
 * - Responsive design
 * - Navegación por teclado (disabled states)
 *
 * Sprint 2 - Task 5.7
 *
 * @param {Object} props
 * @param {number} props.currentPage - Página actual (1-indexed)
 * @param {number} props.totalPages - Total de páginas
 * @param {number} props.totalItems - Total de items (opcional, para mostrar contador)
 * @param {number} props.itemsPerPage - Items por página (opcional)
 * @param {Function} props.onPageChange - Callback al cambiar de página
 * @returns {JSX.Element|null} Componente de paginación o null si solo hay 1 página
 */
const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 20,
  onPageChange,
}) => {
  // No mostrar paginación si solo hay 1 página o menos
  if (totalPages <= 1) {
    return null;
  }

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  // Calcular rango de items mostrados
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems || 0);

  const handlePrevious = () => {
    if (!isFirstPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (!isLastPage) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-gray-200">
      {/* Info de items (opcional) */}
      {totalItems !== undefined && (
        <div className="text-sm text-gray-600">
          Mostrando{' '}
          <span className="font-medium text-gray-900">{startItem}</span> a{' '}
          <span className="font-medium text-gray-900">{endItem}</span> de{' '}
          <span className="font-medium text-gray-900">{totalItems}</span> resultados
        </div>
      )}

      {/* Controles de paginación */}
      <div className="flex items-center gap-2">
        {/* Botón Previous */}
        <button
          onClick={handlePrevious}
          disabled={isFirstPage}
          className={`
            inline-flex items-center gap-2 px-4 py-2 border rounded-lg font-medium transition-colors
            ${
              isFirstPage
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
            }
          `}
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        {/* Indicador de página */}
        <div className="px-4 py-2 text-sm font-medium text-gray-700">
          Página{' '}
          <span className="text-primary-600 font-semibold">{currentPage}</span> de{' '}
          <span className="font-semibold">{totalPages}</span>
        </div>

        {/* Botón Next */}
        <button
          onClick={handleNext}
          disabled={isLastPage}
          className={`
            inline-flex items-center gap-2 px-4 py-2 border rounded-lg font-medium transition-colors
            ${
              isLastPage
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
            }
          `}
          aria-label="Página siguiente"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalItems: PropTypes.number,
  itemsPerPage: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
