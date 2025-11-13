import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import DashboardLayout from '../../dashboard/components/DashboardLayout';
import { BlogList } from '../components';

/**
 * BlogPage - Página principal del blog comunitario
 *
 * Ruta: /dashboard/blog (protegida)
 *
 * Features:
 * - Header con título y descripción
 * - BlogList con filtros por categoría
 * - Grid responsive de posts estilo Medium
 * - Paginación
 * - Click en post para ver detalle (placeholder por ahora)
 * - Layout responsive con DashboardLayout
 * - Navegación integrada en sidebar
 *
 * Sprint 3 - US-007: Blog Comunitario
 * - Task 7.3 ✅ Frontend - BlogList Component
 *
 * @returns {JSX.Element} Página del blog
 */
const BlogPage = () => {
  // Estado para post seleccionado (para futura implementación de BlogDetail)
  const [selectedPost, setSelectedPost] = useState(null);

  /**
   * Handler para cuando se hace click en un post
   * TODO: Implementar navegación a BlogDetailPage cuando exista
   */
  const handlePostClick = (post) => {
    setSelectedPost(post);
    console.log('Post clicked:', post);
    // TODO: Navegar a /dashboard/blog/:slug cuando se implemente BlogDetailPage
    // navigate(`/dashboard/blog/${post.slug}`);
  };

  return (
    <DashboardLayout>
      {/* Header Section */}
      <div className="mb-8">
        {/* Icon + Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Comunitario</h1>
            <p className="text-gray-600 mt-1">
              Comparte experiencias, aprende y conecta con otras mujeres migrantes
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
      </div>

      {/* Blog List con filtros y paginación */}
      <BlogList onPostClick={handlePostClick} />
    </DashboardLayout>
  );
};

export default BlogPage;
