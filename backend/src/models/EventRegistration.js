import mongoose from 'mongoose';

/**
 * EventRegistration Model - Entre Amigas
 * Modelo para gestión de registros de usuarias en eventos
 */

const eventRegistrationSchema = new mongoose.Schema(
  {
    // Relación con Usuario
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario es requerido'],
      index: true, // Índice para búsquedas por usuario
    },

    // Relación con Evento
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'El evento es requerido'],
      index: true, // Índice para búsquedas por evento
    },

    // Estado del Registro
    status: {
      type: String,
      enum: {
        values: ['confirmed', 'cancelled'],
        message: '{VALUE} no es un estado válido. Usa: confirmed o cancelled',
      },
      default: 'confirmed',
      index: true, // Índice para filtrar por estado
    },

    // Metadata del Registro
    registeredAt: {
      type: Date,
      default: Date.now,
      immutable: true, // No se puede modificar después de crear
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancellationReason: {
      type: String,
      trim: true,
      maxlength: [500, 'El motivo de cancelación no puede exceder 500 caracteres'],
    },

    // Información Adicional (Opcional)
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Las notas no pueden exceder 1000 caracteres'],
    },

    // Confirmación de Asistencia (para eventos presenciales/híbridos)
    attended: {
      type: Boolean,
      default: null, // null = no marcado, true = asistió, false = no asistió
    },
    attendedAt: {
      type: Date,
      default: null,
    },

    // Recordatorios de Email
    reminderSent: {
      type: Boolean,
      default: false,
    },
    reminderSentAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    collection: 'event_registrations', // Nombre explícito de la colección
  }
);

// =====================================
// ÍNDICES
// =====================================

// Índice compuesto ÚNICO: un usuario solo puede registrarse una vez en un evento
eventRegistrationSchema.index(
  { user: 1, event: 1 },
  {
    unique: true,
    name: 'unique_user_event_registration',
    // Este índice previene registros duplicados
  }
);

// Índices individuales para búsquedas comunes
eventRegistrationSchema.index({ status: 1 });
eventRegistrationSchema.index({ registeredAt: -1 }); // Ordenar por fecha de registro
eventRegistrationSchema.index({ attended: 1 });

// Índices compuestos para queries comunes
eventRegistrationSchema.index({ event: 1, status: 1 }); // Registros confirmados por evento
eventRegistrationSchema.index({ user: 1, status: 1 }); // Registros confirmados por usuario
eventRegistrationSchema.index({ event: 1, attended: 1 }); // Asistencia por evento
eventRegistrationSchema.index({ reminderSent: 1, status: 1 }); // Para envío de recordatorios

// =====================================
// HOOKS (MIDDLEWARE)
// =====================================

/**
 * Hook pre-save: Actualizar contador de registros en el evento
 */
eventRegistrationSchema.pre('save', async function (next) {
  // Solo actualizar si es un nuevo registro o si cambió el status
  if (this.isNew || this.isModified('status')) {
    try {
      const Event = mongoose.model('Event');
      const event = await Event.findById(this.event);

      if (!event) {
        return next(new Error('Evento no encontrado'));
      }

      // Si es nuevo registro confirmado, incrementar contador
      if (this.isNew && this.status === 'confirmed') {
        await event.incrementRegistrations();
      }

      // Si cambió de confirmed a cancelled, decrementar contador
      if (!this.isNew && this.isModified('status')) {
        const wasConfirmed = this._original?.status === 'confirmed';
        const nowCancelled = this.status === 'cancelled';

        if (wasConfirmed && nowCancelled) {
          await event.decrementRegistrations();
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

/**
 * Hook pre-save: Guardar estado original para comparar en el hook
 */
eventRegistrationSchema.pre('save', function (next) {
  if (!this.isNew) {
    this._original = this._doc;
  }
  next();
});

/**
 * Hook pre-save: Marcar cancelledAt cuando status cambia a cancelled
 */
eventRegistrationSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'cancelled' && !this.cancelledAt) {
    this.cancelledAt = new Date();
  }
  next();
});

/**
 * Hook post-save: Log de confirmación (solo en desarrollo)
 */
eventRegistrationSchema.post('save', function (doc) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`✅ Registro guardado: Usuario ${doc.user} → Evento ${doc.event} (${doc.status})`);
  }
});

/**
 * Hook pre-remove: Decrementar contador en evento al eliminar registro
 */
