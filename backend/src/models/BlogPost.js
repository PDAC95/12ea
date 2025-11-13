import mongoose from 'mongoose';

/**
 * BlogPost Model - Entre Amigas
 * Modelo para gestión de artículos del blog sobre wellness, amistad y migración
 */

const blogPostSchema = new mongoose.Schema(
  {
    // Información Básica del Artículo
    title: {
      type: String,
      required: [true, 'El título del artículo es requerido'],
      trim: true,
      minlength: [5, 'El título debe tener al menos 5 caracteres'],
      maxlength: [200, 'El título no puede exceder 200 caracteres'],
    },
    slug: {
      type: String,
      required: [true, 'El slug es requerido'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'El slug debe contener solo letras minúsculas, números y guiones',
      ],
      index: true, // Índice para búsquedas rápidas por slug
    },
    content: {
      type: String,
      required: [true, 'El contenido del artículo es requerido'],
      trim: true,
      minlength: [100, 'El contenido debe tener al menos 100 caracteres'],
      maxlength: [50000, 'El contenido no puede exceder 50000 caracteres'],
    },
    excerpt: {
      type: String,
      required: [true, 'El extracto es requerido'],
      trim: true,
      minlength: [20, 'El extracto debe tener al menos 20 caracteres'],
      maxlength: [500, 'El extracto no puede exceder 500 caracteres'],
    },

    // Media
    featuredImage: {
      type: String,
      required: [true, 'La imagen destacada es requerida'],
      validate: {
        validator: function (value) {
          if (!value) return false;
          // Validar que sea una URL válida
          return /^https?:\/\/.+/i.test(value);
        },
        message: 'La imagen debe ser una URL válida (debe empezar con http:// o https://)',
      },
    },

    // Categorización
    category: {
      type: String,
      required: [true, 'La categoría es requerida'],
      enum: {
        values: [
          'Wellness',
          'Amistad',
          'Amor Propio',
          'Migración',
          'Consejos',
          'Historias',
        ],
        message: '{VALUE} no es una categoría válida',
      },
      index: true, // Índice para filtrar por categoría
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: [30, 'Cada tag no puede exceder 30 caracteres'],
      },
    ],

    // Autor
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El autor del artículo es requerido'],
      index: true, // Índice para buscar artículos por autor
    },

    // Estado y Publicación
    status: {
      type: String,
      enum: {
        values: ['draft', 'published'],
        message: '{VALUE} no es un estado válido. Usa: draft o published',
      },
      default: 'draft',
      index: true, // Índice para filtrar por estado
    },
    publishedAt: {
      type: Date,
      default: null,
    },

    // Metadata SEO (Opcional)
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [160, 'La meta descripción no puede exceder 160 caracteres'],
    },
    metaKeywords: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    // Estadísticas
    views: {
      type: Number,
      default: 0,
      min: [0, 'Las vistas no pueden ser negativas'],
    },
    readTime: {
      type: Number, // Tiempo de lectura estimado en minutos
      min: [1, 'El tiempo de lectura debe ser al menos 1 minuto'],
    },

    // Características Adicionales
    isFeatured: {
      type: Boolean,
      default: false,
      index: true, // Índice para destacar artículos
    },
    allowComments: {
      type: Boolean,
      default: true,
    },

    // Metadata de Edición
    lastEditedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    lastEditedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    collection: 'blog_posts', // Nombre explícito de la colección
  }
);

// =====================================
// ÍNDICES
// =====================================

// Índice de texto para búsqueda full-text
blogPostSchema.index(
  { title: 'text', content: 'text', excerpt: 'text', tags: 'text' },
  {
    weights: {
      title: 10,       // Mayor peso al título
      excerpt: 5,      // Peso medio al extracto
      tags: 3,         // Peso medio-bajo a tags
      content: 1,      // Menor peso al contenido
    },
    name: 'blog_text_search',
  }
);

// Índices individuales para búsquedas y filtros
blogPostSchema.index({ slug: 1 }, { unique: true }); // Slug único
blogPostSchema.index({ category: 1 });
blogPostSchema.index({ status: 1 });
blogPostSchema.index({ author: 1 });
blogPostSchema.index({ publishedAt: -1 }); // Ordenar por fecha de publicación
blogPostSchema.index({ isFeatured: 1 });
blogPostSchema.index({ tags: 1 }); // Índice en array de tags

// Índices compuestos para queries comunes
blogPostSchema.index({ status: 1, publishedAt: -1 }); // Artículos publicados ordenados
blogPostSchema.index({ category: 1, status: 1, publishedAt: -1 }); // Por categoría
blogPostSchema.index({ status: 1, isFeatured: 1, publishedAt: -1 }); // Destacados
blogPostSchema.index({ author: 1, status: 1 }); // Artículos del autor

// Índice para estadísticas
blogPostSchema.index({ views: -1 }); // Más vistos

// =====================================
// HOOKS (MIDDLEWARE)
// =====================================

