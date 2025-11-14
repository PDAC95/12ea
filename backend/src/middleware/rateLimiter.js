import rateLimit from 'express-rate-limit';

/**
 * Rate Limiter Middleware - Entre Amigas
 * Protección contra ataques de fuerza bruta en endpoints de autenticación
 */

/**
 * Rate limiter para login de ADMINISTRADORAS (más estricto)
 * Solo 5 intentos en 15 minutos
 */
export const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 intentos
  message: {
    success: false,
    message: 'Demasiados intentos de login. Por favor intenta en 15 minutos.',
    code: 'TOO_MANY_REQUESTS',
  },
  standardHeaders: true, // Retornar info de rate limit en headers `RateLimit-*`
  legacyHeaders: false, // Deshabilitar headers `X-RateLimit-*`
  skipSuccessfulRequests: false, // Contar también requests exitosos
  skipFailedRequests: false, // Contar también requests fallidos
});

/**
 * Rate limiter para login de USUARIAS REGULARES (más permisivo)
 * 10 intentos en 15 minutos
 */
export const userLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Máximo 10 intentos
  message: {
    success: false,
    message: 'Demasiados intentos de login. Por favor intenta en 15 minutos.',
    code: 'TOO_MANY_REQUESTS',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});

/**
 * Rate limiter para registro de nuevas usuarias
 * 3 registros por hora por IP
 */
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // Máximo 3 registros
  message: {
    success: false,
    message: 'Demasiados registros desde esta IP. Por favor intenta en 1 hora.',
    code: 'TOO_MANY_REQUESTS',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // No contar requests exitosos
  skipFailedRequests: false,
});

/**
 * Rate limiter para solicitudes de reset de password
 * 3 solicitudes por hora
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // Máximo 3 solicitudes
  message: {
    success: false,
    message: 'Demasiadas solicitudes de reset de contraseña. Por favor intenta en 1 hora.',
    code: 'TOO_MANY_REQUESTS',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});

/**
 * Rate limiter general para API
 * 100 requests por 15 minutos por IP
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requests
  message: {
    success: false,
    message: 'Demasiadas solicitudes desde esta IP. Por favor intenta más tarde.',
    code: 'TOO_MANY_REQUESTS',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default {
  adminLoginLimiter,
  userLoginLimiter,
  registerLimiter,
  passwordResetLimiter,
  apiLimiter,
};