eventRegistrationSchema.pre('remove', async function (next) {
  try {
    if (this.status === 'confirmed') {
      const Event = mongoose.model('Event');
      const event = await Event.findById(this.event);
      if (event) {
        await event.decrementRegistrations();
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

// =====================================
// MÉTODOS DE INSTANCIA
// =====================================

/**
 * Cancelar registro
 * @param {String} reason - Motivo de cancelación
 * @returns {Promise<EventRegistration>}
 */
eventRegistrationSchema.methods.cancel = async function (reason) {
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  if (reason) {
    this.cancellationReason = reason;
  }
  return await this.save();
};

/**
 * Marcar asistencia
 * @param {Boolean} attended - true si asistió, false si no
 * @returns {Promise<EventRegistration>}
 */
eventRegistrationSchema.methods.markAttendance = async function (attended) {
  this.attended = attended;
  this.attendedAt = new Date();
  return await this.save();
};

/**
 * Marcar recordatorio como enviado
 * @returns {Promise<EventRegistration>}
 */
eventRegistrationSchema.methods.markReminderSent = async function () {
  this.reminderSent = true;
  this.reminderSentAt = new Date();
  return await this.save();
};

/**
 * Verificar si el registro está activo (confirmado)
 * @returns {Boolean}
 */
eventRegistrationSchema.methods.isActive = function () {
  return this.status === 'confirmed';
};

/**
 * Obtener datos públicos del registro (para API)
 * @returns {Object}
 */
eventRegistrationSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    status: this.status,
    registeredAt: this.registeredAt,
    cancelledAt: this.cancelledAt,
    attended: this.attended,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// =====================================
// MÉTODOS ESTÁTICOS
// =====================================

/**
 * Buscar registros de un usuario (próximos eventos)
 * @param {ObjectId} userId
 * @param {String} statusFilter - 'confirmed', 'cancelled', o null para todos
 * @returns {Promise<EventRegistration[]>}
 */
eventRegistrationSchema.statics.findByUser = function (userId, statusFilter = 'confirmed') {
  const query = { user: userId };
  if (statusFilter) {
    query.status = statusFilter;
  }

  return this.find(query)
    .populate({
      path: 'event',
      select: 'title description date time mode location link image status isFeatured capacity registeredCount',
      match: { isActive: true }, // Solo eventos activos
    })
    .sort({ 'event.date': 1 }); // Ordenar por fecha del evento (próximos primero)
};

/**
 * Buscar registros de un evento
 * @param {ObjectId} eventId
 * @param {String} statusFilter - 'confirmed', 'cancelled', o null para todos
 * @returns {Promise<EventRegistration[]>}
 */
eventRegistrationSchema.statics.findByEvent = function (eventId, statusFilter = 'confirmed') {
  const query = { event: eventId };
  if (statusFilter) {
    query.status = statusFilter;
  }

  return this.find(query)
    .populate('user', 'preferredName email phone profileImage')
    .sort({ registeredAt: -1 }); // Más recientes primero
};

/**
 * Contar registros confirmados de un evento
 * @param {ObjectId} eventId
 * @returns {Promise<Number>}
 */
eventRegistrationSchema.statics.countConfirmedByEvent = function (eventId) {
  return this.countDocuments({ event: eventId, status: 'confirmed' });
};

/**
 * Verificar si un usuario ya está registrado en un evento
 * @param {ObjectId} userId
 * @param {ObjectId} eventId
 * @returns {Promise<EventRegistration|null>}
 */
eventRegistrationSchema.statics.findExisting = function (userId, eventId) {
  return this.findOne({ user: userId, event: eventId });
};

/**
 * Buscar registros que necesitan recordatorio
 * (eventos en las próximas 24 horas, recordatorio no enviado)
 * @returns {Promise<EventRegistration[]>}
 */
eventRegistrationSchema.statics.findNeedingReminder = function () {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const today = new Date();

  return this.find({
    status: 'confirmed',
    reminderSent: false,
  })
    .populate({
      path: 'event',
      match: {
        date: { $gte: today, $lte: tomorrow },
        status: 'published',
        isActive: true,
      },
    })
    .populate('user', 'preferredName email');
};

/**
 * Obtener estadísticas de asistencia de un evento
 * @param {ObjectId} eventId
 * @returns {Promise<Object>}
 */
eventRegistrationSchema.statics.getAttendanceStats = async function (eventId) {
  const total = await this.countDocuments({ event: eventId });
  const confirmed = await this.countDocuments({ event: eventId, status: 'confirmed' });
  const cancelled = await this.countDocuments({ event: eventId, status: 'cancelled' });
  const attended = await this.countDocuments({ event: eventId, attended: true });
  const notAttended = await this.countDocuments({ event: eventId, attended: false });
  const pending = await this.countDocuments({ event: eventId, attended: null });

  return {
    total,
    confirmed,
    cancelled,
    attended,
    notAttended,
    pending,
    attendanceRate: confirmed > 0 ? ((attended / confirmed) * 100).toFixed(2) : 0,
  };
};

/**
 * Obtener estadísticas generales de registros
 * @returns {Promise<Object>}
 */
eventRegistrationSchema.statics.getStats = async function () {
  const total = await this.countDocuments();
  const confirmed = await this.countDocuments({ status: 'confirmed' });
  const cancelled = await this.countDocuments({ status: 'cancelled' });
  const withReminder = await this.countDocuments({ reminderSent: true });

  return {
    total,
    confirmed,
    cancelled,
    withReminder,
    cancellationRate: total > 0 ? ((cancelled / total) * 100).toFixed(2) : 0,
  };
};

// =====================================
// VIRTUALS (CAMPOS CALCULADOS)
// =====================================

/**
 * Virtual para verificar si fue cancelado
 */
eventRegistrationSchema.virtual('isCancelled').get(function () {
  return this.status === 'cancelled';
});

/**
 * Virtual para verificar si asistió al evento
 */
eventRegistrationSchema.virtual('didAttend').get(function () {
  return this.attended === true;
});

/**
 * Virtual para obtener días desde el registro
 */
eventRegistrationSchema.virtual('daysSinceRegistration').get(function () {
  const now = new Date();
  const registered = new Date(this.registeredAt);
  const diffTime = Math.abs(now - registered);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Configurar para incluir virtuals en JSON y Object
eventRegistrationSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    // Remover campos internos cuando se convierte a JSON
    delete ret.__v;
    delete ret._original;
    return ret;
  },
});

eventRegistrationSchema.set('toObject', { virtuals: true });

// =====================================
// MODELO
// =====================================

const EventRegistration = mongoose.model('EventRegistration', eventRegistrationSchema);

export default EventRegistration;
