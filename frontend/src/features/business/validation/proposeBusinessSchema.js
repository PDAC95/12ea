import * as yup from 'yup';
import { BUSINESS_CATEGORIES } from '../../../shared/constants/categories';

/**
 * proposeBusinessSchema - Schema de validación Yup para propuesta de negocio
 *
 * Valida todos los campos del formulario de propuesta de negocio
 * incluyendo campos opcionales con validación condicional
 *
 * Sprint 5+ - Business Proposal System
 * PLAN-BUSINESS-PROPOSAL-SYSTEM.md - PARTE 1
 *
 * @type {yup.ObjectSchema}
 */
export const proposeBusinessSchema = yup.object().shape({
  // Campos requeridos
  name: yup
    .string()
    .required('El nombre del negocio es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),

  // NOTA: owner se eliminó - el backend asigna automáticamente req.user.id como owner

  category: yup
    .string()
    .required('La categoría es requerida')
    .oneOf(BUSINESS_CATEGORIES, 'Categoría inválida'),

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

  instagram: yup
    .string()
    .matches(/^@?[a-zA-Z0-9._]{1,30}$/, 'El usuario de Instagram no es válido (ej: @usuario)')
    .nullable()
    .transform((value) => (value === '' ? null : value)),

  // Logo (file) - validación manual en el componente
  // Ya que Yup no maneja bien FileList
});

export default proposeBusinessSchema;