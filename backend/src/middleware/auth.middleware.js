import { verifyToken } from '../services/token.service.js';
// import User from '../models/User.js'; // Descomentar cuando el modelo User esté creado

/**
 * Authentication Middleware - Entre Amigas
 * Middlewares para proteger rutas y verificar autenticación de usuarios
 */

/**
 * Middleware de autenticación (protect)
 * Verifica que el usuario esté autenticado mediante JWT token
 *
 * @middleware
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 *
 * @example
 * // En las rutas
 * router.get('/profile', protect, getUserProfile);
 * router.put('/profile', protect, updateUserProfile);
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Extraer token del header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Formato: "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];
    }

    // Si no hay token, retornar error 401
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado. Token no proporcionado.',
        code: 'NO_TOKEN'
      });
    }

    try {
      // 2. Verificar token JWT
      const decoded = verifyToken(token);

      // Verificar que el token sea de tipo 'auth' (no refresh)
      if (decoded.type && decoded.type !== 'auth') {
        return res.status(401).json({
          success: false,
          message: 'Tipo de token inválido.',
          code: 'INVALID_TOKEN_TYPE'
        });
      }

      // 3. Buscar usuario en base de datos
      // NOTA: Descomentar cuando el modelo User esté creado (TASK-005)
      /*
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no encontrado. Token inválido.',
          code: 'USER_NOT_FOUND'
        });
      }

      // Verificar que el usuario esté activo
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Cuenta desactivada.',
          code: 'ACCOUNT_DEACTIVATED'
        });
      }

      // 4. Agregar usuario a la request
      req.user = user;
      */

      // VERSIÓN TEMPORAL (hasta que se cree el modelo User)
      // Por ahora, solo agregamos el payload del token a req.user
      req.user = {
        id: decoded.id,
        role: decoded.role || 'user',
        email: decoded.email,
        _fromToken: true, // Flag para identificar que viene del token
      };

      // Log en desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.log('🔐 Usuario autenticado:', req.user.id);
      }

      next();
    } catch (error) {
      // Manejar errores específicos de JWT
      if (error.message === 'Token expirado') {
        return res.status(401).json({
          success: false,
          message: 'Token expirado. Por favor inicia sesión nuevamente.',
          code: 'TOKEN_EXPIRED'
        });
      }

      if (error.message === 'Token inválido') {
        return res.status(401).json({
          success: false,
          message: 'Token inválido.',
          code: 'INVALID_TOKEN'
        });
      }

      // Error genérico de verificación
      return res.status(401).json({
        success: false,
        message: 'Error al verificar token.',
        code: 'TOKEN_VERIFICATION_ERROR'
      });
    }
  } catch (error) {
    console.error('❌ Error en middleware de autenticación:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor.',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
};

/**
 * Middleware de autorización por roles
 * Verifica que el usuario autenticado tenga uno de los roles permitidos
 *
 * @middleware
 * @param {...string} roles - Roles permitidos
 * @returns {Function} Middleware function
 *
 * @example
 * // Solo admin
 * router.delete('/users/:id', protect, authorize('admin'), deleteUser);
 *
 * // Admin o moderador
 * router.put('/posts/:id', protect, authorize('admin', 'moderator'), updatePost);
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    // Verificar que el usuario esté autenticado
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado. Use el middleware protect() antes de authorize().',
        code: 'NOT_AUTHENTICATED'
      });
    }

    // Verificar que el usuario tenga uno de los roles permitidos
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado. Se requiere uno de los siguientes roles: ${roles.join(', ')}`,
        code: 'INSUFFICIENT_PERMISSIONS',
        requiredRoles: roles,
        userRole: req.user.role
      });
    }

    // Usuario autorizado
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Usuario autorizado con rol: ${req.user.role}`);
    }

    next();
  };
};

/**
 * Middleware de autenticación opcional
 * Similar a protect, pero no falla si no hay token
 * Útil para rutas que tienen funcionalidad diferente si el usuario está autenticado
 *
 * @middleware
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 *
 * @example
 * // Ruta pública que muestra contenido adicional si estás autenticado
 * router.get('/posts', optionalAuth, getPosts);
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Extraer token del header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Si no hay token, continuar sin autenticación
    if (!token) {
      req.user = null;
      return next();
    }

    try {
      // Verificar token JWT
      const decoded = verifyToken(token);

      // Verificar tipo de token
      if (decoded.type && decoded.type !== 'auth') {
        req.user = null;
        return next();
      }

      // VERSIÓN TEMPORAL (hasta que se cree el modelo User)
      /*
      const user = await User.findById(decoded.id).select('-password');

      if (!user || !user.isActive) {
        req.user = null;
        return next();
      }

      req.user = user;
      */

      // Por ahora, usar payload del token
      req.user = {
        id: decoded.id,
        role: decoded.role || 'user',
        email: decoded.email,
        _fromToken: true,
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('🔓 Usuario opcional autenticado:', req.user.id);
      }

      next();
    } catch (error) {
      // Si hay error en el token, simplemente continuar sin usuario
      req.user = null;
      next();
    }
  } catch (error) {
    console.error('❌ Error en middleware de autenticación opcional:', error);
    req.user = null;
    next();
  }
};

