import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';

// Cargar variables de entorno si no están cargadas
if (!process.env.JWT_SECRET) {
  dotenv.config();
}

/**
 * Token Service - Entre Amigas
 * Servicio para generar y verificar tokens JWT y tokens random para autenticación
 */

// Validar JWT_SECRET
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET no está definido en las variables de entorno');
}

// Configuración de JWT
const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRE || '7d',
};

/**
 * Generar token de autenticación JWT
 * @param {string} userId - ID del usuario (MongoDB ObjectId)
 * @param {Object} additionalPayload - Datos adicionales opcionales para incluir en el token
 * @returns {string} Token JWT firmado
 *
 * @example
 * const token = generateAuthToken('507f1f77bcf86cd799439011');
 * // token => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 */
export const generateAuthToken = (userId, additionalPayload = {}) => {
  if (!userId) {
    throw new Error('userId es requerido para generar un token de autenticación');
  }

  try {
    const payload = {
      id: userId,
      type: 'auth',
      ...additionalPayload,
    };

    const token = jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });

    return token;
  } catch (error) {
    console.error('❌ Error al generar token de autenticación:', error);
    throw new Error(`Error al generar token de autenticación: ${error.message}`);
  }
};

/**
 * Verificar token JWT
 * @param {string} token - Token JWT a verificar
 * @returns {Object} Payload decodificado del token
 * @throws {Error} Si el token es inválido o ha expirado
 *
 * @example
 * try {
 *   const decoded = verifyToken(token);
 *   console.log('Usuario ID:', decoded.id);
 * } catch (error) {
 *   console.error('Token inválido:', error.message);
 * }
 */
export const verifyToken = (token) => {
  if (!token) {
    throw new Error('Token es requerido para verificación');
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expirado');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Token inválido');
    }
    throw new Error(`Error al verificar token: ${error.message}`);
  }
};

/**
 * Generar token de verificación para email
 * Usa crypto para generar un token seguro y random de 32 bytes
 * @returns {string} Token hexadecimal de 64 caracteres
 *
 * @example
 * const verificationToken = generateVerificationToken();
 * // verificationToken => 'a1b2c3d4e5f6...' (64 caracteres hex)
 */
export const generateVerificationToken = () => {
  try {
    // Generar 32 bytes random y convertir a hexadecimal (64 caracteres)
    const token = crypto.randomBytes(32).toString('hex');
    return token;
  } catch (error) {
    console.error('❌ Error al generar token de verificación:', error);
    throw new Error(`Error al generar token de verificación: ${error.message}`);
  }
};

/**
 * Generar token para reset de contraseña
 * Usa crypto para generar un token seguro y random de 32 bytes
 * @returns {string} Token hexadecimal de 64 caracteres
 *
 * @example
 * const resetToken = generateResetToken();
 * // resetToken => 'x9y8z7w6v5u4...' (64 caracteres hex)
 */
export const generateResetToken = () => {
  try {
    // Generar 32 bytes random y convertir a hexadecimal (64 caracteres)
    const token = crypto.randomBytes(32).toString('hex');
    return token;
  } catch (error) {
    console.error('❌ Error al generar token de reset:', error);
    throw new Error(`Error al generar token de reset: ${error.message}`);
  }
};

/**
 * Hash de token para almacenamiento seguro en base de datos
 * Los tokens de verificación y reset deben ser hasheados antes de guardar en DB
 * @param {string} token - Token a hashear
 * @returns {string} Hash SHA256 del token
 *
 * @example
 * const token = generateResetToken();
 * const hashedToken = hashToken(token);
 * // Guardar hashedToken en DB
 * // Enviar token original al usuario por email
 */
export const hashToken = (token) => {
  if (!token) {
    throw new Error('Token es requerido para hashear');
  }

  try {
    return crypto.createHash('sha256').update(token).digest('hex');
  } catch (error) {
    console.error('❌ Error al hashear token:', error);
    throw new Error(`Error al hashear token: ${error.message}`);
  }
};

/**
 * Generar refresh token JWT (opcional - para refresh token rotation)
 * @param {string} userId - ID del usuario
 * @returns {string} Refresh token JWT con mayor duración
 *
 * @example
 * const refreshToken = generateRefreshToken('507f1f77bcf86cd799439011');
 * // refreshToken con expiración de 30 días
 */
export const generateRefreshToken = (userId) => {
  if (!userId) {
    throw new Error('userId es requerido para generar un refresh token');
  }

  try {
    const payload = {
      id: userId,
      type: 'refresh',
    };

    const token = jwt.sign(payload, jwtConfig.secret, {
      expiresIn: '30d', // Refresh token dura más tiempo
    });

    return token;
  } catch (error) {
    console.error('❌ Error al generar refresh token:', error);
    throw new Error(`Error al generar refresh token: ${error.message}`);
  }
};

/**
 * Decodificar token JWT sin verificar (útil para debugging)
 * ⚠️ ADVERTENCIA: No usar para autenticación, solo para inspección
 * @param {string} token - Token JWT
 * @returns {Object} Payload decodificado (sin verificar firma)
 */
export const decodeToken = (token) => {
  if (!token) {
    throw new Error('Token es requerido para decodificar');
  }

  try {
    return jwt.decode(token);
  } catch (error) {
    throw new Error(`Error al decodificar token: ${error.message}`);
  }
};

/**
 * Obtener tiempo de expiración de un token
 * @param {string} token - Token JWT
 * @returns {Object} Información de expiración
 *
 * @example
 * const expInfo = getTokenExpiration(token);
 * console.log('Expira en:', expInfo.expiresInSeconds, 'segundos');
 * console.log('Fecha de expiración:', expInfo.expiresAt);
 */
export const getTokenExpiration = (token) => {
  if (!token) {
    throw new Error('Token es requerido');
  }

  try {
    const decoded = jwt.decode(token);

    if (!decoded || !decoded.exp) {
      throw new Error('Token no tiene información de expiración');
    }

    const expiresAt = new Date(decoded.exp * 1000);
    const now = new Date();
    const expiresInSeconds = Math.floor((expiresAt - now) / 1000);

    return {
      expiresAt,
      expiresInSeconds,
      isExpired: expiresInSeconds <= 0,
    };
  } catch (error) {
    throw new Error(`Error al obtener expiración del token: ${error.message}`);
  }
};

// Log de configuración (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  console.log('🔐 Token Service configurado');
  console.log(`⏱️  JWT expira en: ${jwtConfig.expiresIn}`);
}

// Export default con todas las funciones
export default {
  generateAuthToken,
  verifyToken,
  generateVerificationToken,
  generateResetToken,
  hashToken,
  generateRefreshToken,
  decodeToken,
  getTokenExpiration,
};
