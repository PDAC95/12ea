import mongoose from 'mongoose';

/**
 * Service Model - Entre Amigas
 * Modelo para gestión de servicios profesionales de mujeres migrantes en la comunidad
 */

const serviceSchema = new mongoose.Schema(
  {
    // Información Básica del Servicio
    name: {
      type: String,
      required: [true, 'El nombre del servicio es requerido'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
    },
    serviceType: {
      type: String,
      required: [true, 'El tipo de servicio es requerido'],
      enum: {
        values: [
          'Salud',
          'Legal',
          'Educación',
          'Financiero',
          'Inmigración',
          'Traducción',
          'Tecnología',
          'Consultoría',
          'Otros',
        ],
        message: '{VALUE} no es un tipo de servicio válido',
      },
    },
    description: {
      type: String,
      required: [true, 'La descripción es requerida'],
      trim: true,
      minlength: [20, 'La descripción debe tener al menos 20 caracteres'],
      maxlength: [1000, 'La descripción no puede exceder 1000 caracteres'],
    },

    // Credenciales y Certificaciones
    credentials: {
      type: String,
      trim: true,
      maxlength: [500, 'Las credenciales no pueden exceder 500 caracteres'],
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
      maxlength: [100, 'El usuario de Instagram no puede exceder 100 caracteres'],
    },
    facebook: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          if (!value) return true; // Campo opcional
          return /^(https?:\/\/)?(www\.)?facebook\.com\/.+$/.test(value);
        },
        message: 'Por favor ingresa una URL válida de Facebook',
      },
    },
    linkedin: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          if (!value) return true; // Campo opcional
          return /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/.+$/.test(value);
        },
        message: 'Por favor ingresa una URL válida de LinkedIn',
      },
    },

    // Medios y Assets
    logo: {
      type: String,
      trim: true,
      default: 'https://via.placeholder.com/300x300.png?text=Service',
      validate: {
        validator: function (value) {
          if (!value) return true;
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif|svg|webp)(\?.*)?$/i.test(value);
        },
        message: 'El logo debe ser una URL válida de imagen',
      },
    },
    images: {
      type: [String],
      validate: {
        validator: function (arr) {
          if (!arr || arr.length === 0) return true;
          return arr.every((url) =>
            /^https?:\/\/.+\.(jpg|jpeg|png|gif|svg|webp)(\?.*)?$/i.test(url)
          );
        },
        message: 'Todas las imágenes deben ser URLs válidas',
      },
    },

    // Relaciones
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El propietario es requerido'],
      index: true,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Opcional para servicios creados antes del sistema de aprobación
      index: true,
    },

    // Sistema de Aprobación (Sprint 5+)
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved', // Por defecto aprobado para compatibilidad con servicios existentes
      index: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    approvedAt: {
      type: Date,
      required: false,
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    rejectedAt: {
      type: Date,
      required: false,
    },
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: [500, 'La razón del rechazo no puede exceder 500 caracteres'],
    },

    // Estado y Visibilidad
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // Analytics
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    contactClicks: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ========================================
// ÍNDICES
// ========================================

/**
 * Índice de texto para búsqueda full-text
 * Prioridad: name (10), serviceType (5), description (1)
 */
serviceSchema.index(
  {
    name: 'text',
    description: 'text',
    serviceType: 'text',
  },
  {
    weights: {
      name: 10,
      serviceType: 5,
      description: 1,
    },
    name: 'service_text_index',
  }
);

/**
 * Índice compuesto para búsquedas comunes
 */
serviceSchema.index({ serviceType: 1, city: 1, isActive: 1 });
serviceSchema.index({ owner: 1, isActive: 1 });
serviceSchema.index({ createdAt: -1 });
serviceSchema.index({ isVerified: 1, isFeatured: 1 });
serviceSchema.index({ status: 1, createdAt: -1 }); // Para panel admin de aprobaciones

// ========================================
// VIRTUALS
// ========================================

/**
 * Engagement Rate - Tasa de interacción del servicio
 */
serviceSchema.virtual('engagementRate').get(function () {
  if (this.views === 0) return 0;
  return ((this.contactClicks / this.views) * 100).toFixed(2);
});

/**
 * Verifica si el servicio tiene redes sociales configuradas
 */
serviceSchema.virtual('hasSocialMedia').get(function () {
  return !!(this.instagram || this.facebook || this.linkedin);
});

/**
 * Verifica si el servicio tiene información de contacto completa
 */
serviceSchema.virtual('hasFullContact').get(function () {
  return !!(this.phone && this.email);
});

// ========================================
// MIDDLEWARE / HOOKS
// ========================================

/**
 * Pre-save hook para normalizar URLs y datos
 */
serviceSchema.pre('save', function (next) {
  // Normalizar website (agregar https:// si no existe)
  if (this.website && !this.website.startsWith('http')) {
    this.website = `https://${this.website}`;
  }

  // Normalizar Instagram (remover @ si existe)
  if (this.instagram && this.instagram.startsWith('@')) {
    this.instagram = this.instagram.substring(1);
  }

  next();
});

// ========================================
// MÉTODOS DE INSTANCIA
// ========================================

/**
 * Incrementar contador de vistas
 */
serviceSchema.methods.incrementViews = async function () {
  this.views += 1;
  return await this.save();
};

/**
 * Incrementar contador de clics en contacto
 */
serviceSchema.methods.incrementContactClicks = async function () {
  this.contactClicks += 1;
  return await this.save();
};

/**
 * Verificar servicio (solo admin)
 */
serviceSchema.methods.verify = async function () {
  this.isVerified = true;
  return await this.save();
};

/**
 * Destacar servicio (solo admin)
 */
serviceSchema.methods.feature = async function () {
  this.isFeatured = true;
  return await this.save();
};

// ========================================
// MÉTODOS ESTÁTICOS
// ========================================

/**
 * Buscar servicios activos por ciudad
 */
serviceSchema.statics.findActiveByCity = function (city) {
  return this.find({
    city: new RegExp(city, 'i'),
    isActive: true,
  }).populate('owner', 'preferredName email profileImage');
};

/**
 * Búsqueda de texto con filtros
 */
serviceSchema.statics.searchText = function (searchTerm, filters = {}) {
  const query = {
    $text: { $search: searchTerm },
    isActive: true,
    ...filters,
  };

  return this.find(query, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .populate('owner', 'preferredName email profileImage city');
};

/**
 * Obtener estadísticas generales de servicios
 */
serviceSchema.statics.getStats = async function () {
  const stats = await this.aggregate([
    {
      $facet: {
        general: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              active: {
                $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] },
              },
              verified: {
                $sum: { $cond: [{ $eq: ['$isVerified', true] }, 1, 0] },
              },
              featured: {
                $sum: { $cond: [{ $eq: ['$isFeatured', true] }, 1, 0] },
              },
              totalViews: { $sum: '$views' },
              totalClicks: { $sum: '$contactClicks' },
            },
          },
        ],
        byType: [
          {
            $group: {
              _id: '$serviceType',
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
        ],
        byCity: [
          {
            $group: {
              _id: '$city',
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
        ],
      },
    },
  ]);

  return {
    general: stats[0].general[0] || {},
    byType: stats[0].byType || [],
    byCity: stats[0].byCity || [],
  };
};

const Service = mongoose.model('Service', serviceSchema);

export default Service;
