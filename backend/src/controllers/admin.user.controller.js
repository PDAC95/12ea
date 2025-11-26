import User from '../models/User.js';

/**
 * Admin User Controller - Entre Amigas
 * Controlador para gestión de usuarios desde el panel de administración
 * TODAS las funciones requieren rol de admin
 */

/**
 * @desc    Obtener todos los usuarios con paginación y búsqueda
 * @route   GET /api/v1/admin/users
 * @access  Private/Admin
 * @query   {
 *   page: number (default: 1),
 *   limit: number (default: 20, max: 100),
 *   search: string (busca en fullName, preferredName, email),
 *   role: 'user' | 'admin' (filtrar por rol),
 *   isActive: 'true' | 'false' (filtrar por estado),
 *   isVerified: 'true' | 'false' (filtrar por verificación),
 *   sortBy: string (default: 'createdAt'),
 *   sortOrder: 'asc' | 'desc' (default: 'desc')
 * }
 */
export const getAllUsers = async (req, res) => {
  try {
    console.log('🔍 [DEBUG] getAllUsers - Inicio');
    console.log('📋 [DEBUG] Query params recibidos:', req.query);

    // Parámetros de paginación
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100); // Max 100
    const skip = (page - 1) * limit;

    console.log('📊 [DEBUG] Paginación:', { page, limit, skip });

    // Parámetros de búsqueda y filtros
    const { search, role, isActive, isVerified, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Construir query de filtros
    const query = {};

    // Búsqueda por texto (nombre o email)
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { preferredName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Filtro por rol
    if (role && ['user', 'admin'].includes(role)) {
      query.role = role;
    }

    // Filtro por estado activo
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Filtro por verificación
    if (isVerified !== undefined) {
      query.isVerified = isVerified === 'true';
    }

    console.log('🔎 [DEBUG] Query MongoDB construida:', JSON.stringify(query, null, 2));

    // Configurar sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    console.log('🔀 [DEBUG] Sort:', sort);

    // Ejecutar query con paginación
    console.log('⏳ [DEBUG] Ejecutando query a MongoDB...');
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password -verificationToken -resetPasswordToken -verificationTokenExpires -resetPasswordExpires')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(), // Usar lean() para mejor performance
      User.countDocuments(query),
    ]);

    console.log('✅ [DEBUG] Query ejecutada exitosamente');
    console.log('📈 [DEBUG] Total usuarios en DB (query):', total);
    console.log('📦 [DEBUG] Usuarios retornados (página actual):', users.length);
    console.log('👥 [DEBUG] IDs de usuarios retornados:', users.map(u => u._id));

    // Calcular páginas totales
    const totalPages = Math.ceil(total / limit);

    console.log('📄 [DEBUG] Páginas totales:', totalPages);

    const response = {
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    };

    console.log('🚀 [DEBUG] Enviando respuesta al frontend');
    console.log('📝 [DEBUG] Estructura de respuesta:', {
      success: response.success,
      usersCount: response.data.users.length,
      pagination: response.data.pagination,
    });

    res.status(200).json(response);
  } catch (error) {
    console.error('❌ [ERROR] Error en getAllUsers (admin):', error);
    console.error('📍 [ERROR] Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los usuarios',
      code: 'GET_USERS_ERROR',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Obtener usuario específico por ID
 * @route   GET /api/v1/admin/users/:id
 * @access  Private/Admin
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar usuario por ID (excluyendo campos sensibles)
    const user = await User.findById(id).select(
      '-password -verificationToken -resetPasswordToken -verificationTokenExpires -resetPasswordExpires'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('❌ Error en getUserById (admin):', error);

    // Manejar error de ID inválido (CastError de Mongoose)
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario inválido',
        code: 'INVALID_USER_ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al obtener el usuario',
      code: 'GET_USER_ERROR',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Actualizar usuario (solo admin)
 * @route   PUT /api/v1/admin/users/:id
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
 * @note    El admin NO puede cambiar el email ni el password desde aquí
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Campos permitidos para actualización por admin
    const allowedFields = [
      'fullName',
      'preferredName',
      'phone',
      'city',
      'bio',
      'role',
      'isActive',
      'isVerified',
      'profileImage',
    ];

    // Campos que NO se pueden cambiar desde aquí
    const forbiddenFields = ['email', 'password', 'authProvider', 'googleId'];

    // Verificar si se intenta cambiar campos prohibidos
    const attemptedForbiddenFields = forbiddenFields.filter((field) => req.body[field] !== undefined);
    if (attemptedForbiddenFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Los siguientes campos no pueden ser modificados: ${attemptedForbiddenFields.join(', ')}`,
        code: 'FORBIDDEN_FIELDS',
        forbiddenFields: attemptedForbiddenFields,
      });
    }

    // Filtrar solo campos permitidos
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Verificar que haya al menos un campo para actualizar
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionaron campos válidos para actualizar',
        code: 'NO_VALID_FIELDS',
        allowedFields,
      });
    }

    // Validar rol si se está actualizando
    if (updates.role && !['user', 'admin'].includes(updates.role)) {
      return res.status(400).json({
        success: false,
        message: 'Rol inválido. Debe ser "user" o "admin"',
        code: 'INVALID_ROLE',
      });
    }

    // Prevenir que el admin se desactive a sí mismo
    if (updates.isActive === false && id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'No puedes desactivar tu propia cuenta',
        code: 'CANNOT_DEACTIVATE_SELF',
      });
    }

    // Prevenir que el admin se quite su propio rol de admin
    if (updates.role === 'user' && id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'No puedes cambiar tu propio rol de administrador',
        code: 'CANNOT_CHANGE_OWN_ROLE',
      });
    }

    // Actualizar usuario
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true, // Retornar el documento actualizado
        runValidators: true, // Ejecutar validaciones de Mongoose
      }
    ).select(
      '-password -verificationToken -resetPasswordToken -verificationTokenExpires -resetPasswordExpires'
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND',
      });
    }

    console.log(`✅ Usuario ${id} actualizado por admin ${req.user.id}`);

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'Usuario actualizado exitosamente',
    });
  } catch (error) {
    console.error('❌ Error en updateUser (admin):', error);

    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        code: 'VALIDATION_ERROR',
        errors,
      });
    }

    // Manejar error de ID inválido
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario inválido',
        code: 'INVALID_USER_ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al actualizar el usuario',
      code: 'UPDATE_USER_ERROR',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Eliminar usuario (soft delete - marca como inactivo)
 * @route   DELETE /api/v1/admin/users/:id
 * @access  Private/Admin
 * @query   {
 *   hard: 'true' | 'false' (default: false) - Si true, elimina permanentemente
 * }
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { hard } = req.query;

    // Verificar que el usuario existe
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND',
      });
    }

    // Prevenir que el admin se elimine a sí mismo
    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'No puedes eliminar tu propia cuenta',
        code: 'CANNOT_DELETE_SELF',
      });
    }

    // Hard delete (permanente) o soft delete (marcar como inactivo)
    if (hard === 'true') {
      // HARD DELETE - Eliminar permanentemente de la base de datos
      await User.findByIdAndDelete(id);

      console.log(`🗑️  Usuario ${id} eliminado PERMANENTEMENTE por admin ${req.user.id}`);

      return res.status(200).json({
        success: true,
        message: 'Usuario eliminado permanentemente',
        data: {
          deletedUserId: id,
          deletionType: 'hard',
        },
      });
    } else {
      // SOFT DELETE - Marcar como inactivo (recomendado)
      const deactivatedUser = await User.findByIdAndUpdate(
        id,
        { $set: { isActive: false } },
        { new: true }
      ).select(
        '-password -verificationToken -resetPasswordToken -verificationTokenExpires -resetPasswordExpires'
      );

      console.log(`⚠️  Usuario ${id} desactivado (soft delete) por admin ${req.user.id}`);

      return res.status(200).json({
        success: true,
        message: 'Usuario desactivado exitosamente',
        data: {
          user: deactivatedUser,
          deletionType: 'soft',
        },
      });
    }
  } catch (error) {
    console.error('❌ Error en deleteUser (admin):', error);

    // Manejar error de ID inválido
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario inválido',
        code: 'INVALID_USER_ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al eliminar el usuario',
      code: 'DELETE_USER_ERROR',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

export default {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
