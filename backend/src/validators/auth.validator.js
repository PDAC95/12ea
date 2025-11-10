import { body, validationResult } from 'express-validator';

/**
 * Auth Validators - Entre Amigas
 * Validaciones para autenticación y registro usando express-validator
 */

/**
 * Validación para registro de usuario
 * Campos requeridos: fullName, preferredName, email, password, phone, birthday, city
 */
export const registerValidation = [
  // Full Name
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('El nombre completo es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre completo debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre completo solo puede contener letras y espacios'),

  // Preferred Name
  body('preferredName')
    .trim()
    .notEmpty()
    .withMessage('El nombre preferido es requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre preferido debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre preferido solo puede contener letras y espacios'),

  // Email
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es requerido')
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail()
    .toLowerCase(),

  // Password
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),

  // Confirm Password
  body('confirmPassword')
    .notEmpty()
    .withMessage('La confirmación de contraseña es requerida')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Las contraseñas no coinciden');
      }
      return true;
    }),

  // Phone
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('El teléfono es requerido')
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('El formato del teléfono no es válido')
    .isLength({ min: 10, max: 20 })
    .withMessage('El teléfono debe tener entre 10 y 20 caracteres'),

  // Birthday
  body('birthday')
    .notEmpty()
    .withMessage('La fecha de nacimiento es requerida')
    .isISO8601()
    .withMessage('La fecha de nacimiento debe ser una fecha válida (formato: YYYY-MM-DD)')
    .custom((value) => {
      const birthday = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthday.getFullYear();

      // Verificar que sea mayor de 18 años
      if (age < 18) {
        throw new Error('Debes ser mayor de 18 años para registrarte');
      }

      // Verificar que la fecha no sea futura
      if (birthday > today) {
        throw new Error('La fecha de nacimiento no puede ser futura');
      }

      // Verificar que no sea demasiado antigua (ej: más de 120 años)
      if (age > 120) {
        throw new Error('La fecha de nacimiento no es válida');
      }

      return true;
    }),

  // City
  body('city')
    .trim()
    .notEmpty()
    .withMessage('La ciudad es requerida')
    .isLength({ min: 2, max: 100 })
    .withMessage('La ciudad debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s,\-\.\/]+$/)
    .withMessage('La ciudad solo puede contener letras, espacios y caracteres de puntuación básicos'),
];

/**
 * Validación para login
 * Campos requeridos: email, password
 */
export const loginValidation = [
  // Email
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es requerido')
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail()
    .toLowerCase(),

  // Password
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
];

/**
 * Validación para solicitud de recuperación de contraseña
 * Campos requeridos: email
 */
export const forgotPasswordValidation = [
  // Email
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es requerido')
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail()
    .toLowerCase(),
];

/**
 * Validación para reset de contraseña
 * Campos requeridos: password, confirmPassword
 */
export const resetPasswordValidation = [
  // Password
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),

  // Confirm Password
  body('confirmPassword')
    .notEmpty()
    .withMessage('La confirmación de contraseña es requerida')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Las contraseñas no coinciden');
      }
      return true;
    }),
];

/**
 * Validación para actualización de perfil
 * Todos los campos son opcionales, pero si se proporcionan deben ser válidos
 */
export const updateProfileValidation = [
  // Full Name (opcional)
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre completo debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre completo solo puede contener letras y espacios'),

  // Preferred Name (opcional)
  body('preferredName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre preferido debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre preferido solo puede contener letras y espacios'),

  // Phone (opcional)
  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('El formato del teléfono no es válido')
    .isLength({ min: 10, max: 20 })
    .withMessage('El teléfono debe tener entre 10 y 20 caracteres'),

  // Birthday (opcional)
  body('birthday')
    .optional()
    .isISO8601()
    .withMessage('La fecha de nacimiento debe tener formato válido (YYYY-MM-DD)')
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      // Verificar que la fecha no sea futura
      if (birthDate > today) {
        throw new Error('La fecha de nacimiento no puede ser futura');
      }

      // Verificar que tenga al menos 18 años
      const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ? age - 1
        : age;

      if (actualAge < 18) {
        throw new Error('Debes tener al menos 18 años');
      }

      return true;
    }),

  // City (opcional)
  body('city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('La ciudad debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s,\-\.\/]+$/)
    .withMessage('La ciudad solo puede contener letras, espacios y caracteres de puntuación básicos'),

  // Bio (opcional)
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La biografía no puede exceder 500 caracteres'),
];

/**
 * Validación para cambio de contraseña (cuando el usuario está autenticado)
 * Campos requeridos: currentPassword, newPassword, confirmNewPassword
 */
export const changePasswordValidation = [
  // Current Password
  body('currentPassword')
    .notEmpty()
    .withMessage('La contraseña actual es requerida'),

  // New Password
  body('newPassword')
    .notEmpty()
    .withMessage('La nueva contraseña es requerida')
    .isLength({ min: 8 })
    .withMessage('La nueva contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La nueva contraseña debe contener al menos una mayúscula, una minúscula y un número')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('La nueva contraseña debe ser diferente a la actual');
      }
      return true;
    }),

  // Confirm New Password
  body('confirmNewPassword')
    .notEmpty()
    .withMessage('La confirmación de la nueva contraseña es requerida')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Las contraseñas no coinciden');
      }
      return true;
    }),
];

/**
 * Middleware para manejar errores de validación
 * Debe usarse después de las validaciones en las rutas
 *
 * @example
 * router.post('/register', registerValidation, handleValidationErrors, register);
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array().map(error => ({
        field: error.path || error.param,
        message: error.msg,
        value: error.value
      }))
    });
  }

  next();
};

// Export default con todas las validaciones
export default {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  updateProfileValidation,
  changePasswordValidation,
  handleValidationErrors,
};
