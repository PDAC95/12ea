import * as yup from 'yup';

/**
 * SERVICE_TYPES - Tipos de servicios disponibles para propuesta
 *
 * Basado en las categorías de servicios del backend
 * Sprint 5+ - Service Proposal System
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
 * proposeServiceSchema - Schema de validación Yup para propuesta de servicio
 *
 * Valida todos los campos del formulario de propuesta de servicio
 * incluyendo campos opcionales con validación condicional
 *
 * Sprint 5+ - Service Proposal System
 * Patrón basado en PLAN-BUSINESS-PROPOSAL-SYSTEM.md
 *
 * @type {yup.ObjectSchema}
 */
export const proposeServiceSchema = yup.object().shape({
  // Campos requeridos
  name: yup
    .string()
    .required('El nombre del servicio es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),

  // NOTA: owner se eliminó - el backend asigna automáticamente req.user.id como owner

  serviceType: yup
    .string()
    .required('El tipo de servicio es requerido')
    .oneOf(SERVICE_TYPES, 'Tipo de servicio inválido'),

  description: yup
    .string()
    .required('La descripción es requerida')
    .min(50, 'La descripción debe tener al menos 50 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .trim(),

  phone: yup
    .string()
    .required('El teléfono es requerido')
    .matches(
      /^[\d\s\-\(\)\+]+$/,
      'El teléfono debe contener solo números, espacios, guiones, paréntesis o +'
    )
    .min(10, 'El teléfono debe tener al menos 10 caracteres')
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .trim(),

  city: yup.string().required('La ciudad es requerida').trim(),

  // Campos opcionales con validación
  email: yup
    .string()
    .email('El email debe ser válido')
    .nullable()
    .transform((value) => (value === '' ? null : value)),

  website: yup
    .string()
    .url('El sitio web debe ser una URL válida (ej: https://ejemplo.com)')
    .nullable()
    .transform((value) => (value === '' ? null : value)),

  address: yup.string().nullable().transform((value) => (value === '' ? null : value)),

  whatsapp: yup
    .string()
    .matches(
      /^[\d\s\-\(\)\+]+$/,
      'El WhatsApp debe contener solo números, espacios, guiones, paréntesis o +'
    )
    .nullable()
    .transform((value) => (value === '' ? null : value)),

  instagram: yup
    .string()
    .matches(/^@?[a-zA-Z0-9._]{1,30}$/, 'El usuario de Instagram no es válido (ej: @usuario)')
    .nullable()
    .transform((value) => (value === '' ? null : value)),

  facebook: yup
    .string()
    .url('El enlace de Facebook debe ser una URL válida')
    .nullable()
    .transform((value) => (value === '' ? null : value)),

  linkedin: yup
    .string()
    .url('El enlace de LinkedIn debe ser una URL válida')
    .nullable()
    .transform((value) => (value === '' ? null : value)),

  credentials: yup
    .string()
    .max(500, 'Las credenciales no pueden exceder 500 caracteres')
    .nullable()
    .transform((value) => (value === '' ? null : value)),
});

export default proposeServiceSchema;
