import { useState } from 'react';
import { AlertCircle, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';
import BlogCard from './BlogCard';
import DirectoryCardSkeleton from '../../../shared/components/common/DirectoryCardSkeleton';
import useBlogPosts from '../../../shared/hooks/useBlogPosts';

/**
 * BlogList - Lista de posts del blog con filtros y paginación
 *
 * Features:
 * - Grid responsive (3 cols desktop, 2 tablet, 1 móvil)
 * - Filtros por categoría con botones
 * - Paginación funcional
 * - Loading states con skeletons
 * - Empty state personalizado
 * - Error state
 * - Click en card para ver post completo
 *
 * Sprint 3 - US-007: Blog Comunitario
 * Task 7.3 - Frontend BlogList Component
 *
 * @param {Object} props
 * @param {Function} props.onPostClick - Handler al hacer click en un post
 * @returns {JSX.Element} Lista de posts
 */
const BlogList = ({ onPostClick }) => {
  // Estados para filtros y paginación
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Obtener posts usando custom hook
  const { posts, loading, error, pagination } = useBlogPosts({
    category: selectedCategory,
    page: currentPage,
    limit: 9,
  });

  /**
   * Categorías disponibles para filtrar
   */
  const categories = [
    { id: '', label: 'Todas', icon: '📚' },
    { id: 'emprendimiento', label: 'Emprendimiento', icon: '💼' },
    { id: 'salud', label: 'Salud', icon: '🏥' },
    { id: 'educacion', label: 'Educación', icon: '🎓' },
    { id: 'cultura', label: 'Cultura', icon: '🎨' },
    { id: 'tecnologia', label: 'Tecnología', icon: '💻' },
    { id: 'comunidad', label: 'Comunidad', icon: '🤝' },
  ];

  /**
   * Handler para cambiar de categoría
   */
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset a página 1 cuando cambia el filtro
  };

  /**
   * Handler para cambiar de página
   */
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setCurrentPage(newPage);
      // Scroll al top de la lista
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
                ${
                  selectedCategory === cat.id
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              {selectedCategory === cat.id && posts.length > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs font-semibold">
                  {pagination.total}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <DirectoryCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-700 font-medium mb-2">Error al cargar posts</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && posts.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay posts disponibles</h3>
          <p className="text-gray-600 mb-4">
            {selectedCategory
              ? `No encontramos posts en la categoría "${categories.find((c) => c.id === selectedCategory)?.label}".`
              : 'No hay posts publicados en este momento.'}
          </p>
          {selectedCategory && (
            <button
              onClick={() => handleCategoryChange('')}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              Ver todos los posts
            </button>
          )}
        </div>
      )}

      {/* Posts Grid */}
      {!loading && !error && posts.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} onClick={() => onPostClick(post)} />
            ))}
          </div>

          {/* Paginación */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrev}
                className={`
                  p-2 rounded-lg transition-all
                  ${
                    pagination.hasPrev
                      ? 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }
                `}
                aria-label="Página anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {[...Array(pagination.pages)].map((_, index) => {
                  const pageNum = index + 1;
                  // Mostrar solo páginas cercanas a la actual
                  if (
                    pageNum === 1 ||
                    pageNum === pagination.pages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`
                          min-w-[40px] h-10 px-3 rounded-lg font-medium text-sm transition-all
                          ${
                            currentPage === pageNum
                              ? 'bg-primary-600 text-white shadow-md'
                              : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
                          }
                        `}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return (
                      <span key={pageNum} className="px-2 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNext}
                className={`
                  p-2 rounded-lg transition-all
                  ${
                    pagination.hasNext
                      ? 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }
                `}
                aria-label="Página siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Results Info */}
          {pagination.total > 0 && (
            <p className="text-center text-sm text-gray-600">
              Mostrando {(currentPage - 1) * 9 + 1} - {Math.min(currentPage * 9, pagination.total)}{' '}
              de {pagination.total} posts
            </p>
          )}
        </>
      )}
    </div>
  );
};

BlogList.propTypes = {
  onPostClick: PropTypes.func.isRequired,
};

export default BlogList;
