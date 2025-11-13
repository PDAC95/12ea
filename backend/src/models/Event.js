import mongoose from 'mongoose';

/**
 * Event Model - Entre Amigas
 * Modelo para gestión de eventos comunitarios para mujeres migrantes
 */

const eventSchema = new mongoose.Schema(
  {
    // Información Básica del Evento
    title: {
      type: String,
      required: [true, 'El título del evento es requerido'],
      trim: true,
      minlength: [5, 'El título debe tener al menos 5 caracteres'],
      maxlength: [150, 'El título no puede exceder 150 caracteres'],
    },
    description: {
      type: String,
      required: [true, 'La descripción es requerida'],
      trim: true,
      minlength: [20, 'La descripción debe tener al menos 20 caracteres'],
      maxlength: [2000, 'La descripción no puede exceder 2000 caracteres'],
    },

    // Fecha y Hora
    date: {
      type: Date,
      required: [true, 'La fecha del evento es requerida'],
      validate: {
        validator: function (value) {
          // Validar que la fecha sea futura (excepto al editar)
          if (this.isNew) {
            return value >= new Date();
          }
          return true;
        },
        message: 'La fecha del evento debe ser futura',
      },
      index: true, // Índice para ordenar y filtrar por fecha
    },
    time: {
      type: String,
      required: [true, 'La hora del evento es requerida'],
      trim: true,
      validate: {
        validator: function (value) {
          // Validar formato HH:MM (24 horas)
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
        },
        message: 'La hora debe estar en formato HH:MM (ej: 14:30)',
      },
    },

    // Modalidad del Evento
    mode: {
      type: String,
      required: [true, 'La modalidad del evento es requerida'],
      enum: {
        values: ['virtual', 'presencial', 'híbrido'],
        message: '{VALUE} no es una modalidad válida. Usa: virtual, presencial o híbrido',
      },
      lowercase: true,
      index: true, // Índice para filtrar por modalidad
    },

    // Ubicación (para eventos presenciales o híbridos)
    location: {
      type: String,
      trim: true,
      maxlength: [200, 'La ubicación no puede exceder 200 caracteres'],
      required: function () {
        // Location es requerido para presencial o híbrido
        return this.mode === 'presencial' || this.mode === 'híbrido';
      },
    },

    // Link (para eventos virtuales o híbridos)
    link: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          if (!value) return true; // Permitir vacío
          // Validar URL (Zoom, Meet, Teams, etc.)
          return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(value);
        },
        message: 'Por favor ingresa una URL válida para el evento virtual',
      },
      required: function () {
        // Link es requerido para virtual o híbrido
        return this.mode === 'virtual' || this.mode === 'híbrido';
      },
    },

    // Capacidad y Registro
    capacity: {
      type: Number,
      required: [true, 'La capacidad del evento es requerida'],
      min: [1, 'La capacidad debe ser al menos 1 persona'],
      max: [1000, 'La capacidad no puede exceder 1000 personas'],
      validate: {
        validator: Number.isInteger,
        message: 'La capacidad debe ser un número entero',
      },
    },
    registeredCount: {
      type: Number,
      default: 0,
      min: [0, 'El contador de registros no puede ser negativo'],
    },

    // Media
    image: {
      type: String,
      default: 'https://entre-amigas-dev.s3.us-east-1.amazonaws.com/defaults/event-placeholder.png',
      validate: {
        validator: function (value) {
          if (!value) return true;
          // Validar que sea una URL válida (más flexible para servicios como Unsplash, S3, etc.)
          return /^https?:\/\/.+/i.test(value);
        },
        message: 'La imagen debe ser una URL válida (debe empezar con http:// o https://)',
      },
    },

    // Organizador/Creador
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El organizador del evento es requerido'],
      index: true, // Índice para buscar eventos por organizador
    },

    // Estado y Visibilidad
    status: {
      type: String,
      enum: {
        values: ['draft', 'published', 'cancelled', 'completed'],
        message: '{VALUE} no es un estado válido',
      },
      default: 'published',
      index: true, // Índice para filtrar por estado
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true, // Índice para filtrar eventos activos
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true, // Índice para destacar eventos
    },

    // Estadísticas
    views: {
      type: Number,
      default: 0,
      min: [0, 'Las vistas no pueden ser negativas'],
    },

    // Metadata
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancellationReason: {
      type: String,
      trim: true,
      maxlength: [500, 'El motivo de cancelación no puede exceder 500 caracteres'],
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    collection: 'events', // Nombre explícito de la colección
  }
);

