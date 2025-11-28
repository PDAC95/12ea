import mongoose from 'mongoose';

/**
 * Tip Model - Entre Amigas
 * Modelo para gestión de tips comunitarios compartidos por mujeres migrantes
 */

const tipSchema = new mongoose.Schema(
  {
    // Información del Tip
    title: {
      type: String,
      required: [true, 'El título del tip es requerido'],
      trim: true,
      minlength: [5, 'El título debe tener al menos 5 caracteres'],
      maxlength: [150, 'El título no puede exceder 150 caracteres'],
    },
    content: {
      type: String,
      required: [true, 'El contenido del tip es requerido'],
      trim: true,
      minlength: [100, 'El contenido debe tener al menos 100 caracteres'],
      maxlength: [2000, 'El contenido no puede exceder 2000 caracteres'],
    },
    category: {
      type: String,
      required: [true, 'La categoría es requerida'],
      enum: {
        values: [
          'Inmigración y Adaptación',
          'Emprendimiento',
          'Finanzas Personales',
          'Educación',
          'Salud y Bienestar',
          'Crianza y Familia',
          'Desarrollo Profesional',
          'Vivienda',
          'Recursos Legales',
          'Networking',
          'Idiomas',
          'Cultura y Tradiciones',
        ],
        message: '{VALUE} no es una categoría válida',
      },
      index: true,
    },

    // Relación con Usuario
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El autor del tip es requerido'],
      index: true, // Índice para "mis tips"
    },

    // Sistema de Aprobación
    status: {
      type: String,
      required: [true, 'El estado es requerido'],
      enum: {
        values: ['pending', 'approved', 'rejected'],
        message: '{VALUE} no es un estado válido. Usa: pending, approved o rejected',
      },
      default: 'pending',
      index: true,
    },
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: [500, 'El motivo de rechazo no puede exceder 500 caracteres'],
      default: null,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },

    // Engagement
    views: {
      type: Number,
      default: 0,
      min: [0, 'Las vistas no pueden ser negativas'],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    collection: 'tips', // Nombre explícito de la colección
  }
);

// =====================================
// ÍNDICES
// =====================================

// Índice de texto para búsqueda full-text
tipSchema.index(
  { title: 'text', content: 'text' },
  {
    weights: {
      title: 10,    // Mayor peso al título
      content: 1,   // Menor peso al contenido
    },
    name: 'tip_text_search',
  }
);

// Índices compuestos para queries comunes
tipSchema.index({ status: 1, createdAt: -1 }); // Para admin dashboard
tipSchema.index({ category: 1, status: 1, createdAt: -1 }); // Para filtros públicos
tipSchema.index({ author: 1, createdAt: -1 }); // Para "mis tips"

// Índices de estadísticas
tipSchema.index({ views: -1 });

// =====================================
// HOOKS (MIDDLEWARE)
// =====================================

/**
 * Hook post-save: Log de confirmación (solo en desarrollo)
 */
tipSchema.post('save', function (doc) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`✅ Tip guardado: ${doc.title} (${doc._id})`);
  }
});

// =====================================
// MÉTODOS DE INSTANCIA
// =====================================

/**
 * Incrementar contador de vistas
 * @returns {Promise<Tip>}
 */
tipSchema.methods.incrementViews = async function () {
  this.views += 1;
  return await this.save();
};

/**
 * Dar like a un tip
 * @param {ObjectId} userId - ID del usuario que da like
 * @returns {Promise<Tip>}
 */
tipSchema.methods.addLike = async function (userId) {
  if (!this.likes.includes(userId)) {
    this.likes.push(userId);
    return await this.save();
  }
  return this;
};

/**
 * Quitar like de un tip
 * @param {ObjectId} userId - ID del usuario que quita like
 * @returns {Promise<Tip>}
 */
tipSchema.methods.removeLike = async function (userId) {
  this.likes = this.likes.filter((id) => id.toString() !== userId.toString());
  return await this.save();
};

/**
 * Aprobar tip
 * @param {ObjectId} adminId - ID del admin que aprueba
 * @returns {Promise<Tip>}
 */
tipSchema.methods.approve = async function (adminId) {
  this.status = 'approved';
  this.approvedBy = adminId;
  this.approvedAt = new Date();
  this.rejectionReason = null; // Limpiar razón de rechazo si existía
  return await this.save();
};

/**
 * Rechazar tip
 * @param {ObjectId} adminId - ID del admin que rechaza
 * @param {String} reason - Motivo del rechazo
 * @returns {Promise<Tip>}
 */
tipSchema.methods.reject = async function (adminId, reason) {
  if (!reason || reason.trim().length === 0) {
    throw new Error('Se requiere un motivo de rechazo');
  }
  this.status = 'rejected';
  this.approvedBy = adminId;
  this.approvedAt = new Date();
  this.rejectionReason = reason;
  return await this.save();
};

