import mongoose from 'mongoose';

/**
 * Business Model - Entre Amigas
 * Modelo para gestión de negocios de mujeres migrantes en la comunidad
 */

const businessSchema = new mongoose.Schema(
  {
    // Información Básica del Negocio
    name: {
      type: String,
      required: [true, 'El nombre del negocio es requerido'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
    },
    category: {
      type: String,
      required: [true, 'La categoría es requerida'],
      enum: {
        values: [
          'Gastronomía',
          'Belleza y Bienestar',
          'Salud',
          'Fitness',
          'Consultoría',
          'Moda y Accesorios',
          'Servicios del Hogar',
          'Artesanías',
          'Fotografía y Video',
          'Educación y Tutorías',
          'Tecnología',
          'Entretenimiento',
          'Deportes',
          'Automotriz',
          'Bienes Raíces',
          'Seguros',
          'Trámites y Gestorías',
        ],
        message: '{VALUE} no es una categoría válida',
      },
    },
    description: {
      type: String,
      required: [true, 'La descripción es requerida'],
      trim: true,
      minlength: [20, 'La descripción debe tener al menos 20 caracteres'],
      maxlength: [1000, 'La descripción no puede exceder 1000 caracteres'],
    },

    // Información de Contacto
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          // Validación básica de teléfono (al menos 10 dígitos)
          if (!value) return true; // Campo opcional
          return /^[\d\s\-\+\(\)]{10,20}$/.test(value);
        },
        message: 'Por favor ingresa un número de teléfono válido',
      },
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          if (!value) return true; // Campo opcional
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
        },
        message: 'Por favor ingresa un email válido',
      },
    },
    whatsapp: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          if (!value) return true; // Campo opcional
          return /^[\d\s\-\+\(\)]{10,20}$/.test(value);
        },
        message: 'Por favor ingresa un número de WhatsApp válido',
      },
    },

    // Ubicación
    city: {
      type: String,
      required: [true, 'La ciudad es requerida'],
      trim: true,
      index: true, // Índice para búsquedas por ciudad
    },
    address: {
      type: String,
      trim: true,
      maxlength: [200, 'La dirección no puede exceder 200 caracteres'],
    },

    // Presencia Digital
    website: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          if (!value) return true; // Campo opcional
          return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
            value
          );
        },
        message: 'Por favor ingresa una URL válida',
      },
    },
    instagram: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          if (!value) return true; // Campo opcional
          // Puede ser username o URL completa
          return /^(@)?[\w](?!.*?\.{2})[\w.]{1,28}[\w]$/.test(value) ||
                 /^(https?:\/\/)?(www\.)?instagram\.com\/[\w.]+\/?$/.test(value);
        },
        message: 'Por favor ingresa un usuario o URL de Instagram válido',
      },
    },
    facebook: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          if (!value) return true; // Campo opcional
          return /^(https?:\/\/)?(www\.)?facebook\.com\/[\w.]+\/?$/.test(value);
        },
        message: 'Por favor ingresa una URL de Facebook válida',
      },
    },

    // Media
    logo: {
      type: String,
      default: 'https://entre-amigas-dev.s3.us-east-1.amazonaws.com/defaults/business-placeholder.png',
      validate: {
        validator: function (value) {
          if (!value) return true;
          return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|svg)$/i.test(value);
        },
        message: 'El logo debe ser una URL válida de imagen',
      },
    },
    images: [
      {
        type: String,
        validate: {
          validator: function (value) {
            return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(value);
          },
          message: 'Cada imagen debe ser una URL válida',
        },
      },
    ],

    // Relación con Usuario
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El dueño del negocio es requerido'],
      index: true, // Índice para búsquedas por owner
    },

    // Estado y Visibilidad
    isActive: {
      type: Boolean,
      default: true,
      index: true, // Índice para filtrar negocios activos
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true, // Índice para filtrar negocios verificados
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true, // Índice para destacar negocios
    },

    // Estadísticas
    views: {
      type: Number,
      default: 0,
      min: [0, 'Las vistas no pueden ser negativas'],
    },
    contactClicks: {
      type: Number,
      default: 0,
      min: [0, 'Los clics no pueden ser negativos'],
    },

    // Metadata
    verifiedAt: {
      type: Date,
      default: null,
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    collection: 'businesses', // Nombre explícito de la colección
  }
);

// =====================================
// ÍNDICES
// =====================================

// Índice de texto para búsqueda full-text
businessSchema.index(
  { name: 'text', description: 'text', category: 'text' },
  {
    weights: {
      name: 10,        // Mayor peso al nombre
      category: 5,     // Peso medio a categoría
      description: 1,  // Menor peso a descripción
    },
    name: 'business_text_search',
  }
);

// Índices individuales para búsquedas y filtros
businessSchema.index({ category: 1 });
businessSchema.index({ city: 1 });
businessSchema.index({ owner: 1 });
businessSchema.index({ isActive: 1 });
businessSchema.index({ isVerified: 1 });
businessSchema.index({ isFeatured: 1 });

// Índices compuestos para queries comunes
businessSchema.index({ city: 1, category: 1 });
businessSchema.index({ city: 1, isActive: 1 });
businessSchema.index({ category: 1, isActive: 1 });
businessSchema.index({ isActive: 1, isFeatured: 1, createdAt: -1 });