// =====================================
// ÍNDICES
// =====================================

// Índice de texto para búsqueda full-text
eventSchema.index(
  { title: 'text', description: 'text' },
  {
    weights: {
      title: 10,        // Mayor peso al título
      description: 1,   // Menor peso a descripción
    },
    name: 'event_text_search',
  }
);

// Índices individuales para búsquedas y filtros
eventSchema.index({ date: 1 }); // Ordenar por fecha
eventSchema.index({ mode: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ isActive: 1 });
eventSchema.index({ isFeatured: 1 });

// Índices compuestos para queries comunes
eventSchema.index({ status: 1, date: 1 }); // Eventos publicados ordenados por fecha
eventSchema.index({ isActive: 1, date: 1 }); // Eventos activos ordenados por fecha
eventSchema.index({ mode: 1, date: 1 }); // Filtrar por modalidad y fecha
eventSchema.index({ isActive: 1, status: 1, date: 1 }); // Query principal

// =====================================
// HOOKS (MIDDLEWARE)
// =====================================

/**
 * Hook pre-save: Validar coherencia de campos según modalidad
 */
eventSchema.pre('save', function (next) {
  // Asegurar que link tenga protocolo si existe
  if (this.link && !this.link.startsWith('http')) {
    this.link = `https://${this.link}`;
  }

  // Validar que registeredCount no exceda capacity
  if (this.registeredCount > this.capacity) {
    return next(new Error('El número de registros no puede exceder la capacidad del evento'));
  }

  next();
});

/**
 * Hook post-save: Log de confirmación (solo en desarrollo)
 */
eventSchema.post('save', function (doc) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`✅ Evento guardado: ${doc.title} (${doc._id})`);
  }
});

// =====================================
// MÉTODOS DE INSTANCIA
// =====================================

/**
 * Incrementar contador de vistas
 * @returns {Promise<Event>}
 */
eventSchema.methods.incrementViews = async function () {
  this.views += 1;
  return await this.save();
};

/**
 * Incrementar contador de registros
 * @returns {Promise<Event>}
 */
eventSchema.methods.incrementRegistrations = async function () {
  if (this.registeredCount >= this.capacity) {
    throw new Error('El evento ha alcanzado su capacidad máxima');
  }
  this.registeredCount += 1;
  return await this.save();
};

/**
 * Decrementar contador de registros (cuando alguien cancela)
 * @returns {Promise<Event>}
 */
eventSchema.methods.decrementRegistrations = async function () {
  if (this.registeredCount > 0) {
    this.registeredCount -= 1;
    return await this.save();
  }
  return this;
};

/**
 * Cancelar evento
 * @param {String} reason - Motivo de cancelación
 * @returns {Promise<Event>}
 */
eventSchema.methods.cancel = async function (reason) {
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  if (reason) {
    this.cancellationReason = reason;
  }
  return await this.save();
};

/**
 * Marcar evento como completado
 * @returns {Promise<Event>}
 */
eventSchema.methods.markAsCompleted = async function () {
  this.status = 'completed';
  return await this.save();
};

/**
 * Verificar si el evento está lleno
 * @returns {Boolean}
 */
eventSchema.methods.isFull = function () {
  return this.registeredCount >= this.capacity;
};

/**
 * Verificar si el evento ya pasó
 * @returns {Boolean}
 */
eventSchema.methods.isPast = function () {
  const eventDateTime = new Date(this.date);
  return eventDateTime < new Date();
};

/**
 * Verificar si se puede registrar al evento
 * @returns {Object} - { canRegister: Boolean, reason: String }
 */
eventSchema.methods.canRegister = function () {
  if (this.status !== 'published') {
    return { canRegister: false, reason: 'El evento no está publicado' };
  }
  if (!this.isActive) {
    return { canRegister: false, reason: 'El evento no está activo' };
  }
  if (this.isFull()) {
    return { canRegister: false, reason: 'El evento está lleno' };
  }
  if (this.isPast()) {
    return { canRegister: false, reason: 'El evento ya pasó' };
  }
  return { canRegister: true, reason: null };
};

/**
 * Obtener datos públicos del evento (para API)
 * @returns {Object}
 */
eventSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    title: this.title,
    description: this.description,
    date: this.date,
    time: this.time,
    mode: this.mode,
    location: this.location,
    link: this.link,
    capacity: this.capacity,
    registeredCount: this.registeredCount,
    availableSpots: this.availableSpots,
    image: this.image,
    status: this.status,
    isFeatured: this.isFeatured,
    isFull: this.isFull(),
    isPast: this.isPast(),
    views: this.views,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// =====================================