/**
 * Middleware para verificar que el usuario esté verificado (email confirmado)
 * Debe usarse después del middleware protect
 *
 * @middleware
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 *
 * @example
 * router.post('/posts', protect, requireVerified, createPost);
 */
export const requireVerified = (req, res, next) => {
  // Verificar que el usuario esté autenticado
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'No autenticado. Use el middleware protect() antes de requireVerified().',
      code: 'NOT_AUTHENTICATED'
    });
  }

  // NOTA: Descomentar cuando el modelo User tenga el campo isVerified
  /*
  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Por favor verifica tu email antes de realizar esta acción.',
      code: 'EMAIL_NOT_VERIFIED'
    });
  }
  */

  // Por ahora, asumir que está verificado (versión temporal)
  if (process.env.NODE_ENV === 'development') {
    console.log('✉️  Usuario verificado (temporal):', req.user.id);
  }

  next();
};

/**
 * Middleware para verificar que el usuario sea el propietario del recurso
 * Compara req.user.id con req.params.userId (o el parámetro especificado)
 *
 * @middleware
 * @param {string} paramName - Nombre del parámetro en req.params (default: 'userId')
 * @returns {Function} Middleware function
 *
 * @example
 * // Verificar que el usuario solo pueda ver su propio perfil
 * router.get('/users/:userId/profile', protect, requireOwnership('userId'), getProfile);
 *
 * // Con parámetro personalizado
 * router.delete('/posts/:authorId/comment', protect, requireOwnership('authorId'), deleteComment);
 */
export const requireOwnership = (paramName = 'userId') => {
  return (req, res, next) => {
    // Verificar que el usuario esté autenticado
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado. Use el middleware protect() antes de requireOwnership().',
        code: 'NOT_AUTHENTICATED'
      });
    }

    // Obtener el ID del parámetro
    const resourceOwnerId = req.params[paramName];

    if (!resourceOwnerId) {
      return res.status(400).json({
        success: false,
        message: `Parámetro '${paramName}' no encontrado en la URL.`,
        code: 'MISSING_PARAM'
      });
    }

    // Verificar que el usuario sea el propietario O sea admin
    const isOwner = req.user.id === resourceOwnerId || req.user._id?.toString() === resourceOwnerId;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para acceder a este recurso.',
        code: 'NOT_RESOURCE_OWNER'
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`👤 Ownership verificado: ${isOwner ? 'Owner' : 'Admin'}`);
    }

    next();
  };
};

/**
 * Middleware específico para requerir rol de Admin
 * Wrapper de authorize('admin') para mayor claridad
 *
 * @middleware
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 *
 * @example
 * router.post('/events', protect, requireAdmin, createEvent);
 */
export const requireAdmin = (req, res, next) => {
  return authorize('admin')(req, res, next);
};

// Export default con todos los middlewares
export default {
  protect,
  authorize,
  requireAdmin,
  optionalAuth,
  requireVerified,
  requireOwnership,
};
