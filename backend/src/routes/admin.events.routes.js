import express from 'express';
import {
  getAllEventsAdmin,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventRegistrations,
  exportEventRegistrationsCSV,
} from '../controllers/event.controller.js';
import { protect, requireAdmin } from '../middleware/auth.middleware.js';

/**
 * Admin Event Routes - Entre Amigas
 * Rutas protegidas para administración de eventos
 * Todas requieren autenticación + role admin
 */

const router = express.Router();

// Aplicar middlewares de autenticación y autorización a todas las rutas
router.use(protect); // Verificar autenticación
router.use(requireAdmin); // Verificar role = 'admin'

/**
 * @route   GET /api/admin/events
 * @desc    Listar todos los eventos (incluye cancelled)
 * @access  Private/Admin
 * @query   status=upcoming|past|cancelled|all
 *          page=1
 *          limit=20
 *          search=keyword
 */
router.get('/', getAllEventsAdmin);

/**
 * @route   POST /api/admin/events
 * @desc    Crear nuevo evento
 * @access  Private/Admin
 * @body    title, description, date, time, mode, location, link, capacity, category, image
 */
router.post('/', createEvent);

/**
 * @route   PUT /api/admin/events/:id
 * @desc    Actualizar evento existente
 * @access  Private/Admin
 * @body    Campos a actualizar
 */
router.put('/:id', updateEvent);

/**
 * @route   DELETE /api/admin/events/:id
 * @desc    Cancelar evento (soft delete)
 * @access  Private/Admin
 * @note    Marca isActive=false y status='cancelled'
 */
router.delete('/:id', deleteEvent);

/**
 * @route   GET /api/admin/events/:id/registrations
 * @desc    Ver lista de registradas a un evento específico
 * @access  Private/Admin
 * @returns Lista con: userId, name, email, registeredAt
 */
router.get('/:id/registrations', getEventRegistrations);

/**
 * @route   GET /api/admin/events/:id/export-csv
 * @desc    Exportar lista de asistentes en formato CSV
 * @access  Private/Admin
 * @returns Archivo CSV con: Nombre, Email, Teléfono, Estado, Fecha de Registro
 */
router.get('/:id/export-csv', exportEventRegistrationsCSV);

export default router;