/**
 * Obtener datos públicos del tip (para API)
 * @returns {Object}
 */
tipSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    category: this.category,
    author: this.author,
    views: this.views,
    likeCount: this.likes.length,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// =====================================
// MÉTODOS ESTÁTICOS
// =====================================

/**
 * Buscar tips aprobados por categoría
 * @param {String} category - Categoría del tip
 * @returns {Promise<Tip[]>}
 */
tipSchema.statics.findApprovedByCategory = function (category) {
  return this.find({ category, status: 'approved' })
    .sort({ createdAt: -1 })
    .populate('author', 'preferredName fullName avatar');
};

/**
 * Buscar tips aprobados (públicos)
 * @param {Number} limit - Número máximo de resultados
 * @returns {Promise<Tip[]>}
 */
tipSchema.statics.findApproved = function (limit = 20) {
  return this.find({ status: 'approved' })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('author', 'preferredName fullName avatar');
};

/**
 * Buscar tips pendientes de aprobación
 * @returns {Promise<Tip[]>}
 */
tipSchema.statics.findPending = function () {
  return this.find({ status: 'pending' })
    .sort({ createdAt: -1 })
    .populate('author', 'preferredName fullName email');
};

/**
 * Buscar tips por autor
 * @param {ObjectId} authorId - ID del autor
 * @returns {Promise<Tip[]>}
 */
tipSchema.statics.findByAuthor = function (authorId) {
  return this.find({ author: authorId })
    .sort({ createdAt: -1 });
};

/**
 * Buscar tips por estado
 * @param {String} status - Estado del tip
 * @returns {Promise<Tip[]>}
 */
tipSchema.statics.findByStatus = function (status) {
  return this.find({ status })
    .sort({ createdAt: -1 })
    .populate('author', 'preferredName fullName email')
    .populate('approvedBy', 'preferredName fullName email');
};

/**
 * Buscar tips más populares (por likes)
 * @param {Number} limit - Número máximo de resultados
 * @returns {Promise<Tip[]>}
 */
tipSchema.statics.findMostLiked = async function (limit = 10) {
  return this.aggregate([
    { $match: { status: 'approved' } },
    {
      $addFields: {
        likeCount: { $size: '$likes' },
      },
    },
    { $sort: { likeCount: -1, createdAt: -1 } },
    { $limit: limit },
  ]);
};

/**
 * Búsqueda de texto completo
 * @param {String} searchText - Texto a buscar
 * @param {Object} filters - Filtros adicionales (category, etc.)
 * @returns {Promise<Tip[]>}
 */
tipSchema.statics.searchText = function (searchText, filters = {}) {
  const query = {
    $text: { $search: searchText },
    status: 'approved',
    ...filters,
  };

  return this.find(query, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .populate('author', 'preferredName fullName avatar');
};

/**
 * Obtener estadísticas de tips
 * @returns {Promise<Object>}
 */
tipSchema.statics.getStats = async function () {
  const total = await this.countDocuments();
  const pending = await this.countDocuments({ status: 'pending' });
  const approved = await this.countDocuments({ status: 'approved' });
  const rejected = await this.countDocuments({ status: 'rejected' });

  const byCategory = await this.aggregate([
    { $match: { status: 'approved' } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const totalViews = await this.aggregate([
    { $match: { status: 'approved' } },
    { $group: { _id: null, total: { $sum: '$views' } } },
  ]);

  const totalLikes = await this.aggregate([
    { $match: { status: 'approved' } },
    {
      $addFields: {
        likeCount: { $size: '$likes' },
      },
    },
    { $group: { _id: null, total: { $sum: '$likeCount' } } },
  ]);

  return {
    total,
    pending,
    approved,
    rejected,
    byCategory,
    totalViews: totalViews[0]?.total || 0,
    totalLikes: totalLikes[0]?.total || 0,
  };
};

// =====================================
// VIRTUALS (CAMPOS CALCULADOS)
// =====================================

/**
 * Virtual para obtener el número de likes
 */
tipSchema.virtual('likeCount').get(function () {
  return this.likes ? this.likes.length : 0;
});

/**
 * Virtual para verificar si está aprobado
 */
tipSchema.virtual('isApproved').get(function () {
  return this.status === 'approved';
});

/**
 * Virtual para verificar si está pendiente
 */
tipSchema.virtual('isPending').get(function () {
  return this.status === 'pending';
});

// Configurar para incluir virtuals en JSON y Object
tipSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    // Remover campos internos cuando se convierte a JSON
    delete ret.__v;
    return ret;
  },
});

tipSchema.set('toObject', { virtuals: true });

// =====================================
// MODELO
// =====================================

const Tip = mongoose.model('Tip', tipSchema);

export default Tip;