/**
 * Hook pre-save: Generar slug automáticamente desde el título si no existe
 */
blogPostSchema.pre('save', function (next) {
  if (this.isNew && !this.slug) {
    // Generar slug desde el título
    this.slug = this.title
      .toLowerCase()
      .normalize('NFD') // Normalizar caracteres acentuados
      .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
      .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres especiales
      .trim()
      .replace(/\s+/g, '-') // Reemplazar espacios por guiones
      .replace(/-+/g, '-'); // Eliminar guiones duplicados
  }
  next();
});

/**
 * Hook pre-save: Calcular tiempo de lectura basado en contenido
 */
blogPostSchema.pre('save', function (next) {
  if (this.isModified('content') && this.content) {
    // Calcular palabras (promedio 200 palabras por minuto)
    const words = this.content.split(/\s+/).length;
    this.readTime = Math.max(1, Math.ceil(words / 200));
  }
  next();
});

/**
 * Hook pre-save: Marcar publishedAt cuando se publica por primera vez
 */
blogPostSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

/**
 * Hook pre-save: Actualizar lastEditedAt cuando se modifica
 */
blogPostSchema.pre('save', function (next) {
  if (!this.isNew && this.isModified()) {
    this.lastEditedAt = new Date();
  }
  next();
});

/**
 * Hook post-save: Log de confirmación (solo en desarrollo)
 */
blogPostSchema.post('save', function (doc) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`✅ Artículo guardado: ${doc.title} (${doc.status}) - ${doc._id}`);
  }
});

// =====================================
// MÉTODOS DE INSTANCIA
// =====================================

/**
 * Incrementar contador de vistas
 * @returns {Promise<BlogPost>}
 */
blogPostSchema.methods.incrementViews = async function () {
  this.views += 1;
  return await this.save();
};

/**
 * Publicar artículo
 * @returns {Promise<BlogPost>}
 */
blogPostSchema.methods.publish = async function () {
  this.status = 'published';
  if (!this.publishedAt) {
    this.publishedAt = new Date();
  }
  return await this.save();
};

/**
 * Despublicar artículo (volver a draft)
 * @returns {Promise<BlogPost>}
 */
blogPostSchema.methods.unpublish = async function () {
  this.status = 'draft';
  return await this.save();
};

/**
 * Destacar artículo
 * @returns {Promise<BlogPost>}
 */
blogPostSchema.methods.feature = async function () {
  this.isFeatured = true;
  return await this.save();
};

/**
 * Quitar destacado
 * @returns {Promise<BlogPost>}
 */
blogPostSchema.methods.unfeature = async function () {
  this.isFeatured = false;
  return await this.save();
};

/**
 * Verificar si el artículo está publicado
 * @returns {Boolean}
 */
blogPostSchema.methods.isPublished = function () {
  return this.status === 'published';
};

/**
 * Obtener URL amigable del artículo
 * @returns {String}
 */
blogPostSchema.methods.getUrl = function () {
  return `/blog/${this.slug}`;
};

/**
 * Obtener datos públicos del artículo (para API)
 * @returns {Object}
 */
blogPostSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    title: this.title,
    slug: this.slug,
    excerpt: this.excerpt,
    featuredImage: this.featuredImage,
    category: this.category,
    tags: this.tags,
    publishedAt: this.publishedAt,
    readTime: this.readTime,
    views: this.views,
    isFeatured: this.isFeatured,
    url: this.getUrl(),
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

/**
 * Obtener contenido completo (para vista de artículo)
 * @returns {Object}
 */
blogPostSchema.methods.getFullContent = function () {
  return {
    ...this.getPublicProfile(),
    content: this.content,
    metaDescription: this.metaDescription,
    metaKeywords: this.metaKeywords,
  };
};

// =====================================
// MÉTODOS ESTÁTICOS
// =====================================

/**
 * Buscar artículos publicados (para blog público)
 * @param {Object} filters - Filtros opcionales (category, tag)
 * @param {Number} page - Página actual
 * @param {Number} limit - Artículos por página
 * @returns {Promise<Object>} - { posts, total, pages }
 */
blogPostSchema.statics.findPublished = async function (filters = {}, page = 1, limit = 10) {
  const query = { status: 'published' };

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.tag) {
    query.tags = filters.tag;
  }

  const total = await this.countDocuments(query);
  const pages = Math.ceil(total / limit);
  const skip = (page - 1) * limit;

  const posts = await this.find(query)
    .populate('author', 'preferredName profileImage')
    .sort({ publishedAt: -1 }) // Más recientes primero
    .skip(skip)
    .limit(limit);

  return { posts, total, pages, currentPage: page };
};

/**
 * Buscar artículo publicado por slug
 * @param {String} slug
 * @returns {Promise<BlogPost|null>}
 */
blogPostSchema.statics.findBySlug = function (slug) {
  return this.findOne({ slug, status: 'published' }).populate(
    'author',
    'preferredName email profileImage'
  );
};

