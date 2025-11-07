/**
 * Error Handler Middleware
 * Maneja todos los errores de la aplicación y devuelve respuestas consistentes
 */

const errorHandler = (err, req, res, next) => {
  // Log del error en consola (en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error capturado:', err);
  }

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors,
    });
  }

  // Error de cast de Mongoose (ID inválido)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID inválido',
    });
  }

  // Error de clave duplicada (MongoDB)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      message: `${field} ya existe en el sistema`,
    });
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido',
    });
  }

  // Error de JWT expirado
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado',
    });
  }

  // Error de validación de express-validator
  if (err.array && typeof err.array === 'function') {
    const errors = err.array().map(e => e.msg);
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors,
    });
  }

  // Error genérico
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
