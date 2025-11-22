import express from 'express';
import {
  getAll,
  getAllAdmin,
  getById,
  create,
  update,
  remove,
  getPendingBusinesses,
  approveBusiness,
  rejectBusiness,
} from '../controllers/business.controller.js';
import { protect, requireAdmin } from '../middleware/auth.middleware.js';
import {
  createBusinessValidation,
  updateBusinessValidation,
  handleValidationErrors,
} from '../validators/business.validator.js';

/**
 * Admin Business Routes - Entre Amigas
 * Rutas protegidas para administración de negocios
 * Todas requieren autenticación + role admin
 */

const router = express.Router();

// Aplicar middlewares de autenticación y autorización a todas las rutas
router.use(protect); // Verificar autenticación
router.use(requireAdmin); // Verificar role = 'admin'

/**
 * @route   GET /api/v1/admin/businesses/pending
 * @desc    Obtener negocios pendientes de aprobación
 * @access  Private/Admin
 * @query   page, limit
 * Sistema de Propuesta de Negocios - PLAN-BUSINESS-PROPOSAL-SYSTEM
 */
router.get('/pending', getPendingBusinesses);

/**
 * @route   GET /api/v1/admin/businesses
 * @desc    Listar TODOS los negocios (incluye inactivos y no verificados)
 * @access  Private/Admin
 * @query   search, category, city, page, limit
 */
router.get('/', getAllAdmin);

/**
 * @route   GET /api/v1/admin/businesses/:id
 * @desc    Obtener negocio por ID
 * @access  Private/Admin
 */
router.get('/:id', getById);

/**
 * @route   POST /api/v1/admin/businesses
 * @desc    Crear nuevo negocio
 * @access  Private/Admin
 * @body    name, category, description, city, phone, email, whatsapp, address, website, instagram, facebook
 */
router.post('/', createBusinessValidation, handleValidationErrors, create);

/**
 * @route   PUT /api/v1/admin/businesses/:id
 * @desc    Actualizar negocio existente
 * @access  Private/Admin
 * @body    Campos a actualizar
 */
router.put('/:id', updateBusinessValidation, handleValidationErrors, update);

/**
 * @route   DELETE /api/v1/admin/businesses/:id
 * @desc    Eliminar negocio
 * @access  Private/Admin
 */
router.delete('/:id', remove);

/**
 * @route   PATCH /api/v1/admin/businesses/:id/approve
 * @desc    Aprobar negocio pendiente
 * @access  Private/Admin
 * Sistema de Propuesta de Negocios - PLAN-BUSINESS-PROPOSAL-SYSTEM
 */
router.patch('/:id/approve', approveBusiness);

/**
 * @route   PATCH /api/v1/admin/businesses/:id/reject
 * @desc    Rechazar negocio pendiente
 * @access  Private/Admin
 * @body    { reason: String }
 * Sistema de Propuesta de Negocios - PLAN-BUSINESS-PROPOSAL-SYSTEM
 */
router.patch('/:id/reject', rejectBusiness);

export default router;
