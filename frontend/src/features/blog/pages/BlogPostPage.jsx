import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../dashboard/components/DashboardLayout';
import useBlogPost from '../../../shared/hooks/useBlogPost';
import DOMPurify from 'dompurify';

/**
 * BlogPostPage - Página de visualización de post individual
 *
 * Ruta: /dashboard/blog/:slug (protegida)
 *
 * Features:
 * - Tipografía optimizada estilo Medium
 * - Renderiza HTML content de forma segura con DOMPurify
 * - Metadata visible: autor, fecha, categoría
 * - Botón "Volver" al listado
 * - 100% Responsive
 * - Featured image hero
 * - Loading skeleton
 * - Error handling
 *
 * Sprint 3 - US-007: Blog Comunitario
 * - Task 7.4 ✅ Frontend - BlogPost Component
 *
 * @returns {JSX.Element} Página de post individual
 */
const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Obtener post usando custom hook
  const { post, loading, error } = useBlogPost(slug);

  /**
   * Handler para volver al listado
   */
  const handleGoBack = () => {
    navigate('/dashboard/blog');
  };

  /**
   * Formatear fecha de publicación
   */
  const formatDate = (dateStr) => {
    if (!dateStr) return '';

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';

    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    return date.toLocaleDateString('es-ES', options);
  };

  /**
   * Calcular tiempo de lectura estimado (promedio 200 palabras por minuto)
   */
  const calculateReadTime = (content) => {
    if (!content) return 0;

    // Remover tags HTML y contar palabras
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);

    return minutes;
  };

  /**
   * Sanitizar HTML content para evitar XSS
   */
  const sanitizeHTML = (htmlContent) => {
    return DOMPurify.sanitize(htmlContent, {
      ALLOWED_TAGS: [
        'p',
        'br',
        'strong',
        'em',
        'u',
        's',
        'a',
        'ul',
        'ol',
        'li',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'blockquote',
        'code',
        'pre',
        'img',
      ],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'class'],
    });
  };

  /**
   * Obtener color de badge según categoría
   */
  const getCategoryColor = (category) => {
    const colors = {
      emprendimiento: 'bg-blue-100 text-blue-700',
      salud: 'bg-green-100 text-green-700',
      educacion: 'bg-purple-100 text-purple-700',
      cultura: 'bg-pink-100 text-pink-700',
      tecnologia: 'bg-indigo-100 text-indigo-700',
      comunidad: 'bg-orange-100 text-orange-700',
    };

    return colors[category?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  return (
    <DashboardLayout>
      {/* Loading State */}
      {loading && (
        <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-96 bg-gray-200 rounded-2xl mb-8"></div>
          <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-900 mb-2">Error al cargar el post</h2>
            <p className="text-red-700 mb-6">{error}</p>
            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al blog
            </button>
          </div>
        </div>
      )}

      {/* Post Content */}
      {post && !loading && !error && (
        <article className="max-w-4xl mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 font-medium mb-8 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Volver al blog
          </button>

          {/* Featured Image */}
          <div className="relative h-96 rounded-2xl overflow-hidden mb-8 shadow-xl">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

            {/* Category Badge */}
            <div className="absolute top-6 left-6">
              <span
                className={`inline-block px-4 py-2 text-sm font-semibold rounded-full shadow-lg ${getCategoryColor(post.category)}`}
              >
                {post.category}
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-200">
            {/* Author */}
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="font-medium">{post.author?.name || 'Anónimo'}</span>
            </div>

            {/* Published Date */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>

            {/* Read Time */}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{calculateReadTime(post.content)} min de lectura</span>
            </div>
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <div className="text-xl text-gray-700 leading-relaxed mb-8 font-serif italic border-l-4 border-primary-500 pl-6 py-2">
              {post.excerpt}
            </div>
          )}

          {/* Content - Tipografía optimizada estilo Medium */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-gray-900
              prose-h1:text-3xl prose-h1:mb-4
              prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-8
              prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-6
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-em:text-gray-700 prose-em:italic
              prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-700
              prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:text-pink-600
              prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg
              prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-6
              prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-6
              prose-li:text-gray-700 prose-li:mb-2
              prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8"
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.content) }}
          />

          {/* Footer - Back to Blog */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al blog
            </button>
          </div>
        </article>
      )}
    </DashboardLayout>
  );
};

export default BlogPostPage;
