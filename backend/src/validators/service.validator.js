import { body, validationResult } from 'express-validator';

/**
 * Service Validators - Entre Amigas
 * Validaciones para creación y actualización de servicios usando express-validator
 */

/**
 * Tipos de servicio válidos
 */
const VALID_SERVICE_TYPES = [
  'Salud',
  'Legal',
  'Educación',
  'Financiero',
  'Inmigración',
  'Traducción',
  'Tecnología',
  'Consultoría',
  'Otros',
];

/**
 * Validación para crear servicio
 * Campos requeridos: name, serviceType, description, city
 * Campos opcionales: credentials, phone, email, whatsapp, address, website, instagram, facebook, linkedin, logo, images
 */
export const createServiceValidation = [
  // Name (requerido)
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre del servicio es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),

  // ServiceType (requerido)
  body('serviceType')
    .trim()
    .notEmpty()
    .withMessage('El tipo de servicio es requerido')
    .isIn(VALID_SERVICE_TYPES)
    .withMessage(`El tipo de servicio debe ser uno de: ${VALID_SERVICE_TYPES.join(', ')}`),

  // Description (requerido)
  body('description')
    .trim()
    .notEmpty()
    .withMessage('La descripción es requerida')
    .isLength({ min: 20, max: 1000 })
    .withMessage('La descripción debe tener entre 20 y 1000 caracteres'),

  // City (requerido)
  body('city')
    .trim()
    .notEmpty()
    .withMessage('La ciudad es requerida')
    .isLength({ min: 2, max: 100 })
    .withMessage('La ciudad debe tener entre 2 y 100 caracteres'),

  // Credentials (opcional)
  body('credentials')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Las credenciales no pueden exceder 500 caracteres'),

  // Phone (opcional)
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[\d\s\-\+\(\)]{10,20}$/)
    .withMessage('El teléfono debe tener un formato válido (10-20 caracteres)'),

  // Email (opcional)
  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail()
    .toLowerCase(),

  // WhatsApp (opcional)
  body('whatsapp')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[\d\s\-\+\(\)]{10,20}$/)
    .withMessage('El WhatsApp debe tener un formato válido (10-20 caracteres)'),

  // Address (opcional)
  body('address')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage('La dirección no puede exceder 200 caracteres'),

  // Website (opcional)
  body('website')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)
    .withMessage('El sitio web debe tener un formato válido de URL'),

  // Instagram (opcional)
  body('instagram')
    .optional({ checkFalsy: true })
    .trim()
    .custom((value) => {
      // Puede ser username o URL completa
      const usernameRegex = /^(@)?[\w](?!.*?\.{2})[\w.]{1,28}[\w]$/;
      const urlRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/[\w.]+\/?$/;

      if (!usernameRegex.test(value) && !urlRegex.test(value)) {
        throw new Error('Instagram debe ser un nombre de usuario válido o URL de Instagram');
      }
      return true;
    }),

  // Facebook (opcional)
  body('facebook')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^(https?:\/\/)?(www\.)?facebook\.com\/[\w.]+\/?$/)
    .withMessage('Facebook debe ser una URL válida de Facebook'),

  // LinkedIn (opcional)
  body('linkedin')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[\w-]+\/?$/)
    .withMessage('LinkedIn debe ser una URL válida de LinkedIn'),

  // Logo (opcional)
  body('logo')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|svg)$/i)
    .withMessage('El logo debe ser una URL válida de imagen (jpg, jpeg, png, webp, gif, svg)'),

  // Images (opcional - array de URLs)
  body('images')
    .optional()
    .isArray()
    .withMessage('Las imágenes deben ser un array de URLs'),

  body('images.*')
    .optional()
    .matches(/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i)
    .withMessage('Cada imagen debe ser una URL válida (jpg, jpeg, png, webp, gif)'),
];

/**
 * Validación para actualizar servicio
 * Todos los campos son opcionales en una actualización
 */
export const updateServiceValidation = [
  // Name (opcional)
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre del servicio no puede estar vacío')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),

  // ServiceType (opcional)
  body('serviceType')
    .optional()
    .trim()
    .isIn(VALID_SERVICE_TYPES)
    .withMessage(`El tipo de servicio debe ser uno de: ${VALID_SERVICE_TYPES.join(', ')}`),

  // Description (opcional)
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('La descripción no puede estar vacía')
    .isLength({ min: 20, max: 1000 })
    .withMessage('La descripción debe tener entre 20 y 1000 caracteres'),

  // City (opcional)
  body('city')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('La ciudad no puede estar vacía')
    .isLength({ min: 2, max: 100 })
    .withMessage('La ciudad debe tener entre 2 y 100 caracteres'),

  // Credentials (opcional)
  body('credentials')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Las credenciales no pueden exceder 500 caracteres'),

  // Phone (opcional)
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[\d\s\-\+\(\)]{10,20}$/)
    .withMessage('El teléfono debe tener un formato válido (10-20 caracteres)'),

  // Email (opcional)
  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail()
    .toLowerCase(),

  // WhatsApp (opcional)
  body('whatsapp')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[\d\s\-\+\(\)]{10,20}$/)
    .withMessage('El WhatsApp debe tener un formato válido (10-20 caracteres)'),

  // Address (opcional)
  body('address')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage('La dirección no puede exceder 200 caracteres'),

  // Website (opcional)
  body('website')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)
    .withMessage('El sitio web debe tener un formato válido de URL'),

  // Instagram (opcional)
  body('instagram')
    .optional({ checkFalsy: true })
    .trim()
    .custom((value) => {
      const usernameRegex = /^(@)?[\w](?!.*?\.{2})[\w.]{1,28}[\w]$/;
      const urlRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/[\w.]+\/?$/;

      if (!usernameRegex.test(value) && !urlRegex.test(value)) {
        throw new Error('Instagram debe ser un nombre de usuario válido o URL de Instagram');
      }
      return true;
    }),

  // Facebook (opcional)
  body('facebook')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^(https?:\/\/)?(www\.)?facebook\.com\/[\w.]+\/?$/)
    .withMessage('Facebook debe ser una URL válida de Facebook'),

  // LinkedIn (opcional)
  body('linkedin')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[\w-]+\/?$/)
    .withMessage('LinkedIn debe ser una URL válida de LinkedIn'),

  // Logo (opcional)
  body('logo')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|svg)$/i)
    .withMessage('El logo debe ser una URL válida de imagen'),

  // Images (opcional - array)
  body('images')
    .optional()
    .isArray()
    .withMessage('Las imágenes deben ser un array de URLs'),

  body('images.*')
    .optional()
    .matches(/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i)
    .withMessage('Cada imagen debe ser una URL válida'),

  // isActive (opcional - solo admin puede cambiarlo desde aquí, pero validamos el tipo)
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive debe ser un booleano (true/false)'),

  // isVerified (opcional - solo admin)
  body('isVerified')
    .optional()
    .isBoolean()
    .withMessage('isVerified debe ser un booleano (true/false)'),

  // isFeatured (opcional - solo admin)
  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured debe ser un booleano (true/false)'),
];

/**
 * Middleware para manejar errores de validación
 * Retorna los errores en formato estándar si hay alguno
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Formatear errores para respuesta más amigable
    const formattedErrors = errors.array().map((error) => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value,
    }));

    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: formattedErrors,
    });
  }

  next();
};

/**
 * Export de tipos de servicio para uso en otros módulos
 */
export { VALID_SERVICE_TYPES };
