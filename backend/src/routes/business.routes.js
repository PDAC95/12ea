import express from 'express';
import {
  getAll,
  getById,
  create,
  update,
  remove,
  incrementView,
  incrementContactClick,
  getFeatured,
  getStats,
  getMyBusinesses,
  getCategories,
} from '../controllers/business.controller.js';
import {
  createBusinessValidation,
  updateBusinessValidation,
  handleValidationErrors,
} from '../validators/business.validator.js';
import { protect, optionalAuth } from '../middleware/auth.middleware.js';

/**
 * Business Routes - Entre Amigas
 * Rutas para gestión de negocios de la comunidad
 */

const router = express.Router();

// =============================================
// RUTAS PÚBLICAS (no requieren autenticación)
// =============================================

/**
 * @route   GET /api/v1/businesses/categories
 * @desc    Obtener lista de categorías disponibles con conteo
 * @access  Public
 */
router.get('/categories', getCategories);

/**
 * @route   GET /api/v1/businesses/featured
 * @desc    Obtener negocios destacados
 * @access  Public
 * @query   limit - Número de negocios a retornar (default: 6)
 */
router.get('/featured', getFeatured);

/**
 * @route   GET /api/v1/businesses/stats
 * @desc    Obtener estadísticas generales de negocios
 * @access  Public
 */
router.get('/stats', getStats);

/**
 * @route   GET /api/v1/businesses/my/list
 * @desc    Obtener negocios del usuario autenticado
 * @access  Private
 * @headers Authorization: Bearer {token}
 * @note    IMPORTANTE: Esta ruta debe estar ANTES de /:id para evitar conflictos
 */
router.get('/my/list', protect, getMyBusinesses);

/**
 * @route   GET /api/v1/businesses
 * @desc    Obtener lista de negocios con filtros y paginación
 * @access  Public
 * @query   search - Búsqueda de texto completo
 * @query   category - Filtrar por categoría
 * @query   city - Filtrar por ciudad
 * @query   page - Número de página (default: 1)
 * @query   limit - Items por página (default: 20)
 * @query   featured - Solo destacados (true/false)
 * @query   verified - Solo verificados (true/false)
 * @query   sortBy - Campo para ordenar (default: createdAt)
 * @query   sortOrder - Orden: asc/desc (default: desc)
 *
 * @example
 * GET /api/v1/businesses?search=cafe&category=Gastronomía&city=Toronto&page=1&limit=20
 */
router.get('/', getAll);

/**
 * @route   GET /api/v1/businesses/:id
 * @desc    Obtener detalle de un negocio específico
 * @access  Public (pero negocios inactivos solo visibles para owner/admin)
 * @params  id - ID del negocio
 */
router.get('/:id', optionalAuth, getById);

/**
 * @route   POST /api/v1/businesses/:id/view
 * @desc    Incrementar contador de vistas (analytics)
 * @access  Public
 * @params  id - ID del negocio
 */
router.post('/:id/view', incrementView);

/**
 * @route   POST /api/v1/businesses/:id/contact-click
 * @desc    Incrementar contador de clics en contacto (analytics)
 * @access  Public
 * @params  id - ID del negocio
 */
router.post('/:id/contact-click', incrementContactClick);

// =============================================
// RUTAS PRIVADAS (requieren autenticación)
// =============================================

/**
 * @route   POST /api/v1/businesses
 * @desc    Crear nuevo negocio
 * @access  Private
 * @headers Authorization: Bearer {token}
 * @body    { name, category, description, phone?, email?, whatsapp?, city, address?, website?, instagram?, facebook?, logo?, images? }
 */
router.post(
  '/',
  protect,                      // 1. Verificar autenticación
  createBusinessValidation,     // 2. Validar datos de entrada
  handleValidationErrors,       // 3. Manejar errores de validación
  create                        // 4. Ejecutar controlador
);

/**
 * @route   PUT /api/v1/businesses/:id
 * @desc    Actualizar negocio existente
 * @access  Private (requiere ser owner o admin)
 * @headers Authorization: Bearer {token}
 * @params  id - ID del negocio
 * @body    Campos a actualizar
 */
router.put(
  '/:id',
  protect,                      // 1. Verificar autenticación
  updateBusinessValidation,     // 2. Validar datos opcionales
  handleValidationErrors,       // 3. Manejar errores de validación
  update                        // 4. Ejecutar controlador
);

/**
 * @route   DELETE /api/v1/businesses/:id
 * @desc    Eliminar negocio (soft delete)
 * @access  Private (requiere ser owner o admin)
 * @headers Authorization: Bearer {token}
 * @params  id - ID del negocio
 */
router.delete('/:id', protect, remove);

export default router;