// MÉTODOS ESTÁTICOS
// =====================================

/**
 * Buscar eventos próximos (futuros y publicados)
 * @param {Number} limit - Número máximo de resultados
 * @returns {Promise<Event[]>}
 */
eventSchema.statics.findUpcoming = function (limit = 10) {
  return this.find({
    status: 'published',
    isActive: true,
    date: { $gte: new Date() },
  })
    .sort({ date: 1 }) // Ordenar por fecha ascendente (próximos primero)
    .limit(limit)
    .populate('organizer', 'preferredName email profileImage');
};

/**
 * Buscar eventos por modalidad
 * @param {String} mode - Modalidad del evento
 * @returns {Promise<Event[]>}
 */
eventSchema.statics.findByMode = function (mode) {
  return this.find({
    mode,
    status: 'published',
    isActive: true,
    date: { $gte: new Date() },
  })
    .sort({ date: 1 })
    .populate('organizer', 'preferredName email profileImage');
};

/**
 * Buscar eventos destacados
 * @param {Number} limit - Número máximo de resultados
 * @returns {Promise<Event[]>}
 */
eventSchema.statics.findFeatured = function (limit = 3) {
  return this.find({
    status: 'published',
    isActive: true,
    isFeatured: true,
    date: { $gte: new Date() },
  })
    .sort({ date: 1 })
    .limit(limit)
    .populate('organizer', 'preferredName email profileImage');
};

/**
 * Buscar eventos por organizador
 * @param {ObjectId} organizerId
 * @returns {Promise<Event[]>}
 */
eventSchema.statics.findByOrganizer = function (organizerId) {
  return this.find({ organizer: organizerId }).sort({ date: -1 });
};

/**
 * Buscar eventos con cupos disponibles
 * @returns {Promise<Event[]>}
 */
eventSchema.statics.findAvailable = function () {
  return this.find({
    status: 'published',
    isActive: true,
    date: { $gte: new Date() },
    $expr: { $lt: ['$registeredCount', '$capacity'] }, // registeredCount < capacity
  })
    .sort({ date: 1 })
    .populate('organizer', 'preferredName email profileImage');
};

/**
 * Obtener estadísticas de eventos
 * @returns {Promise<Object>}
 */
eventSchema.statics.getStats = async function () {
  const total = await this.countDocuments();
  const upcoming = await this.countDocuments({
    status: 'published',
    isActive: true,
    date: { $gte: new Date() },
  });
  const past = await this.countDocuments({
    date: { $lt: new Date() },
  });
  const cancelled = await this.countDocuments({ status: 'cancelled' });

  const byMode = await this.aggregate([
    { $match: { status: 'published', isActive: true, date: { $gte: new Date() } } },
    { $group: { _id: '$mode', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const totalCapacity = await this.aggregate([
    { $match: { status: 'published', isActive: true, date: { $gte: new Date() } } },
    { $group: { _id: null, total: { $sum: '$capacity' }, registered: { $sum: '$registeredCount' } } },
  ]);

  return {
    total,
    upcoming,
    past,
    cancelled,
    byMode,
    capacity: totalCapacity[0] || { total: 0, registered: 0 },
  };
};

// =====================================
// VIRTUALS (CAMPOS CALCULADOS)
// =====================================

/**
 * Virtual para obtener cupos disponibles
 */
eventSchema.virtual('availableSpots').get(function () {
  return this.capacity - this.registeredCount;
});

/**
 * Virtual para obtener fecha y hora combinadas
 */
eventSchema.virtual('dateTime').get(function () {
  const [hours, minutes] = this.time.split(':');
  const dateTime = new Date(this.date);
  dateTime.setHours(parseInt(hours), parseInt(minutes));
  return dateTime;
});

/**
 * Virtual para obtener tasa de ocupación (%)
 */
eventSchema.virtual('occupancyRate').get(function () {
  if (this.capacity === 0) return 0;
  return ((this.registeredCount / this.capacity) * 100).toFixed(2);
});

// Configurar para incluir virtuals en JSON y Object
eventSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    // Remover campos internos cuando se convierte a JSON
    delete ret.__v;
    return ret;
  },
});

eventSchema.set('toObject', { virtuals: true });

// =====================================
// MODELO
// =====================================

const Event = mongoose.model('Event', eventSchema);

export default Event;
