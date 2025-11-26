import User from '../models/User.js';
import Business from '../models/Business.js';
import Service from '../models/Service.js';
import EventRegistration from '../models/EventRegistration.js';
import { uploadToS3 } from '../services/upload.service.js';
import { S3_FOLDERS } from '../config/aws.js';

/**
 * User Controller - Entre Amigas
 * Controlador para gestión de perfil de usuario
 */

/**
 * @desc    Obtener perfil del usuario autenticado
 * @route   GET /api/v1/users/profile
 * @access  Private
 */
export const getProfile = async (req, res) => {
  try {
    // Buscar usuario por ID del token (req.user.id)
    const user = await User.findById(req.user.id).select(
      '-password -verificationToken -resetPasswordToken -verificationTokenExpires -resetPasswordExpires'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND',
      });
    }

    // Verificar que el usuario esté activo
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Cuenta desactivada',
        code: 'ACCOUNT_DEACTIVATED',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('❌ Error en getProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el perfil',
      code: 'GET_PROFILE_ERROR',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Actualizar perfil del usuario autenticado
 * @route   PUT /api/v1/users/profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    // Campos permitidos para actualización
    const allowedFields = ['preferredName', 'phone', 'city', 'bio'];

    // Verificar si se intenta cambiar el email (no permitido aquí)
    if (req.body.email) {
      return res.status(400).json({
        success: false,
        message: 'El email no puede ser modificado desde este endpoint',
        code: 'EMAIL_UPDATE_NOT_ALLOWED',
      });
    }

    // Filtrar solo campos permitidos
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Manejar upload de imagen de perfil (si existe)
    if (req.file) {
      try {
        // Subir imagen a S3 en carpeta users/{userId}
        const uploadResult = await uploadToS3(req.file, S3_FOLDERS.USERS, req.user.id);
        updates.profileImage = uploadResult.url;
        console.log('✅ Imagen de perfil subida:', uploadResult.url);
      } catch (uploadError) {
        console.error('❌ Error al subir imagen de perfil:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Error al subir la imagen de perfil',
          code: 'PROFILE_IMAGE_UPLOAD_ERROR',
          error: process.env.NODE_ENV === 'development' ? uploadError.message : undefined,
        });
      }
    }

    // Verificar que haya al menos un campo para actualizar
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionaron campos válidos para actualizar',
        code: 'NO_VALID_FIELDS',
        allowedFields: [...allowedFields, 'profileImage (file)'],
      });
    }

    // Actualizar usuario
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
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

    console.log(`✅ Perfil actualizado exitosamente para usuario: ${req.user.id}`);

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'Perfil actualizado exitosamente',
    });
  } catch (error) {
    console.error('❌ Error en updateProfile:', error);

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

    res.status(500).json({
      success: false,
      message: 'Error al actualizar el perfil',
      code: 'UPDATE_PROFILE_ERROR',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Obtener todos los negocios del usuario autenticado
 * @route   GET /api/v1/users/my-businesses
 * @access  Private
 */
export const getMyBusinesses = async (req, res) => {
  try {
    // Buscar todos los negocios del usuario (owner)
    // Incluir todos los status (pending, approved, rejected)
    const businesses = await Business.find({ owner: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: businesses.length,
      data: businesses,
    });
  } catch (error) {
    console.error('❌ Error en getMyBusinesses:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los negocios',
      code: 'GET_BUSINESSES_ERROR',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Obtener todos los servicios del usuario autenticado
 * @route   GET /api/v1/users/my-services
 * @access  Private
 */
export const getMyServices = async (req, res) => {
  try {
    // Buscar todos los servicios del usuario (owner)
    // Incluir todos los status (pending, approved, rejected)
    const services = await Service.find({ owner: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error('❌ Error en getMyServices:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los servicios',
      code: 'GET_SERVICES_ERROR',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Obtener eventos próximos del usuario autenticado (registrados)
 * @route   GET /api/v1/users/my-events
 * @access  Private
 */
export const getMyEvents = async (req, res) => {
  try {
    // Buscar registros confirmados del usuario
    const registrations = await EventRegistration.find({
      user: req.user.id,
      status: 'confirmed',
    })
      .populate({
        path: 'event',
        select: 'title description date time mode location link image status isFeatured maxAttendees',
        match: {
          isActive: true,
          date: { $gte: new Date() }, // Solo eventos futuros
        },
      })
      .sort({ 'event.date': 1 }); // Ordenar por fecha del evento (próximos primero)

    // Filtrar registros donde el evento no fue eliminado (populate retorna null si no match)
    const validRegistrations = registrations.filter((reg) => reg.event !== null);

    res.status(200).json({
      success: true,
      count: validRegistrations.length,
      data: validRegistrations,
    });
  } catch (error) {
    console.error('❌ Error en getMyEvents:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los eventos',
      code: 'GET_EVENTS_ERROR',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

export default {
  getProfile,
  updateProfile,
  getMyBusinesses,
  getMyServices,
  getMyEvents,
};
