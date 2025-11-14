import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

/**
 * User Model - Entre Amigas
 * Modelo de usuario para sistema de autenticación y gestión de usuarias
 */

const userSchema = new mongoose.Schema(
  {
    // Información Personal
    fullName: {
      type: String,
      required: [true, 'El nombre completo es requerido'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
    },
    preferredName: {
      type: String,
      required: [true, 'El nombre preferido es requerido'],
      trim: true,
      minlength: [2, 'El nombre preferido debe tener al menos 2 caracteres'],
      maxlength: [50, 'El nombre preferido no puede exceder 50 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'El email es requerido'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        'Por favor ingresa un email válido',
      ],
    },
    password: {
      type: String,
      required: function() {
        // Password es requerido solo si authProvider es 'local'
        return this.authProvider === 'local';
      },
      minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
      select: false, // No incluir password en queries por defecto
    },
    phone: {
      type: String,
      required: function() {
        // Phone es requerido solo si authProvider es 'local'
        return this.authProvider === 'local';
      },
      trim: true,
    },
    birthday: {
      type: Date,
      required: function() {
        // Birthday es requerido solo si authProvider es 'local'
        return this.authProvider === 'local';
      },
      validate: {
        validator: function (value) {
          // Validar que la fecha de nacimiento sea válida (entre 1920 y hace 18 años)
          const eighteenYearsAgo = new Date();
          eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
          const minDate = new Date('1920-01-01');
          return value >= minDate && value <= eighteenYearsAgo;
        },
        message: 'Debes tener al menos 18 años para registrarte',
      },
    },
    city: {
      type: String,
      required: function() {
        // City es requerido solo si authProvider es 'local'
        return this.authProvider === 'local';
      },
      trim: true,
    },

    // OAuth y Proveedores de Autenticación
    authProvider: {
      type: String,
      enum: {
        values: ['local', 'google'],
        message: '{VALUE} no es un proveedor de autenticación válido',
      },
      default: 'local',
    },
    googleId: {
      type: String,
      default: null,
      select: false, // No incluir en queries por defecto
    },

    // Roles y Permisos
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: '{VALUE} no es un rol válido',
      },
      default: 'user',
      required: [true, 'El rol es requerido'],
    },

    // Verificación y Seguridad
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false, // No incluir en queries por defecto
    },
    verificationTokenExpires: {
      type: Date,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },

    // Información Adicional (Opcional)
    profileImage: {
      type: String, // URL de S3
      default: null,
    },
    bio: {
      type: String,
      maxlength: [500, 'La biografía no puede exceder 500 caracteres'],
      default: '',
    },

    // Metadata
    lastLogin: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    collection: 'users', // Nombre explícito de la colección
  }
);

// =====================================
// ÍNDICES
// =====================================

// Índice único en email (más importante)
userSchema.index({ email: 1 }, { unique: true });

// Índices para búsquedas comunes
userSchema.index({ role: 1 });
userSchema.index({ city: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ isVerified: 1 });

// Índice compuesto para búsquedas de usuarios activos por ciudad
userSchema.index({ city: 1, isActive: 1 });

// =====================================
// HOOKS (MIDDLEWARE)
// =====================================

/**
 * Hook pre-save: Hashear password antes de guardar
 * Solo hashea si el password fue modificado o es nuevo
 */
userSchema.pre('save', async function (next) {
  // Solo hashear si el password fue modificado o es nuevo
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generar salt y hashear password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Hook pre-save: Generar token de verificación si usuario es nuevo
 */
userSchema.pre('save', function (next) {
  if (this.isNew && !this.isVerified) {
    // Generar token de verificación (crypto random)
    this.verificationToken = crypto.randomBytes(32).toString('hex');

    // Expira en 24 horas
    this.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }
  next();
});

/**
 * Hook post-save: Log de confirmación (solo en desarrollo)
 */
userSchema.post('save', function (doc) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`✅ Usuario guardado: ${doc.email} (${doc._id})`);
  }
});

// =====================================
// MÉTODOS DE INSTANCIA
// =====================================

/**
 * Comparar password ingresado con el hasheado en la base de datos
 * @param {String} candidatePassword - Password en texto plano ingresado por el usuario
 * @returns {Promise<Boolean>} - True si coinciden, false si no
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Error al comparar contraseñas');
  }
};

/**
 * Generar token de reset de password
 * @returns {String} - Token generado
 */
userSchema.methods.generatePasswordResetToken = function () {
  // Generar token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Guardar hash del token en el documento
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Expira en 1 hora
  this.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);

  // Retornar token sin hashear (este se envía por email)
  return resetToken;
};

/**
 * Verificar si el token de verificación de email ha expirado
 * @returns {Boolean}
 */
userSchema.methods.isVerificationTokenExpired = function () {
  if (!this.verificationTokenExpires) return true;
  return Date.now() > this.verificationTokenExpires.getTime();
};

/**
 * Obtener datos públicos del usuario (sin información sensible)
 * @returns {Object}
 */
userSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    fullName: this.fullName,
    preferredName: this.preferredName,
    email: this.email,
    city: this.city,
    profileImage: this.profileImage,
    bio: this.bio,
    role: this.role,
    isVerified: this.isVerified,
    createdAt: this.createdAt,
  };
};

// =====================================
// MÉTODOS ESTÁTICOS
// =====================================

/**
 * Buscar usuario por email (incluyendo password para login)
 * @param {String} email
 * @returns {Promise<User>}
 */
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() }).select('+password');
};

/**
 * Buscar usuarios activos por ciudad
 * @param {String} city
 * @returns {Promise<User[]>}
 */
userSchema.statics.findActiveByCity = function (city) {
  return this.find({ city, isActive: true, isVerified: true });
};

/**
 * Contar usuarios verificados
 * @returns {Promise<Number>}
 */
userSchema.statics.countVerified = function () {
  return this.countDocuments({ isVerified: true, isActive: true });
};

// =====================================
// VIRTUALS (CAMPOS CALCULADOS)
// =====================================

/**
 * Virtual para obtener edad aproximada del usuario
 */
userSchema.virtual('age').get(function () {
  if (!this.birthday) return null;
  const today = new Date();
  const birthDate = new Date(this.birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Configurar para incluir virtuals en JSON y Object
userSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    // Remover campos sensibles cuando se convierte a JSON
    delete ret.password;
    delete ret.verificationToken;
    delete ret.verificationTokenExpires;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpires;
    delete ret.__v;
    return ret;
  },
});

userSchema.set('toObject', { virtuals: true });

// =====================================
// MODELO
// =====================================

const User = mongoose.model('User', userSchema);

export default User;
