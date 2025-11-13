import * as Yup from 'yup';

/**
 * serviceSchema - Schema de validación Yup para ServiceForm
 *
 * Validaciones basadas en el modelo Service del backend:
 * - backend/src/models/Service.js
 *
 * Campos Requeridos:
 * - name: 2-100 caracteres
 * - serviceType: Enum de 9 tipos de servicio
 * - description: 20-1000 caracteres
 * - city: Requerido
 *
 * Campos Opcionales con validación:
 * - credentials: Máx 500 caracteres
 * - phone: 10-20 caracteres con formato
 * - email: Formato de email válido
 * - whatsapp: 10-20 caracteres con formato
 * - website: URL válida
 * - instagram: Handle de Instagram (máx 100 chars)
 * - facebook: URL de Facebook
 * - linkedin: URL de LinkedIn
 * - address: Texto libre (máx 200 chars)
 *
 * Sprint 3 - US-009: Panel Admin
 * Task 9.6 - Frontend ServiceForm
 */

/**
 * Tipos de servicio disponibles (debe coincidir con backend enum)
 */
export const SERVICE_TYPES = [
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
 * Regex patterns (basados en backend/src/models/Service.js)
 */
const PHONE_REGEX = /^[\d\s\-\+\()]{10,20}$/;
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const URL_REGEX = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
const FACEBOOK_URL_REGEX = /^(https?:\/\/)?(www\.)?facebook\.com\/.+$/;
const LINKEDIN_URL_REGEX = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/.+$/;

/**
 * Schema principal de validación
 */
export const serviceSchema = Yup.object().shape({
  /**
   * Nombre del servicio
   * Requerido, 2-100 caracteres
   */
  name: Yup.string()
    .trim()
    .required('El nombre del servicio es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),

  /**
   * Tipo de servicio
   * Requerido, debe ser uno de los tipos del enum
   */
  serviceType: Yup.string()
    .required('El tipo de servicio es requerido')
    .oneOf(SERVICE_TYPES, 'Tipo de servicio no válido'),

  /**
   * Descripción del servicio
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
   * Credenciales y Certificaciones
   * Opcional, máx 500 caracteres
   */
  credentials: Yup.string()
    .nullable()
    .transform((value, originalValue) => (originalValue?.trim() === '' ? null : value))
    .max(500, 'Las credenciales no pueden exceder 500 caracteres'),

  /**
   * Teléfono
   * Opcional, pero si se proporciona debe cumplir formato
   */
  phone: Yup.string()
    .nullable()
    .transform((value, originalValue) => (originalValue?.trim() === '' ? null : value))
    .matches(PHONE_REGEX, 'Formato de teléfono inválido (10-20 dígitos, puede incluir espacios, guiones, paréntesis)')
    .max(20, 'El teléfono no puede exceder 20 caracteres'),

  /**
   * Email
   * Opcional, pero si se proporciona debe ser email válido
   */
  email: Yup.string()
    .nullable()
    .transform((value, originalValue) => (originalValue?.trim() === '' ? null : value))
    .matches(EMAIL_REGEX, 'Formato de email inválido')
    .email('Debe ser un email válido')
    .max(100, 'El email no puede exceder 100 caracteres'),

  /**
   * WhatsApp
   * Opcional, mismo formato que teléfono
   */
  whatsapp: Yup.string()
    .nullable()
    .transform((value, originalValue) => (originalValue?.trim() === '' ? null : value))
    .matches(PHONE_REGEX, 'Formato de WhatsApp inválido (10-20 dígitos, puede incluir espacios, guiones, paréntesis)')
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
    .matches(URL_REGEX, 'Formato de URL inválido (ej: https://ejemplo.com)')
    .max(200, 'La URL no puede exceder 200 caracteres'),

  /**
   * Instagram handle
   * Opcional, máx 100 caracteres
   */
  instagram: Yup.string()
    .nullable()
    .transform((value, originalValue) => (originalValue?.trim() === '' ? null : value))
    .max(100, 'El handle de Instagram no puede exceder 100 caracteres'),

  /**
   * Facebook URL
   * Opcional, debe cumplir formato de URL de Facebook
   */
  facebook: Yup.string()
    .nullable()
    .transform((value, originalValue) => (originalValue?.trim() === '' ? null : value))
    .matches(
      FACEBOOK_URL_REGEX,
      'URL de Facebook inválida (ej: https://facebook.com/usuario)'
    )
    .max(200, 'La URL de Facebook no puede exceder 200 caracteres'),

  /**
   * LinkedIn URL
   * Opcional, debe cumplir formato de URL de LinkedIn
   */
  linkedin: Yup.string()
    .nullable()
    .transform((value, originalValue) => (originalValue?.trim() === '' ? null : value))
    .matches(
      LINKEDIN_URL_REGEX,
      'URL de LinkedIn inválida (ej: https://linkedin.com/in/usuario o https://linkedin.com/company/empresa)'
    )
    .max(200, 'La URL de LinkedIn no puede exceder 200 caracteres'),
});

/**
 * Valores iniciales por defecto para modo create
 */
export const defaultServiceValues = {
  name: '',
  serviceType: '',
  description: '',
  city: '',
  credentials: '',
  phone: '',
  email: '',
  whatsapp: '',
  address: '',
  website: '',
  instagram: '',
  facebook: '',
  linkedin: '',
};

/**
 * Helper para transformar data del backend a formato form
 * @param {Object} service - Service object del backend
 * @returns {Object} - Form values
 */
export const serviceToFormValues = (service) => {
  if (!service) return defaultServiceValues;

  return {
    name: service.name || '',
    serviceType: service.serviceType || '',
    description: service.description || '',
    city: service.city || '',
    credentials: service.credentials || '',
    phone: service.phone || '',
    email: service.email || '',
    whatsapp: service.whatsapp || '',
    address: service.address || '',
    website: service.website || '',
    instagram: service.instagram || '',
    facebook: service.facebook || '',
    linkedin: service.linkedin || '',
  };
};

/**
 * Helper para transformar form values a formato backend
 * @param {Object} formValues - Valores del formulario
 * @returns {Object} - Data para enviar al backend
 */
export const formValuesToServiceData = (formValues) => {
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
