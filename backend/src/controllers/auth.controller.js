import User from '../models/User.js';
import { generateAuthToken } from '../services/token.service.js';
import { hashToken } from '../services/token.service.js';
import {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
} from '../services/email.service.js';

/**
 * Auth Controller - Entre Amigas
 * Controlador para autenticación y gestión de usuarios
 */

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario y enviar email de verificación
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const { fullName, preferredName, email, password, confirmPassword, phone, birthday, city } = req.body;

    // 1. Verificar que el email no exista
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'El email ya está registrado',
        field: 'email',
      });
    }

    // 2. Crear usuario
    // El password se hashea automáticamente por el hook pre-save
    // El verificationToken se genera automáticamente por el hook pre-save
    const user = await User.create({
      fullName,
      preferredName,
      email: email.toLowerCase(),
      password,
      phone,
      birthday,
      city,
    });

    // 3. Obtener el verificationToken generado automáticamente
    // Necesitamos consultar el usuario con select para obtener el token
    const userWithToken = await User.findById(user._id).select('+verificationToken');

    // 4. Enviar email de verificación
    try {
      await sendVerificationEmail(user.email, user.preferredName, userWithToken.verificationToken);
    } catch (emailError) {
      console.error('❌ Error al enviar email de verificación:', emailError);
      // No fallar el registro si el email falla, pero loggear el error
    }

    // 5. Enviar email de bienvenida (opcional)
    try {
      await sendWelcomeEmail(user.email, user.preferredName);
    } catch (emailError) {
      console.error('❌ Error al enviar email de bienvenida:', emailError);
    }

    // 6. Retornar respuesta exitosa
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente. Por favor verifica tu email.',
      data: {
        user: user.getPublicProfile(),
      },
    });
  } catch (error) {
    console.error('❌ Error en register:', error);

    // Manejo de errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors,
      });
    }

    // Manejo de error de email duplicado
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'El email ya está registrado',
        field: 'email',
      });
    }

    // Error genérico del servidor
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión y obtener token JWT
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar usuario por email (incluir password)
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
    }

    // 2. Verificar que la cuenta esté activa
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'La cuenta ha sido desactivada. Contacta al administrador.',
      });
    }

    // 3. Comparar contraseñas
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
    }

    // 4. Advertencia si la cuenta no está verificada (pero permitir login)
    const isVerified = user.isVerified;

    // 5. Actualizar lastLogin
    user.lastLogin = new Date();
    await user.save();

    // 6. Generar token JWT
    const token = generateAuthToken(user._id, {
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    });

    // 7. Retornar respuesta exitosa
    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      data: {
        token,
        user: user.getPublicProfile(),
      },
      warning: !isVerified ? 'Tu cuenta no está verificada. Revisa tu email.' : undefined,
    });
  } catch (error) {
    console.error('❌ Error en login:', error);

    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   GET /api/auth/verify-email/:token
 * @desc    Verificar email del usuario
 * @access  Public
 */
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // 1. Buscar usuario con el token de verificación
    const user = await User.findOne({
      verificationToken: token,
    }).select('+verificationToken +verificationTokenExpires');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token de verificación inválido o expirado',
      });
    }

    // 2. Verificar si ya está verificado
    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: 'Tu cuenta ya está verificada',
        data: {
          user: user.getPublicProfile(),
        },
      });
    }

    // 3. Verificar si el token ha expirado
    if (user.isVerificationTokenExpired()) {
      return res.status(400).json({
        success: false,
        message: 'El token de verificación ha expirado. Solicita uno nuevo.',
      });
    }

    // 4. Marcar usuario como verificado
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // 5. Generar token JWT automáticamente
    const authToken = generateAuthToken(user._id, {
      email: user.email,
      role: user.role,
      isVerified: true,
    });

    // 6. Retornar respuesta exitosa
    res.status(200).json({
      success: true,
      message: '¡Email verificado exitosamente! Tu cuenta está activa.',
      data: {
        token: authToken,
        user: user.getPublicProfile(),
      },
    });
  } catch (error) {
    console.error('❌ Error en verifyEmail:', error);

    res.status(500).json({
      success: false,
      message: 'Error al verificar email',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Solicitar reset de contraseña (envía email con token)
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Buscar usuario por email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Por seguridad, no revelar si el email existe o no
      return res.status(200).json({
        success: true,
        message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña',
      });
    }

    // 2. Verificar que la cuenta esté activa
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'La cuenta ha sido desactivada. Contacta al administrador.',
      });
    }

    // 3. Generar token de reset
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // 4. Enviar email con el token
    try {
      await sendPasswordResetEmail(user.email, user.preferredName, resetToken);
    } catch (emailError) {
      console.error('❌ Error al enviar email de reset:', emailError);

      // Si falla el email, eliminar el token generado
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return res.status(500).json({
        success: false,
        message: 'Error al enviar email. Intenta de nuevo más tarde.',
      });
    }

    // 5. Retornar respuesta exitosa
    res.status(200).json({
      success: true,
      message: 'Instrucciones enviadas a tu email para restablecer tu contraseña',
    });
  } catch (error) {
    console.error('❌ Error en forgotPassword:', error);

    res.status(500).json({
      success: false,
      message: 'Error al procesar solicitud de reset de contraseña',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Restablecer contraseña con token
 * @access  Public
 */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    // 1. Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Las contraseñas no coinciden',
      });
    }

    // 2. Hashear el token recibido para comparar con la DB
    const hashedToken = hashToken(token);

    // 3. Buscar usuario con el token hasheado y que no haya expirado
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado',
      });
    }

    // 4. Actualizar contraseña (se hashea automáticamente por el hook)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // 5. Enviar email de confirmación
    try {
      await sendPasswordChangedEmail(user.email, user.preferredName);
    } catch (emailError) {
      console.error('❌ Error al enviar email de confirmación:', emailError);
    }

    // 6. Generar nuevo token JWT
    const authToken = generateAuthToken(user._id, {
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    });

    // 7. Retornar respuesta exitosa
    res.status(200).json({
      success: true,
      message: 'Contraseña restablecida exitosamente',
      data: {
        token: authToken,
        user: user.getPublicProfile(),
      },
    });
  } catch (error) {
    console.error('❌ Error en resetPassword:', error);

    // Manejo de errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al restablecer contraseña',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Obtener información del usuario autenticado actual
 * @access  Private (requiere token JWT)
 */
export const getMe = async (req, res) => {
  try {
    // El usuario viene de req.user (seteado por el middleware protect)
    const userId = req.user.id;

    // Buscar usuario por ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    // Verificar que la cuenta esté activa
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'La cuenta ha sido desactivada',
      });
    }

    // Retornar perfil público del usuario
    res.status(200).json({
      success: true,
      data: {
        user: user.getPublicProfile(),
      },
    });
  } catch (error) {
    console.error('❌ Error en getMe:', error);

    res.status(500).json({
      success: false,
      message: 'Error al obtener información del usuario',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Export todas las funciones
export default {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
};
