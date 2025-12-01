import { body } from 'express-validator';
import { TIP_CATEGORIES } from '../constants/tip.js';

/**
 * Tip Validators - Entre Amigas
 * Validaciones para endpoints de Tips
 */

/**
 * Validación para proponer un nuevo tip
 */
export const proposeTipValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('El título es requerido')
    .isLength({ min: 5, max: 150 })
    .withMessage('El título debe tener entre 5 y 150 caracteres'),

  body('content')
    .trim()
    .notEmpty()
    .withMessage('El contenido es requerido')
    .isLength({ min: 100 })
    .withMessage('El contenido debe tener al menos 100 caracteres')
    .isLength({ max: 2000 })
    .withMessage('El contenido no puede exceder 2000 caracteres'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('La categoría es requerida')
    .isIn(TIP_CATEGORIES)
    .withMessage('La categoría no es válida'),
];

/**
 * Validación para actualizar un tip
 */
export const updateTipValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 150 })
    .withMessage('El título debe tener entre 5 y 150 caracteres'),

  body('content')
    .optional()
    .trim()
    .isLength({ min: 100 })
    .withMessage('El contenido debe tener al menos 100 caracteres')
    .isLength({ max: 2000 })
    .withMessage('El contenido no puede exceder 2000 caracteres'),

  body('category')
    .optional()
    .trim()
    .isIn(TIP_CATEGORIES)
    .withMessage('La categoría no es válida'),
];

/**
 * Validación para rechazar un tip
 */
export const rejectTipValidator = [
  body('reason')
    .trim()
    .notEmpty()
    .withMessage('La razón del rechazo es requerida')
    .isLength({ min: 10 })
    .withMessage('La razón del rechazo debe tener al menos 10 caracteres'),
];
