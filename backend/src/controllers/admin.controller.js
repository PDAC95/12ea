/**
 * Admin Controller - Entre Amigas
 * Controlador para funciones administrativas
 * Sprint 5 - Task 5.3.1
 */

import User from '../models/User.js';
import Business from '../models/Business.js';
import Service from '../models/Service.js';
import Event from '../models/Event.js';
import BlogPost from '../models/BlogPost.js';
import { sendEventApprovalEmail, sendEventRejectionEmail } from '../services/email.service.js';

/**
 * @desc    Obtener estadísticas generales del dashboard admin
 * @route   GET /api/v1/admin/stats
 * @access  Private/Admin
 */
export const getStats = async (req, res) => {
  try {
    // Ejecutar todas las queries en paralelo para mejor performance
    const [users, businesses, services, events, posts] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Business.countDocuments(),
      Service.countDocuments(),
      Event.countDocuments(),
      BlogPost.countDocuments(),
    ]);

    // Estadísticas adicionales útiles
    const [verifiedUsers, upcomingEvents, publishedPosts] = await Promise.all([
      User.countDocuments({ isVerified: true, isActive: true }),
      Event.countDocuments({ date: { $gte: new Date() } }),
      BlogPost.countDocuments({ isPublished: true }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        // Estadísticas principales
        users,
        businesses,
        services,
        events,
        posts,
        // Estadísticas adicionales
        verifiedUsers,
        upcomingEvents,
        publishedPosts,
        // Metadatos
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('❌ Error al obtener estadísticas de admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas del dashboard',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Obtener estadísticas detalladas de usuarios
 * @route   GET /api/v1/admin/stats/users
 * @access  Private/Admin
 */
export const getUserStats = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      verifiedUsers,
      unverifiedUsers,
      inactiveUsers,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isVerified: true }),
      User.countDocuments({ isVerified: false, isActive: true }),
      User.countDocuments({ isActive: false }),
    ]);

    // Usuarios registrados en los últimos 30 días
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalUsers,
        active: activeUsers,
        verified: verifiedUsers,
        unverified: unverifiedUsers,
        inactive: inactiveUsers,
        recentUsers,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('❌ Error al obtener estadísticas de usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de usuarios',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Obtener estadísticas detalladas de eventos
 * @route   GET /api/v1/admin/stats/events
 * @access  Private/Admin
 */
export const getEventStats = async (req, res) => {
  try {
    const now = new Date();

    const [totalEvents, upcomingEvents, pastEvents, virtualEvents, presencialEvents] =
      await Promise.all([
        Event.countDocuments(),
        Event.countDocuments({ date: { $gte: now } }),
        Event.countDocuments({ date: { $lt: now } }),
        Event.countDocuments({ mode: 'virtual' }),
        Event.countDocuments({ mode: 'presencial' }),
      ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalEvents,
        upcoming: upcomingEvents,
        past: pastEvents,
        virtual: virtualEvents,
        presencial: presencialEvents,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('❌ Error al obtener estadísticas de eventos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de eventos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Obtener estadísticas detalladas del blog
 * @route   GET /api/v1/admin/stats/blog
 * @access  Private/Admin
 */
export const getBlogStats = async (req, res) => {
  try {
    const [totalPosts, publishedPosts, draftPosts] = await Promise.all([
      BlogPost.countDocuments(),
      BlogPost.countDocuments({ isPublished: true }),
      BlogPost.countDocuments({ isPublished: false }),
    ]);

    // Estadísticas por categoría
    const categoriesStats = await BlogPost.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalPosts,
        published: publishedPosts,
        draft: draftPosts,
        byCategory: categoriesStats,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('❌ Error al obtener estadísticas del blog:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas del blog',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Obtener eventos pendientes de aprobación
 * @route   GET /api/v1/admin/events/pending
 * @access  Private/Admin
 * Sprint 5 - Task 5.10.3
 */
export const getPendingEvents = async (req, res) => {
  try {
    const pendingEvents = await Event.find({ status: 'pending' })
      .populate('organizer', 'preferredName fullName email profileImage')
      .sort({ createdAt: -1 }); // Más recientes primero

    console.log(`📋 Admin consultó ${pendingEvents.length} eventos pendientes`);

    res.status(200).json({
      success: true,
      count: pendingEvents.length,
      data: pendingEvents,
    });
  } catch (error) {
    console.error('❌ Error al obtener eventos pendientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos pendientes',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Aprobar evento propuesto por usuario
 * @route   PATCH /api/v1/admin/events/:id/approve
 * @access  Private/Admin
 * Sprint 5 - Task 5.10.3
 */
export const approveEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar evento
    const event = await Event.findById(id).populate('organizer', 'preferredName fullName email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado',
      });
    }

    // Verificar que el evento esté pendiente
    if (event.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `El evento no está pendiente de aprobación. Status actual: ${event.status}`,
      });
    }

    // Actualizar evento a publicado
    event.status = 'published';
    event.isActive = true;
    await event.save();

    // Enviar email de aprobación al usuario
    try {
      await sendEventApprovalEmail(
        event.organizer.email,
        event.organizer.preferredName || event.organizer.fullName,
        {
          title: event.title,
          date: event.date,
          time: event.time,
          mode: event.mode,
          location: event.location,
          link: event.link,
          _id: event._id,
        }
      );
      console.log(`📧 Email de aprobación enviado a ${event.organizer.email}`);
    } catch (emailError) {
      console.error('⚠️ Error al enviar email de aprobación:', emailError);
      // No fallar la aprobación si el email falla
    }

    console.log(`✅ Evento aprobado por admin:
      - ID: ${event._id}
      - Título: ${event.title}
      - Propuesto por: ${event.organizer.email}
      - Status: ${event.status}
      - Activo: ${event.isActive}
    `);

    res.status(200).json({
      success: true,
      message: 'Evento aprobado y publicado exitosamente',
      data: event,
    });
  } catch (error) {
    console.error('❌ Error al aprobar evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al aprobar evento',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Rechazar evento propuesto por usuario
 * @route   PATCH /api/v1/admin/events/:id/reject
 * @access  Private/Admin
 * Sprint 5 - Task 5.10.3
 */
export const rejectEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // Validar que se proporcione un motivo
    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El motivo del rechazo es requerido',
      });
    }

    // Buscar evento
    const event = await Event.findById(id).populate('organizer', 'preferredName fullName email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado',
      });
    }

    // Verificar que el evento esté pendiente
    if (event.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `El evento no está pendiente de aprobación. Status actual: ${event.status}`,
      });
    }

    // Actualizar evento a rechazado
    event.status = 'cancelled';
    event.isActive = false;
    event.cancelledAt = new Date();
    event.cancellationReason = reason.trim();
    await event.save();

    // Enviar email de rechazo al usuario
    try {
      await sendEventRejectionEmail(
        event.organizer.email,
        event.organizer.preferredName || event.organizer.fullName,
        {
          title: event.title,
          date: event.date,
          time: event.time,
          mode: event.mode,
        },
        reason.trim()
      );
      console.log(`📧 Email de rechazo enviado a ${event.organizer.email}`);
    } catch (emailError) {
      console.error('⚠️ Error al enviar email de rechazo:', emailError);
      // No fallar el rechazo si el email falla
    }

    console.log(`❌ Evento rechazado por admin:
      - ID: ${event._id}
      - Título: ${event.title}
      - Propuesto por: ${event.organizer.email}
      - Motivo: ${reason}
    `);

    res.status(200).json({
      success: true,
      message: 'Evento rechazado exitosamente',
      data: {
        event,
        reason: reason.trim(),
      },
    });
  } catch (error) {
    console.error('❌ Error al rechazar evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al rechazar evento',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

export default {
  getStats,
  getUserStats,
  getEventStats,
  getBlogStats,
  getPendingEvents,
  approveEvent,
  rejectEvent,
};
