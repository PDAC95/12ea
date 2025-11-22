import { body, validationResult } from 'express-validator';

/**
 * Business Validators - Entre Amigas
 * Validaciones para creación y actualización de negocios usando express-validator
 */

/**
 * Categorías válidas de negocios
 * IMPORTANTE: Debe coincidir con frontend/src/shared/constants/categories.js
 */
const VALID_CATEGORIES = [
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
];

/**
 * Validación para crear negocio
 * Campos requeridos: name, category, description, city
 * Campos opcionales: phone, email, whatsapp, address, website, instagram, facebook, logo, images
 */
export const createBusinessValidation = [
  // Name (requerido)
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre del negocio es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),

  // Category (requerido)
  body('category')
    .trim()
    .notEmpty()
    .withMessage('La categoría es requerida')
    .isIn(VALID_CATEGORIES)
    .withMessage(`La categoría debe ser una de: ${VALID_CATEGORIES.join(', ')}`),

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
    .matches(/^(https?:\/\/)?(www\.)?[\w\-]+(\.[\w\-]+)+.*$/)
    .withMessage('El sitio web debe tener un formato válido. Ejemplos: ejemplo.com, www.ejemplo.com, https://ejemplo.com'),

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
    .custom((value) => {
      if (!value) return true;
      const usernameRegex = /^[a-zA-Z0-9.]{5,50}$/;
      const urlRegex = /^(https?:\/\/)?(www\.)?facebook\.com\/[\w.]+\/?$/;

      if (!usernameRegex.test(value) && !urlRegex.test(value)) {
        throw new Error('Facebook debe ser un nombre de usuario válido (5-50 caracteres) o URL de Facebook');
      }
      return true;
    }),

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
 * Validación para actualizar negocio
 * Todos los campos son opcionales en una actualización
 */
export const updateBusinessValidation = [
  // Name (opcional)
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre del negocio no puede estar vacío')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),

  // Category (opcional)
  body('category')
    .optional()
    .trim()
    .isIn(VALID_CATEGORIES)
    .withMessage(`La categoría debe ser una de: ${VALID_CATEGORIES.join(', ')}`),

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
    .matches(/^(https?:\/\/)?(www\.)?[\w\-]+(\.[\w\-]+)+.*$/)
    .withMessage('El sitio web debe tener un formato válido. Ejemplos: ejemplo.com, www.ejemplo.com, https://ejemplo.com'),

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
    .custom((value) => {
      if (!value) return true;
      const usernameRegex = /^[a-zA-Z0-9.]{5,50}$/;
      const urlRegex = /^(https?:\/\/)?(www\.)?facebook\.com\/[\w.]+\/?$/;

      if (!usernameRegex.test(value) && !urlRegex.test(value)) {
        throw new Error('Facebook debe ser un nombre de usuario válido (5-50 caracteres) o URL de Facebook');
      }
      return true;
    }),

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
    // 🔍 DEBUGGING: Log de errores de validación express-validator
    console.error('\n⚠️ === VALIDATION ERRORS (express-validator) ===');
    console.error('📦 Request Body:', JSON.stringify(req.body, null, 2));
    console.error('❌ Errores encontrados:', errors.array().length);

    // Formatear errores para respuesta más amigable
    const formattedErrors = errors.array().map((error) => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value,
      location: error.location,
    }));

    console.error('📛 Detalle de errores:', JSON.stringify(formattedErrors, null, 2));
    console.error('=== END VALIDATION ERRORS ===\n');

    return res.status(400).json({
      success: false,
      message: 'Error de validación (express-validator)',
      errors: formattedErrors,
    });
  }

  // 🔍 DEBUGGING: Log de validación exitosa
  console.log('✅ Validación de express-validator pasó correctamente');

  next();
};

/**
 * Export de categorías para uso en otros módulos
 */
export { VALID_CATEGORIES };
