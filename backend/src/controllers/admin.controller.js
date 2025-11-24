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

/**
 * @desc    Obtener negocios pendientes de aprobación
 * @route   GET /api/v1/admin/business/pending
 * @access  Private/Admin
 * Sistema de Propuesta de Negocios - PLAN-BUSINESS-PROPOSAL-SYSTEM
 */
export const getPendingBusinesses = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const pendingBusinesses = await Business.find({ status: 'pending' })
      .populate('submittedBy', 'preferredName fullName email profileImage')
      .populate('owner', 'preferredName email')
      .sort({ createdAt: -1 }) // Más recientes primero
      .skip(skip)
      .limit(limitNum);

    const total = await Business.countDocuments({ status: 'pending' });
    const totalPages = Math.ceil(total / limitNum);

    console.log(`📋 Admin consultó ${pendingBusinesses.length} negocios pendientes (página ${pageNum}/${totalPages})`);

    res.status(200).json({
      success: true,
      data: {
        businesses: pendingBusinesses,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1,
        },
      },
    });
  } catch (error) {
    console.error('❌ Error al obtener negocios pendientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener negocios pendientes',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Aprobar negocio propuesto por usuario
 * @route   PATCH /api/v1/admin/business/:id/approve
 * @access  Private/Admin
 * Sistema de Propuesta de Negocios - PLAN-BUSINESS-PROPOSAL-SYSTEM
 */
export const approveBusiness = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar negocio
    const business = await Business.findById(id).populate('submittedBy', 'preferredName fullName email');

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Negocio no encontrado',
      });
    }

    // Verificar que el negocio esté pendiente
    if (business.status !== 'pending') {
      return res.status(409).json({
        success: false,
        message: `El negocio no está pendiente de aprobación. Status actual: ${business.status}`,
      });
    }

    // Aprobar usando método del modelo
    await business.approve(req.user.id);

    // Enviar email de aprobación al usuario
    try {
      const { sendBusinessApprovalEmail } = await import('../services/email.service.js');
      await sendBusinessApprovalEmail(
        business.submittedBy.email,
        business.submittedBy.preferredName || business.submittedBy.fullName,
        {
          name: business.name,
          category: business.category,
          city: business.city,
          _id: business._id,
        }
      );
      console.log(`📧 Email de aprobación enviado a ${business.submittedBy.email}`);
    } catch (emailError) {
      console.error('⚠️ Error al enviar email de aprobación:', emailError);
      // No fallar la aprobación si el email falla
    }

    console.log(`✅ Admin [${req.user.email}] aprobó negocio: "${business.name}" (ID: ${business._id})`);

    res.status(200).json({
      success: true,
      message: 'Negocio aprobado exitosamente',
      data: business,
    });
  } catch (error) {
    console.error('❌ Error al aprobar negocio:', error);
    res.status(500).json({
      success: false,
      message: 'Error al aprobar negocio',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Rechazar negocio propuesto por usuario
 * @route   PATCH /api/v1/admin/business/:id/reject
 * @access  Private/Admin
 * Sistema de Propuesta de Negocios - PLAN-BUSINESS-PROPOSAL-SYSTEM
 */
export const rejectBusiness = async (req, res) => {
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

    if (reason.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'El motivo del rechazo debe tener al menos 10 caracteres',
      });
    }

    // Buscar negocio
    const business = await Business.findById(id).populate('submittedBy', 'preferredName fullName email');

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Negocio no encontrado',
      });
    }

    // Verificar que el negocio esté pendiente
    if (business.status !== 'pending') {
      return res.status(409).json({
        success: false,
        message: `El negocio no está pendiente de aprobación. Status actual: ${business.status}`,
      });
    }

    // Rechazar usando método del modelo
    await business.reject(req.user.id, reason.trim());

    // Enviar email de rechazo al usuario
    try {
      const { sendBusinessRejectionEmail } = await import('../services/email.service.js');
      await sendBusinessRejectionEmail(
        business.submittedBy.email,
        business.submittedBy.preferredName || business.submittedBy.fullName,
        {
          name: business.name,
          category: business.category,
          city: business.city,
        },
        reason.trim()
      );
      console.log(`📧 Email de rechazo enviado a ${business.submittedBy.email}`);
    } catch (emailError) {
      console.error('⚠️ Error al enviar email de rechazo:', emailError);
      // No fallar el rechazo si el email falla
    }

    console.log(`❌ Admin [${req.user.email}] rechazó negocio: "${business.name}" - Razón: ${reason.trim()}`);

    res.status(200).json({
      success: true,
      message: 'Negocio rechazado exitosamente',
      data: {
        business,
        reason: reason.trim(),
      },
    });
  } catch (error) {
    console.error('❌ Error al rechazar negocio:', error);
    res.status(500).json({
      success: false,
      message: 'Error al rechazar negocio',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Aprobar servicio pendiente
 * @route   PUT /api/v1/admin/services/:id/approve
 * @access  Private/Admin
 * Sistema de Propuesta de Servicios - Sprint 5+
 */
export const approveService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado',
      });
    }

    if (service.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Solo se pueden aprobar servicios pendientes',
      });
    }

    service.status = 'approved';
    service.approvedBy = req.user.id;
    service.approvedAt = new Date();
    await service.save();

    await service.populate('submittedBy', 'preferredName email');
    await service.populate('approvedBy', 'preferredName email');

    console.log(`✅ Admin [${req.user.email}] aprobó servicio: "${service.name}" (ID: ${service._id})`);

    res.json({
      success: true,
      message: 'Servicio aprobado exitosamente',
      data: service,
    });
  } catch (error) {
    console.error('Error al aprobar servicio:', error);
    res.status(500).json({
      success: false,
      message: 'Error al aprobar servicio',
    });
  }
};

