import express from 'express';
import {
  approveService,
  rejectService,
  getPendingServices,
} from '../controllers/admin.controller.js';
import { protect, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Aplicar middleware de autenticación y admin a todas las rutas
router.use(protect);
router.use(requireAdmin);

/**
 * Admin Service Management Routes
 * Base path: /api/v1/admin/services
 * Sistema de Propuesta de Servicios - Sprint 5+
 */

/**
 * @route   GET /api/v1/admin/services/pending
 * @desc    Obtener servicios pendientes de aprobación
 * @access  Private/Admin
 */
router.get('/pending', getPendingServices);

/**
 * @route   PATCH /api/v1/admin/services/:id/approve
 * @desc    Aprobar servicio pendiente
 * @access  Private/Admin
 */
router.patch('/:id/approve', approveService);

/**
 * @route   PATCH /api/v1/admin/services/:id/reject
 * @desc    Rechazar servicio pendiente
 * @access  Private/Admin
 * @body    { reason: string (min 10 caracteres) }
 */
router.patch('/:id/reject', rejectService);

export default router;
