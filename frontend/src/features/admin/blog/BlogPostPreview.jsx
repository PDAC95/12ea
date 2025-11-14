import { X, Send, Calendar, Tag } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * BlogPostPreview - Modal de preview para artículos de blog
 * Task 10.6 - Sprint 4
 *
 * Muestra cómo se verá el artículo publicado con:
 * - Imagen destacada arriba (full-width)
 * - Título grande y prominente
 * - Metadata: categoría badge, fecha de publicación
 * - Contenido renderizado como HTML (del RichTextEditor)
 * - Tipografía optimizada para lectura (prose styles)
 * - Responsive design completo
 *
 * Props:
 * - post: Objeto con datos del artículo { title, slug, content, excerpt, featuredImage, category, publishedAt, status }
 * - isOpen: Boolean para controlar visibilidad del modal
 * - onClose: Función para cerrar el modal
 * - onPublish: Función opcional para publicar (solo si es draft)
 */
const BlogPostPreview = ({ post, isOpen, onClose, onPublish = null }) => {
  /**
   * Categorías con labels legibles
   */
  const CATEGORY_LABELS = {
    emprendimiento: 'Emprendimiento',
    educacion: 'Educación',
    salud: 'Salud y Bienestar',
    legal: 'Legal e Inmigración',
    tecnologia: 'Tecnología',
    cultura: 'Cultura y Comunidad',
    finanzas: 'Finanzas Personales',
    familia: 'Familia y Maternidad',
    otro: 'Otros Temas',
  };

  /**
   * Formatear fecha
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha de publicación';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  /**
   * Get category badge color
   */
  const getCategoryBadge = (category) => {
    const badges = {
      emprendimiento: 'bg-purple-100 text-purple-800',
      educacion: 'bg-blue-100 text-blue-800',
      salud: 'bg-green-100 text-green-800',
      legal: 'bg-red-100 text-red-800',
      tecnologia: 'bg-indigo-100 text-indigo-800',
      cultura: 'bg-pink-100 text-pink-800',
      finanzas: 'bg-yellow-100 text-yellow-800',
      familia: 'bg-orange-100 text-orange-800',
      otro: 'bg-gray-100 text-gray-800',
    };
    return badges[category] || badges.otro;
  };

  // No renderizar si el modal no está abierto
  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header del Modal */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Preview del Artículo</h2>
            <p className="text-sm text-gray-600 mt-0.5">Vista previa de cómo se verá publicado</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition"
            aria-label="Cerrar preview"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body del Modal - Artículo Preview */}
        <div className="flex-1 overflow-y-auto">
          {/* Imagen Destacada */}
          {post.featuredImage && (
            <div className="w-full h-64 md:h-80 bg-gray-200">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Contenedor del Artículo */}
          <article className="max-w-3xl mx-auto px-6 py-8">
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {/* Categoría Badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full ${getCategoryBadge(post.category)}`}
              >
                <Tag className="w-3.5 h-3.5" />
                {CATEGORY_LABELS[post.category] || post.category}
              </span>

              {/* Fecha de Publicación */}
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                {formatDate(post.publishedAt)}
              </span>
            </div>

            {/* Título */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>

            {/* Extracto */}
            {post.excerpt && (
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed font-light italic border-l-4 border-primary-600 pl-4">
                {post.excerpt}
              </p>
            )}

            {/* Separador */}
            <hr className="border-gray-200 mb-8" />

            {/* Contenido del Artículo */}
            <div
              className="prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-gray-900
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-em:italic
                prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
                prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
                prose-li:mb-2 prose-li:text-gray-700
                prose-img:rounded-lg prose-img:shadow-md prose-img:my-6"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        </div>

        {/* Footer del Modal - Acciones */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium"
          >
            Cerrar
          </button>

          {/* Botón Publicar (solo si es draft y onPublish está disponible) */}
          {post.status === 'draft' && onPublish && (
            <button
              onClick={() => {
                onPublish(post);
                onClose();
              }}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Publicar Artículo
            </button>
          )}
        </div>
      </div>

      {/* Custom Styles para el contenido HTML */}
      <style jsx>{`
        /* Estilos adicionales para mejorar la legibilidad del contenido */
        article {
          font-family: 'Georgia', serif;
        }

        article h1,
        article h2,
        article h3 {
          font-family: system-ui, -apple-system, sans-serif;
        }

        /* Mejorar el espaciado entre elementos */
        article p + p {
          margin-top: 1rem;
        }

        article h2 + p,
        article h3 + p {
          margin-top: 0.5rem;
        }

        /* Optimizar imágenes en el contenido */
        article img {
          max-width: 100%;
          height: auto;
          display: block;
          margin-left: auto;
          margin-right: auto;
        }

        /* Links con mejor hover */
        article a {
          transition: all 0.2s ease;
        }

        /* Listas con mejor espaciado */
        article ul li,
        article ol li {
          line-height: 1.8;
        }

        /* Código inline si existe */
        article code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
          font-family: 'Courier New', monospace;
        }

        /* Blockquotes si existen */
        article blockquote {
          border-left: 4px solid #7c3aed;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #4b5563;
        }
      `}</style>
    </div>
  );
};

BlogPostPreview.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string,
    content: PropTypes.string.isRequired,
    excerpt: PropTypes.string,
    featuredImage: PropTypes.string,
    category: PropTypes.string.isRequired,
    publishedAt: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onPublish: PropTypes.func,
};

export default BlogPostPreview;
