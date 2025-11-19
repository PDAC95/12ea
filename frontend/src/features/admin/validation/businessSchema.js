import * as Yup from 'yup';

/**
 * businessSchema - Schema de validación Yup para BusinessForm
 *
 * Validaciones basadas en el modelo Business del backend:
 * - backend/src/models/Business.js
 *
 * Campos Requeridos:
 * - name: 2-100 caracteres
 * - category: Enum de 17 categorías
 * - description: 20-1000 caracteres
 * - city: Requerido
 *
 * Campos Opcionales con validación:
 * - phone: 10-20 caracteres con formato
 * - email: Formato de email válido
 * - whatsapp: 10-20 caracteres con formato
 * - website: URL válida
 * - instagram: Handle de Instagram
 * - facebook: Handle de Facebook
 * - address: Texto libre
 *
 * Sprint 3 - US-009: Panel Admin
 * Task 9.5 - Frontend BusinessForm
 */

/**
 * Categorías disponibles (debe coincidir con backend enum)
 */
export const BUSINESS_CATEGORIES = [
  'Gastronomía',
  'Belleza y Bienestar',
  'Salud',
  'Educación',
  'Servicios Profesionales',
  'Arte y Cultura',
  'Moda y Accesorios',
  'Hogar y Decoración',
  'Tecnología',
  'Fitness y Deportes',
  'Eventos y Entretenimiento',
  'Consultoría',
  'Turismo y Viajes',
  'Fotografía y Video',
  'Mascotas',
  'Artesanías',
  'Otros',
];

/**
 * Regex patterns (basados en backend/src/models/Business.js)
 * Sprint 5 - Task 5.4.1: URL regex actualizado para aceptar más formatos
 */
const PHONE_REGEX = /^[\d\s\-\+\()]{10,20}$/;
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const URL_REGEX = /^(https?:\/\/)?(www\.)?[\w\-]+(\.[\w\-]+)+.*$/;
const INSTAGRAM_REGEX = /^[a-zA-Z0-9._]{1,30}$/;
const FACEBOOK_REGEX = /^[a-zA-Z0-9.]{5,50}$/;

/**
 * Schema principal de validación
 */
