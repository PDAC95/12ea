import express from 'express';
import {
  getAllEvents,
  getEventById,
  registerToEvent,
  cancelRegistration,
  getMyRegistrations,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventRegistrations,
} from '../controllers/event.controller.js';
import { protect, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// =====================================
// PUBLIC ROUTES
// =====================================

/**
 * GET /api/v1/events
 * Lista pública de eventos con filtros
 * Query params:
 *   - mode: virtual|presencial|híbrido
 *   - futureOnly: true|false (default: true)
 *   - page: número de página (default: 1)
 *   - limit: resultados por página (default: 20, max: 50)
 *   - search: keyword para buscar en título/descripción
 *   - featured: true para eventos destacados
 */
router.get('/', getAllEvents);

// =====================================
// PROTECTED ROUTES (Authenticated Users)
// =====================================

/**
 * GET /api/v1/events/my-registrations
 * Obtener eventos en los que el usuario está registrado
 * Query params:
 *   - status: confirmed|cancelled (default: confirmed)
 *   - upcoming: true|false (default: true)
 * IMPORTANTE: Esta ruta debe ir ANTES de '/:id' para evitar conflictos
 */
router.get('/my-registrations', protect, getMyRegistrations);

/**
 * GET /api/v1/events/:id
 * Detalle público de un evento
 * - Incrementa el contador de vistas
 * - Si el usuario está autenticado, incluye su estado de registro
 */
router.get('/:id', getEventById);

/**
 * POST /api/v1/events/:id/register
 * Registrarse a un evento
 * Body (opcional):
 *   - notes: string (notas adicionales)
 * Validaciones automáticas:
 *   - Evento debe estar publicado y activo
 *   - No debe estar lleno
 *   - No debe haber pasado la fecha
 *   - Usuario no debe estar registrado previamente
 */
router.post('/:id/register', protect, registerToEvent);

/**
 * DELETE /api/v1/events/:id/register
 * Cancelar registro a un evento
 * Body (opcional):
 *   - reason: string (motivo de cancelación)
 */
router.delete('/:id/register', protect, cancelRegistration);

// =====================================
// ADMIN ROUTES (Sprint 3 - Task 9)
// =====================================

/**
 * POST /api/v1/events
 * Crear nuevo evento (Admin only)
 * Body:
 *   - title: string (required)
 *   - description: string (required)
 *   - date: date (required)
 *   - time: string HH:MM (required)
 *   - mode: virtual|presencial|híbrido (required)
 *   - location: string (required for presencial/híbrido)
 *   - link: string URL (required for virtual/híbrido)
 *   - capacity: number (required)
 *   - image: string URL (optional)
 *   - isFeatured: boolean (optional)
 */
router.post('/', protect, requireAdmin, createEvent);

/**
 * PUT /api/v1/events/:id
 * Actualizar evento existente (Admin only)
 */
router.put('/:id', protect, requireAdmin, updateEvent);

/**
 * DELETE /api/v1/events/:id
 * Eliminar evento (Admin only)
 * Nota: También elimina todos los registros asociados
 */
router.delete('/:id', protect, requireAdmin, deleteEvent);

/**
 * GET /api/v1/events/:id/registrations
 * Obtener lista de registros de un evento (Admin only)
 * Query params:
 *   - status: confirmed|cancelled (opcional, muestra todos si no se especifica)
 */
router.get('/:id/registrations', protect, requireAdmin, getEventRegistrations);

export default router;