/**
 * @desc    Rechazar servicio pendiente
 * @route   PUT /api/v1/admin/services/:id/reject
 * @access  Private/Admin
 * Sistema de Propuesta de Servicios - Sprint 5+
 */
export const rejectService = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'La razón del rechazo debe tener al menos 10 caracteres',
      });
    }

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado',
      });
    }

    if (service.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Solo se pueden rechazar servicios pendientes',
      });
    }

    service.status = 'rejected';
    service.rejectedBy = req.user.id;
    service.rejectedAt = new Date();
    service.rejectionReason = reason.trim();
    await service.save();

    await service.populate('submittedBy', 'preferredName email');
    await service.populate('rejectedBy', 'preferredName email');

    console.log(`❌ Admin [${req.user.email}] rechazó servicio: "${service.name}" - Razón: ${reason.trim()}`);

    res.json({
      success: true,
      message: 'Servicio rechazado',
      data: service,
    });
  } catch (error) {
    console.error('Error al rechazar servicio:', error);
    res.status(500).json({
      success: false,
      message: 'Error al rechazar servicio',
    });
  }
};

/**
 * @desc    Obtener servicios pendientes de aprobación
 * @route   GET /api/v1/admin/services/pending
 * @access  Private/Admin
 * Sistema de Propuesta de Servicios - Sprint 5+
 */
export const getPendingServices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [services, total] = await Promise.all([
      Service.find({ status: 'pending' })
        .populate('submittedBy', 'preferredName fullName email profileImage')
        .populate('owner', 'preferredName fullName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Service.countDocuments({ status: 'pending' }),
    ]);

    console.log(`📋 Admin consultó ${services.length} servicios pendientes (página ${page}/${Math.ceil(total / limit)})`);

    res.json({
      success: true,
      data: {
        services,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit,
        },
      },
    });
  } catch (error) {
    console.error('Error al obtener servicios pendientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener servicios pendientes',
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
  getPendingBusinesses,
  approveBusiness,
  rejectBusiness,
  approveService,
  rejectService,
  getPendingServices,
};
