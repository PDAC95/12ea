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
  getMyServices,
  getServiceTypes,
  proposeService,
} from '../controllers/service.controller.js';
import {
  createServiceValidation,
  updateServiceValidation,
  handleValidationErrors,
} from '../validators/service.validator.js';
import { protect, optionalAuth } from '../middleware/auth.middleware.js';
import { uploadSingleImage, handleMulterError } from '../middleware/upload.middleware.js';

/**
 * Service Routes - Entre Amigas
 * Rutas para gestión de servicios profesionales de la comunidad
 */

const router = express.Router();

// =============================================
// RUTAS PÚBLICAS (no requieren autenticación)
// =============================================

/**
 * @route   GET /api/v1/services/service-types
 * @desc    Obtener lista de tipos de servicio disponibles con conteo
 * @access  Public
 */
router.get('/service-types', getServiceTypes);

/**
 * @route   GET /api/v1/services/featured
 * @desc    Obtener servicios destacados
 * @access  Public
 * @query   limit - Número de servicios a retornar (default: 6)
 */
router.get('/featured', getFeatured);

/**
 * @route   GET /api/v1/services/stats
 * @desc    Obtener estadísticas generales de servicios
 * @access  Public
 */
router.get('/stats', getStats);

/**
 * @route   GET /api/v1/services/my/list
 * @desc    Obtener servicios del usuario autenticado
 * @access  Private
 * @headers Authorization: Bearer {token}
 * @note    IMPORTANTE: Esta ruta debe estar ANTES de /:id para evitar conflictos
 */
router.get('/my/list', protect, getMyServices);

/**
 * @route   POST /api/v1/services/propose
 * @desc    Proponer servicio para revisión admin (usuario regular)
 * @access  Private
 * @headers Authorization: Bearer {token}
 * @body    { name, serviceType, description, phone?, email?, credentials?, city, address?, website?, instagram?, facebook?, linkedin?, logo? }
 * @note    IMPORTANTE: Esta ruta debe estar ANTES de /:id para evitar conflictos
 * Sistema de Propuesta de Servicios - Sprint 5+
 */
router.post(
  '/propose',
  protect,                      // 1. Verificar autenticación
  uploadSingleImage('logo'),    // 2. Procesar upload de logo (opcional)
  handleMulterError,            // 3. Manejar errores de multer
  createServiceValidation,      // 4. Validar datos de entrada
  handleValidationErrors,       // 5. Manejar errores de validación
  proposeService                // 6. Ejecutar controlador
);

/**
 * @route   GET /api/v1/services
 * @desc    Obtener lista de servicios con filtros y paginación
 * @access  Public
 * @query   search - Búsqueda de texto completo
 * @query   serviceType - Filtrar por tipo de servicio
 * @query   city - Filtrar por ciudad
 * @query   page - Número de página (default: 1)
 * @query   limit - Items por página (default: 20)
 * @query   featured - Solo destacados (true/false)
 * @query   verified - Solo verificados (true/false)
 * @query   sortBy - Campo para ordenar (default: createdAt)
 * @query   sortOrder - Orden: asc/desc (default: desc)
 *
 * @example
 * GET /api/v1/services?search=doctor&serviceType=Salud&city=Toronto&page=1&limit=20
 */
router.get('/', getAll);

/**
 * @route   GET /api/v1/services/:id
 * @desc    Obtener detalle de un servicio específico
 * @access  Public (pero servicios inactivos solo visibles para owner/admin)
 * @params  id - ID del servicio
 */
router.get('/:id', optionalAuth, getById);

/**
 * @route   POST /api/v1/services/:id/view
 * @desc    Incrementar contador de vistas (analytics)
 * @access  Public
 * @params  id - ID del servicio
 */
router.post('/:id/view', incrementView);

/**
 * @route   POST /api/v1/services/:id/contact-click
 * @desc    Incrementar contador de clics en contacto (analytics)
 * @access  Public
 * @params  id - ID del servicio
 */
router.post('/:id/contact-click', incrementContactClick);

// =============================================
// RUTAS PRIVADAS (requieren autenticación)
// =============================================

/**
 * @route   POST /api/v1/services
 * @desc    Crear nuevo servicio
 * @access  Private
 * @headers Authorization: Bearer {token}
 * @body    { name, serviceType, description, credentials?, phone?, email?, whatsapp?, city, address?, website?, instagram?, facebook?, linkedin?, logo?, images? }
 */
router.post(
  '/',
  protect,                     // 1. Verificar autenticación
  createServiceValidation,     // 2. Validar datos de entrada
  handleValidationErrors,      // 3. Manejar errores de validación
  create                       // 4. Ejecutar controlador
);

/**
 * @route   PUT /api/v1/services/:id
 * @desc    Actualizar servicio existente
 * @access  Private (requiere ser owner o admin)
 * @headers Authorization: Bearer {token}
 * @params  id - ID del servicio
 * @body    Campos a actualizar
 */
router.put(
  '/:id',
  protect,                     // 1. Verificar autenticación
  updateServiceValidation,     // 2. Validar datos opcionales
  handleValidationErrors,      // 3. Manejar errores de validación
  update                       // 4. Ejecutar controlador
);

/**
 * @route   DELETE /api/v1/services/:id
 * @desc    Eliminar servicio (soft delete)
 * @access  Private (requiere ser owner o admin)
 * @headers Authorization: Bearer {token}
 * @params  id - ID del servicio
 */
router.delete('/:id', protect, remove);

export default router;