// Índice para estadísticas
businessSchema.index({ views: -1 });
businessSchema.index({ contactClicks: -1 });

// =====================================
// HOOKS (MIDDLEWARE)
// =====================================

/**
 * Hook pre-save: Normalizar URLs de redes sociales
 */
businessSchema.pre('save', function (next) {
  // Normalizar Instagram (quitar @ si existe)
  if (this.instagram && this.instagram.startsWith('@')) {
    this.instagram = this.instagram.substring(1);
  }

  // Asegurar que website tenga protocolo
  if (this.website && !this.website.startsWith('http')) {
    this.website = `https://${this.website}`;
  }

  next();
});

/**
 * Hook post-save: Log de confirmación (solo en desarrollo)
 */
businessSchema.post('save', function (doc) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`✅ Negocio guardado: ${doc.name} (${doc._id})`);
  }
});

// =====================================
// MÉTODOS DE INSTANCIA
// =====================================

/**
 * Incrementar contador de vistas
 * @returns {Promise<Business>}
 */
businessSchema.methods.incrementViews = async function () {
  this.views += 1;
  return await this.save();
};

/**
 * Incrementar contador de clics en contacto
 * @returns {Promise<Business>}
 */
businessSchema.methods.incrementContactClicks = async function () {
  this.contactClicks += 1;
  return await this.save();
};

/**
 * Verificar negocio
 * @returns {Promise<Business>}
 */
businessSchema.methods.verify = async function () {
  this.isVerified = true;
  this.verifiedAt = new Date();
  return await this.save();
};

/**
 * Destacar negocio
 * @returns {Promise<Business>}
 */
businessSchema.methods.feature = async function () {
  this.isFeatured = true;
  return await this.save();
};

/**
 * Obtener datos públicos del negocio (para API)
 * @returns {Object}
 */
businessSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    name: this.name,
    category: this.category,
    description: this.description,
    phone: this.phone,
    email: this.email,
    whatsapp: this.whatsapp,
    city: this.city,
    address: this.address,
    website: this.website,
    instagram: this.instagram,
    facebook: this.facebook,
    logo: this.logo,
    images: this.images,
    isVerified: this.isVerified,
    isFeatured: this.isFeatured,
    views: this.views,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// =====================================
// MÉTODOS ESTÁTICOS
// =====================================

/**
 * Buscar negocios activos por ciudad
 * @param {String} city
 * @returns {Promise<Business[]>}
 */
businessSchema.statics.findActiveByCity = function (city) {
  return this.find({ city, isActive: true }).populate('owner', 'preferredName email');
};

/**
 * Buscar negocios activos por categoría
 * @param {String} category
 * @returns {Promise<Business[]>}
 */
businessSchema.statics.findActiveByCategory = function (category) {
  return this.find({ category, isActive: true }).populate('owner', 'preferredName email');
};

/**
 * Buscar negocios destacados
 * @param {Number} limit - Número máximo de resultados
 * @returns {Promise<Business[]>}
 */
businessSchema.statics.findFeatured = function (limit = 6) {
  return this.find({ isActive: true, isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('owner', 'preferredName email');
};

/**
 * Buscar negocios por owner (usuario)
 * @param {ObjectId} ownerId
 * @returns {Promise<Business[]>}
 */
businessSchema.statics.findByOwner = function (ownerId) {
  return this.find({ owner: ownerId }).sort({ createdAt: -1 });
};

/**
 * Búsqueda de texto completo
 * @param {String} searchText - Texto a buscar
 * @param {Object} filters - Filtros adicionales (city, category, etc.)
 * @returns {Promise<Business[]>}
 */
businessSchema.statics.searchText = function (searchText, filters = {}) {
  const query = {
    $text: { $search: searchText },
    isActive: true,
    ...filters,
  };

  return this.find(query, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .populate('owner', 'preferredName email');
};

/**
 * Obtener estadísticas de negocios
 * @returns {Promise<Object>}
 */
businessSchema.statics.getStats = async function () {
  const total = await this.countDocuments();
  const active = await this.countDocuments({ isActive: true });
  const verified = await this.countDocuments({ isVerified: true });
  const featured = await this.countDocuments({ isFeatured: true });

  const byCategory = await this.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const byCity = await this.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$city', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  return {
    total,
    active,
    verified,
    featured,
    byCategory,
    byCity,
  };
};

// =====================================
// VIRTUALS (CAMPOS CALCULADOS)
// =====================================

/**
 * Virtual para obtener tasa de engagement (CTR)
 */
businessSchema.virtual('engagementRate').get(function () {
  if (this.views === 0) return 0;
  return ((this.contactClicks / this.views) * 100).toFixed(2);
});

/**
 * Virtual para verificar si tiene redes sociales
 */
businessSchema.virtual('hasSocialMedia').get(function () {
  return !!(this.instagram || this.facebook);
});

/**
 * Virtual para verificar si tiene información de contacto completa
 */
businessSchema.virtual('hasFullContact').get(function () {
  return !!(this.phone || this.email || this.whatsapp);
});

// Configurar para incluir virtuals en JSON y Object
businessSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    // Remover campos internos cuando se convierte a JSON
    delete ret.__v;
    delete ret.lastModifiedBy;
    return ret;
  },
});

businessSchema.set('toObject', { virtuals: true });

// =====================================
// MODELO
// =====================================

const Business = mongoose.model('Business', businessSchema);

export default Business;