/**
 * Buscar artículos destacados
 * @param {Number} limit - Número máximo de resultados
 * @returns {Promise<BlogPost[]>}
 */
blogPostSchema.statics.findFeatured = function (limit = 3) {
  return this.find({ status: 'published', isFeatured: true })
    .populate('author', 'preferredName profileImage')
    .sort({ publishedAt: -1 })
    .limit(limit);
};

/**
 * Buscar artículos por categoría
 * @param {String} category
 * @param {Number} limit - Número máximo de resultados
 * @returns {Promise<BlogPost[]>}
 */
blogPostSchema.statics.findByCategory = function (category, limit = 10) {
  return this.find({ category, status: 'published' })
    .populate('author', 'preferredName profileImage')
    .sort({ publishedAt: -1 })
    .limit(limit);
};

/**
 * Buscar artículos por tag
 * @param {String} tag
 * @param {Number} limit - Número máximo de resultados
 * @returns {Promise<BlogPost[]>}
 */
blogPostSchema.statics.findByTag = function (tag, limit = 10) {
  return this.find({ tags: tag, status: 'published' })
    .populate('author', 'preferredName profileImage')
    .sort({ publishedAt: -1 })
    .limit(limit);
};

/**
 * Buscar artículos por autor
 * @param {ObjectId} authorId
 * @param {String} statusFilter - 'published', 'draft', o null para todos
 * @returns {Promise<BlogPost[]>}
 */
blogPostSchema.statics.findByAuthor = function (authorId, statusFilter = null) {
  const query = { author: authorId };
  if (statusFilter) {
    query.status = statusFilter;
  }

  return this.find(query).sort({ createdAt: -1 });
};

/**
 * Buscar artículos más vistos
 * @param {Number} limit - Número máximo de resultados
 * @returns {Promise<BlogPost[]>}
 */
blogPostSchema.statics.findMostViewed = function (limit = 5) {
  return this.find({ status: 'published' })
    .populate('author', 'preferredName profileImage')
    .sort({ views: -1 })
    .limit(limit);
};

/**
 * Búsqueda de texto completo
 * @param {String} searchText - Texto a buscar
 * @param {Object} filters - Filtros adicionales (category, etc.)
 * @returns {Promise<BlogPost[]>}
 */
blogPostSchema.statics.searchText = function (searchText, filters = {}) {
  const query = {
    $text: { $search: searchText },
    status: 'published',
    ...filters,
  };

  return this.find(query, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .populate('author', 'preferredName profileImage');
};

/**
 * Obtener estadísticas del blog
 * @returns {Promise<Object>}
 */
blogPostSchema.statics.getStats = async function () {
  const total = await this.countDocuments();
  const published = await this.countDocuments({ status: 'published' });
  const drafts = await this.countDocuments({ status: 'draft' });
  const featured = await this.countDocuments({ isFeatured: true });

  const byCategory = await this.aggregate([
    { $match: { status: 'published' } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const totalViews = await this.aggregate([
    { $match: { status: 'published' } },
    { $group: { _id: null, total: { $sum: '$views' } } },
  ]);

  const avgReadTime = await this.aggregate([
    { $match: { status: 'published' } },
    { $group: { _id: null, avg: { $avg: '$readTime' } } },
  ]);

  return {
    total,
    published,
    drafts,
    featured,
    byCategory,
    totalViews: totalViews[0]?.total || 0,
    avgReadTime: avgReadTime[0]?.avg ? Math.ceil(avgReadTime[0].avg) : 0,
  };
};

/**
 * Obtener artículos relacionados (misma categoría)
 * @param {ObjectId} postId - ID del artículo actual
 * @param {String} category - Categoría del artículo
 * @param {Number} limit - Número de artículos relacionados
 * @returns {Promise<BlogPost[]>}
 */
blogPostSchema.statics.findRelated = function (postId, category, limit = 3) {
  return this.find({
    _id: { $ne: postId },
    category,
    status: 'published',
  })
    .populate('author', 'preferredName profileImage')
    .sort({ publishedAt: -1 })
    .limit(limit);
};

// =====================================
// VIRTUALS (CAMPOS CALCULADOS)
// =====================================

/**
 * Virtual para verificar si es un draft
 */
blogPostSchema.virtual('isDraft').get(function () {
  return this.status === 'draft';
});

/**
 * Virtual para obtener fecha de publicación formateada
 */
blogPostSchema.virtual('publishedDate').get(function () {
  if (!this.publishedAt) return null;
  return this.publishedAt.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

/**
 * Virtual para contar palabras del contenido
 */
blogPostSchema.virtual('wordCount').get(function () {
  if (!this.content) return 0;
  return this.content.split(/\s+/).length;
});

// Configurar para incluir virtuals en JSON y Object
blogPostSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    // Remover campos internos cuando se convierte a JSON
    delete ret.__v;
    delete ret.lastEditedBy;
    return ret;
  },
});

blogPostSchema.set('toObject', { virtuals: true });

// =====================================
// MODELO
// =====================================

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

export default BlogPost;
