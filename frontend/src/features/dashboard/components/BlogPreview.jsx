import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import BlogCard from '../../blog/components/BlogCard';
import useBlogPosts from '../../../shared/hooks/useBlogPosts';

/**
 * BlogPreview - Preview de últimos posts del blog
 *
 * Features:
 * - Muestra los últimos 3 posts reales desde API
 * - Loading state con spinner
 * - Error state
 * - Empty state cuando no hay posts
 * - Grid responsive (3 cols desktop, 2 tablet, 1 móvil)
 * - Link "Ver todos los posts"
 * - Click en post navega a página de blog
 * - Section header con icono
 *
 * Sprint 5 - Task 5.9.2 ✅ - Consumo de API real
 *
 * @returns {JSX.Element} Preview de posts del blog
 */
const BlogPreview = () => {
  const navigate = useNavigate();

  // Fetch últimos 3 posts desde API
  const { posts, loading, error } = useBlogPosts({
    page: 1,
    limit: 3,
  });

  /**
   * Handler al hacer click en un post
   * Navega a la página de blog completa
   */
  const handlePostClick = () => {
    navigate('/dashboard/blog');
  };

  return (
    <section className="py-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center shadow-sm">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Blog Comunitario</h2>
            <p className="text-sm text-gray-600">
              Lee historias y consejos de nuestra comunidad
            </p>
          </div>
        </div>

        {/* Ver Todos Link - Hidden en móvil pequeño */}
        {!loading && posts.length > 0 && (
          <button
            onClick={handlePostClick}
            className="hidden md:flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm group transition-colors"
          >
            Ver todos
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl border border-gray-200">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-3" />
          <p className="text-gray-600 font-medium">Cargando artículos...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-700 font-medium mb-2">Error al cargar artículos</p>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={handlePostClick}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
          >
            Ver todos los artículos
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2 font-medium">No hay artículos publicados</p>
          <p className="text-sm text-gray-500 mb-4">
            Vuelve pronto para leer nuevas historias
          </p>
          <button
            onClick={handlePostClick}
            className="inline-flex items-center gap-2 px-4 py-2 text-primary-600 hover:text-primary-700 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors text-sm font-medium"
          >
            Ir al blog
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Posts Grid - Mostrar solo si hay posts */}
      {!loading && !error && posts.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} onClick={handlePostClick} />
            ))}
          </div>

          {/* Ver Todos Link - Visible solo en móvil */}
          <div className="mt-6 md:hidden">
            <button
              onClick={handlePostClick}
              className="flex items-center justify-center gap-2 w-full py-3 text-primary-600 hover:text-primary-700 font-medium text-sm border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
            >
              Ver todos los artículos
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default BlogPreview;
