import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/admin.user.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

/**
 * Admin User Routes - Entre Amigas
 * Rutas para gestión de usuarios desde el panel de administración
 * TODAS las rutas requieren autenticación (protect) y rol de admin (authorize('admin'))
 */

const router = express.Router();

// ============================================
// MIDDLEWARE GLOBAL PARA TODAS LAS RUTAS ADMIN
// ============================================
// Aplicar protect y authorize('admin') a TODAS las rutas de este router
router.use(protect);
router.use(authorize('admin'));

// ============================================
// RUTAS DE GESTIÓN DE USUARIOS (ADMIN)
// ============================================

/**
 * @route   GET /api/v1/admin/users
 * @desc    Obtener todos los usuarios con paginación y búsqueda
 * @access  Private/Admin
 * @query   {
 *   page?: number (default: 1),
 *   limit?: number (default: 20, max: 100),
 *   search?: string (busca en fullName, preferredName, email),
 *   role?: 'user' | 'admin',
 *   isActive?: 'true' | 'false',
 *   isVerified?: 'true' | 'false',
 *   sortBy?: string (default: 'createdAt'),
 *   sortOrder?: 'asc' | 'desc' (default: 'desc')
 * }
 * @example
 * GET /api/v1/admin/users?page=1&limit=20&search=maria&role=user&isActive=true
 */
router.get('/', getAllUsers);

/**
 * @route   GET /api/v1/admin/users/:id
 * @desc    Obtener usuario específico por ID
 * @access  Private/Admin
 * @example
 * GET /api/v1/admin/users/691f8f73a406673e689da04b
 */
router.get('/:id', getUserById);

/**
 * @route   PUT /api/v1/admin/users/:id
 * @desc    Actualizar usuario (datos, rol, estado)
 * @access  Private/Admin
 * @body    {
 *   fullName?: string,
 *   preferredName?: string,
 *   phone?: string,
 *   city?: string,
 *   bio?: string,
 *   role?: 'user' | 'admin',
 *   isActive?: boolean,
 *   isVerified?: boolean,
 *   profileImage?: string
 * }
 * @note    No se puede cambiar email ni password desde aquí
 * @note    El admin NO puede cambiar su propio rol ni desactivarse
 * @example
 * PUT /api/v1/admin/users/691f8f73a406673e689da04b
 * Body: { "role": "admin", "isVerified": true }
 */
router.put('/:id', updateUser);

/**
 * @route   DELETE /api/v1/admin/users/:id
 * @desc    Eliminar usuario (soft delete o hard delete)
 * @access  Private/Admin
 * @query   {
 *   hard?: 'true' | 'false' (default: false)
 * }
 * @note    Por defecto hace soft delete (isActive: false)
 * @note    Con ?hard=true hace eliminación permanente
 * @note    El admin NO puede eliminarse a sí mismo
 * @example
 * DELETE /api/v1/admin/users/691f8f73a406673e689da04b (soft delete)
 * DELETE /api/v1/admin/users/691f8f73a406673e689da04b?hard=true (hard delete)
 */
router.delete('/:id', deleteUser);

export default router;