export const businessSchema = Yup.object().shape({
  /**
   * Nombre del negocio
   * Requerido, 2-100 caracteres
   */
  name: Yup.string()
    .trim()
    .required('El nombre del negocio es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),

  /**
   * Categoría del negocio
   * Requerido, debe ser una de las categorías del enum
   */
  category: Yup.string()
    .required('La categoría es requerida')
    .oneOf(BUSINESS_CATEGORIES, 'Categoría no válida'),

  /**
   * Descripción del negocio
   * Requerido, 20-1000 caracteres
   */
  description: Yup.string()
    .trim()
    .required('La descripción es requerida')
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .max(1000, 'La descripción no puede exceder 1000 caracteres'),

  /**
   * Ciudad
   * Requerido
   */
  city: Yup.string()
    .trim()
    .required('La ciudad es requerida')
    .max(100, 'La ciudad no puede exceder 100 caracteres'),

  /**
   * Teléfono
   * Opcional, pero si se proporciona debe cumplir formato
   */
  phone: Yup.string()
    .nullable()
    .transform((value, originalValue) => (originalValue?.trim() === '' ? null : value))
    .matches(
      PHONE_REGEX,
      'Formato de teléfono inválido. Ejemplos válidos: +1 (416) 123-4567, 416-123-4567, 4161234567'
    )
    .max(20, 'El teléfono no puede exceder 20 caracteres'),

  /**
   * Email
   * Opcional, pero si se proporciona debe ser email válido
   */
  email: Yup.string()
    .nullable()
    .transform((value, originalValue) => (originalValue?.trim() === '' ? null : value))
    .matches(EMAIL_REGEX, 'Formato de email inválido. Ejemplo: contacto@ejemplo.com')
    .email('Debe ser un email válido con @ y dominio')
    .max(100, 'El email no puede exceder 100 caracteres'),

  /**
   * WhatsApp
   * Opcional, mismo formato que teléfono
   */
  whatsapp: Yup.string()
    .nullable()
    .transform((value, originalValue) => (originalValue?.trim() === '' ? null : value))
    .matches(
      PHONE_REGEX,
      'Formato de WhatsApp inválido. Ejemplos válidos: +1 (416) 123-4567, 416-123-4567, 4161234567'
    )
    .max(20, 'El WhatsApp no puede exceder 20 caracteres'),

  /**
   * Dirección
   * Opcional, texto libre
   */
  address: Yup.string()
    .nullable()
    .transform((value, originalValue) => (originalValue?.trim() === '' ? null : value))
    .max(200, 'La dirección no puede exceder 200 caracteres'),

  /**
   * Website
   * Opcional, debe ser URL válida
   */
  website: Yup.string()
    .nullable()
    .transform((value, originalValue) => (originalValue?.trim() === '' ? null : value))
    .matches(
      URL_REGEX,
      'Formato de URL inválido. Ejemplos válidos: https://ejemplo.com, http://www.ejemplo.com, ejemplo.com'
    )
    .max(200, 'La URL no puede exceder 200 caracteres'),

  /**
   * Instagram handle
   * Opcional, debe cumplir formato de Instagram
   */
  instagram: Yup.string()
    .nullable()
    .transform((value, originalValue) => (originalValue?.trim() === '' ? null : value))
    .matches(
      INSTAGRAM_REGEX,
      'Handle de Instagram inválido. Solo letras, números, puntos y guiones bajos. Ejemplos: mi_negocio, negocio.123'
    )
    .max(30, 'El handle de Instagram no puede exceder 30 caracteres'),

  /**
   * Facebook handle
   * Opcional, debe cumplir formato de Facebook
   */
  facebook: Yup.string()
    .nullable()
    .transform((value, originalValue) => (originalValue?.trim() === '' ? null : value))
    .matches(
      FACEBOOK_REGEX,
      'Handle de Facebook inválido. Solo letras, números y puntos (mín 5 caracteres). Ejemplos: mi.negocio, negocio123'
    )
    .min(5, 'El handle de Facebook debe tener al menos 5 caracteres')
    .max(50, 'El handle de Facebook no puede exceder 50 caracteres'),

  /**
   * Logo del negocio
   * Opcional, URL de la imagen en S3
   * Sprint 5 - Task: Logo Upload
   */
  logo: Yup.string()
    .nullable()
    .transform((value, originalValue) => (originalValue?.trim() === '' ? null : value))
    .url('La URL del logo debe ser válida')
    .max(500, 'La URL del logo no puede exceder 500 caracteres'),
});

/**
 * Valores iniciales por defecto para modo create
 */
export const defaultBusinessValues = {
  name: '',
  category: '',
  description: '',
  city: '',
  phone: '',
  email: '',
  whatsapp: '',
  address: '',
  website: '',
  instagram: '',
  facebook: '',
  logo: '',
};

/**
 * Helper para transformar data del backend a formato form
 * @param {Object} business - Business object del backend
 * @returns {Object} - Form values
 */
export const businessToFormValues = (business) => {
  if (!business) return defaultBusinessValues;

  return {
    name: business.name || '',
    category: business.category || '',
    description: business.description || '',
    city: business.city || '',
    phone: business.phone || '',
    email: business.email || '',
    whatsapp: business.whatsapp || '',
    address: business.address || '',
    website: business.website || '',
    instagram: business.instagram || '',
    facebook: business.facebook || '',
    logo: business.logo || '',
  };
};

/**
 * Helper para transformar form values a formato backend
 * @param {Object} formValues - Valores del formulario
 * @returns {Object} - Data para enviar al backend
 */
export const formValuesToBusinessData = (formValues) => {
  // Filtrar campos vacíos para enviar solo los que tienen valor
  const data = {};

  Object.keys(formValues).forEach((key) => {
    const value = formValues[key];
    if (value !== null && value !== undefined && value !== '') {
      data[key] = value;
    }
  });

  return data;
};
