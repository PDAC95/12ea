/**
 * Admin Routes - Entre Amigas
 * Rutas administrativas generales
 * Sprint 5 - Task 5.3.1
 */

import express from 'express';
import {
  getStats,
  getUserStats,
  getEventStats,
  getBlogStats,
  getPendingEvents,
  approveEvent,
  rejectEvent,
} from '../controllers/admin.controller.js';
import { protect, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * Todas las rutas requieren autenticación + rol admin
 * Aplicar middleware de protección a todas las rutas
 */
router.use(protect);
router.use(requireAdmin);

/**
 * @route   GET /api/v1/admin/stats
 * @desc    Obtener estadísticas generales del dashboard
 * @access  Private/Admin
 */
router.get('/stats', getStats);

/**
 * @route   GET /api/v1/admin/stats/users
 * @desc    Obtener estadísticas detalladas de usuarios
 * @access  Private/Admin
 */
router.get('/stats/users', getUserStats);

/**
 * @route   GET /api/v1/admin/stats/events
 * @desc    Obtener estadísticas detalladas de eventos
 * @access  Private/Admin
 */
router.get('/stats/events', getEventStats);

/**
 * @route   GET /api/v1/admin/stats/blog
 * @desc    Obtener estadísticas detalladas del blog
 * @access  Private/Admin
 */
router.get('/stats/blog', getBlogStats);

// =====================================
// EVENT APPROVAL ROUTES (Sprint 5 - Task 5.10.3)
// =====================================

/**
 * @route   GET /api/v1/admin/events/pending
 * @desc    Obtener lista de eventos pendientes de aprobación
 * @access  Private/Admin
 */
router.get('/events/pending', getPendingEvents);

/**
 * @route   PATCH /api/v1/admin/events/:id/approve
 * @desc    Aprobar evento propuesto por usuario
 * @access  Private/Admin
 */
router.patch('/events/:id/approve', approveEvent);

/**
 * @route   PATCH /api/v1/admin/events/:id/reject
 * @desc    Rechazar evento propuesto por usuario
 * @access  Private/Admin
 * Body: { reason: string } (requerido)
 */
router.patch('/events/:id/reject', rejectEvent);

export default router;
