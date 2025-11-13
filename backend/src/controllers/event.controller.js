import Event from '../models/Event.js';
import EventRegistration from '../models/EventRegistration.js';
import User from '../models/User.js';
import { sendEventConfirmationEmail } from '../services/email.service.js';

/**
 * Event Controller - Entre Amigas
 * Controlador para gestión de eventos comunitarios
 */

// =====================================
// PUBLIC ENDPOINTS
// =====================================

/**
 * @desc    Get all events (public list)
 * @route   GET /api/v1/events
 * @access  Public
 * @params  ?mode=virtual|presencial|híbrido
 *          ?futureOnly=true|false
 *          ?page=1
 *          ?limit=20
 *          ?search=keyword
 *          ?featured=true
 */
export const getAllEvents = async (req, res, next) => {
  try {
    const {
      mode,
      futureOnly = 'true',
      page = 1,
      limit = 20,
      search,
      featured,
    } = req.query;

    // Build query
    const query = {
      status: 'published',
      isActive: true,
    };

    // Filter by mode (virtual, presencial, híbrido)
    if (mode && ['virtual', 'presencial', 'híbrido'].includes(mode.toLowerCase())) {
      query.mode = mode.toLowerCase();
    }

    // Filter by future events only (default: true)
    if (futureOnly === 'true') {
      query.date = { $gte: new Date() };
    }

    // Filter by featured events
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Search in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = Math.min(parseInt(limit), 50); // Max 50 por página

    // Execute query
    const events = await Event.find(query)
      .populate('organizer', 'preferredName email profileImage')
      .select('-__v')
      .limit(limitNum)
      .skip(skip)
      .sort({ date: 1 }); // Ordenar por fecha ascendente (próximos primero)

    // Count total documents
    const total = await Event.countDocuments(query);

    // Response
    res.status(200).json({
      success: true,
      count: events.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
        hasNext: skip + events.length < total,
        hasPrev: parseInt(page) > 1,
      },
      filters: {
        mode: mode || 'all',
        futureOnly: futureOnly === 'true',
        featured: featured === 'true',
        search: search || null,
      },
      data: events.map((event) => ({
        _id: event._id,
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        mode: event.mode,
        location: event.location,
        link: event.link,
        capacity: event.capacity,
        registeredCount: event.registeredCount,
        availableSpots: event.availableSpots,
        image: event.image,
        status: event.status,
        isFeatured: event.isFeatured,
        isFull: event.isFull(),
        isPast: event.isPast(),
        organizer: event.organizer
          ? {
              _id: event.organizer._id,
              name: event.organizer.preferredName,
              email: event.organizer.email,
              profileImage: event.organizer.profileImage,
            }
          : null,
        views: event.views,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Error in getAllEvents:', error);
    next(error);
  }
};

/**
 * @desc    Get event by ID (public detail)
 * @route   GET /api/v1/events/:id
 * @access  Public
 */
export const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find event
    const event = await Event.findById(id)
      .populate('organizer', 'preferredName email profileImage bio')
      .select('-__v');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado',
      });
    }

    // Increment views count
    await event.incrementViews();

    // Check if user is registered (if authenticated)
    let isRegistered = false;
    let registrationStatus = null;

    if (req.user) {
      const registration = await EventRegistration.findExisting(req.user.id, event._id);
      if (registration) {
        isRegistered = true;
        registrationStatus = registration.status;
      }
    }

    // Response
    res.status(200).json({
      success: true,
      data: {
        _id: event._id,
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        dateTime: event.dateTime,
        mode: event.mode,
        location: event.location,
        link: event.link,
        capacity: event.capacity,
        registeredCount: event.registeredCount,
        availableSpots: event.availableSpots,
        occupancyRate: event.occupancyRate,
        image: event.image,
        status: event.status,
        isFeatured: event.isFeatured,
        isFull: event.isFull(),
        isPast: event.isPast(),
        canRegister: event.canRegister(),
        organizer: event.organizer
          ? {
              _id: event.organizer._id,
              name: event.organizer.preferredName,
              email: event.organizer.email,
              profileImage: event.organizer.profileImage,
              bio: event.organizer.bio,
            }
          : null,
        views: event.views,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        // User-specific data (if authenticated)
        userRegistration: req.user
          ? {
              isRegistered,
              status: registrationStatus,
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Error in getEventById:', error);
    next(error);
  }
};

// =====================================
// PROTECTED ENDPOINTS (Authenticated)
// =====================================

/**
 * @desc    Register to an event
 * @route   POST /api/v1/events/:id/register
 * @access  Private (authenticated users)
 */
export const registerToEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { notes } = req.body;

    // Find event
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado',
      });
    }

    // Check if can register
    const { canRegister, reason } = event.canRegister();

    if (!canRegister) {
      return res.status(400).json({
        success: false,
        message: `No puedes registrarte en este evento: ${reason}`,
      });
    }

    // Check if already registered
    const existingRegistration = await EventRegistration.findExisting(userId, id);

    if (existingRegistration) {
      if (existingRegistration.status === 'confirmed') {
        return res.status(400).json({
          success: false,
          message: 'Ya estás registrado en este evento',
        });
      } else if (existingRegistration.status === 'cancelled') {
        // Reactivate registration
        existingRegistration.status = 'confirmed';
        existingRegistration.cancelledAt = null;
        existingRegistration.cancellationReason = null;
        if (notes) existingRegistration.notes = notes;
        await existingRegistration.save();

        return res.status(200).json({
          success: true,
          message: 'Registro reactivado exitosamente',
          data: {
            registration: existingRegistration.getPublicProfile(),
            event: {
              _id: event._id,
              title: event.title,
              date: event.date,
              time: event.time,
              mode: event.mode,
            },
          },
        });
      }
    }

    // Create new registration
    const registration = await EventRegistration.create({
      user: userId,
      event: id,
      status: 'confirmed',
      notes: notes || null,
    });

    // Send confirmation email (Task 4.5)
    try {
      // Get user data
      const user = await User.findById(userId).select('preferredName email');

      if (user && user.email) {
        await sendEventConfirmationEmail(
          user.email,
          user.preferredName || 'Usuaria',
          event,
          registration
        );
        console.log(`✅ Email de confirmación enviado a: ${user.email}`);
      }
    } catch (emailError) {
      // No fallar el registro si el email falla, solo loguear el error
      console.error('⚠️  Error al enviar email de confirmación:', emailError.message);
      // Continuar con el registro exitoso
    }

    res.status(201).json({
      success: true,
      message: 'Registro exitoso al evento',
      data: {
        registration: registration.getPublicProfile(),
        event: {
          _id: event._id,
          title: event.title,
          date: event.date,
          time: event.time,
          mode: event.mode,
          location: event.location,
          link: event.link,
          registeredCount: event.registeredCount,
          availableSpots: event.availableSpots,
        },
      },
    });
  } catch (error) {
    console.error('Error in registerToEvent:', error);

    // Handle duplicate registration error (unique index)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ya estás registrado en este evento',
      });
    }

    next(error);
  }
};

/**
 * @desc    Cancel registration to an event
 * @route   DELETE /api/v1/events/:id/register
 * @access  Private (authenticated users)
 */
export const cancelRegistration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { reason } = req.body;

    // Find registration
    const registration = await EventRegistration.findExisting(userId, id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'No tienes un registro en este evento',
      });
    }

    if (registration.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Este registro ya fue cancelado',
      });
    }

    // Cancel registration
    await registration.cancel(reason);

    // Get updated event
    const event = await Event.findById(id).select('title date time registeredCount availableSpots');

    res.status(200).json({
      success: true,
      message: 'Registro cancelado exitosamente',
      data: {
        registration: registration.getPublicProfile(),
        event: {
          _id: event._id,
          title: event.title,
          date: event.date,
          time: event.time,
          registeredCount: event.registeredCount,
          availableSpots: event.availableSpots,
        },
      },
    });
  } catch (error) {
    console.error('Error in cancelRegistration:', error);
    next(error);
  }
};

/**
 * @desc    Get my event registrations
 * @route   GET /api/v1/events/my-registrations
 * @access  Private (authenticated users)
 */
export const getMyRegistrations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status = 'confirmed', upcoming = 'true' } = req.query;

    // Find user registrations
    const registrations = await EventRegistration.findByUser(userId, status);

    // Filter by upcoming/past events if specified
    let filteredRegistrations = registrations;

    if (upcoming === 'true') {
      filteredRegistrations = registrations.filter(
        (reg) => reg.event && new Date(reg.event.date) >= new Date()
      );
    } else if (upcoming === 'false') {
      filteredRegistrations = registrations.filter(
        (reg) => reg.event && new Date(reg.event.date) < new Date()
      );
    }

    // Remove null events (if event was deleted)
    filteredRegistrations = filteredRegistrations.filter((reg) => reg.event !== null);

    res.status(200).json({
      success: true,
      count: filteredRegistrations.length,
      filters: {
        status,
        upcoming: upcoming === 'true',
      },
      data: filteredRegistrations.map((reg) => ({
        registration: {
          _id: reg._id,
          status: reg.status,
          registeredAt: reg.registeredAt,
          cancelledAt: reg.cancelledAt,
          notes: reg.notes,
          attended: reg.attended,
        },
        event: {
          _id: reg.event._id,
          title: reg.event.title,
          description: reg.event.description,
          date: reg.event.date,
          time: reg.event.time,
          mode: reg.event.mode,
          location: reg.event.location,
          link: reg.event.link,
          image: reg.event.image,
          capacity: reg.event.capacity,
          registeredCount: reg.event.registeredCount,
          status: reg.event.status,
          isFeatured: reg.event.isFeatured,
        },
      })),
    });
  } catch (error) {
    console.error('Error in getMyRegistrations:', error);
    next(error);
  }
};

// =====================================
// ADMIN ENDPOINTS (Coming in Sprint 3 - Task 9)
// =====================================

/**
 * @desc    Create new event (Admin only)
 * @route   POST /api/v1/events
 * @access  Private/Admin
 */
export const createEvent = async (req, res, next) => {
  try {
    const eventData = {
      ...req.body,
      organizer: req.user.id, // Admin como organizador por defecto
    };

    const event = await Event.create(eventData);

    res.status(201).json({
      success: true,
      message: 'Evento creado exitosamente',
      data: event,
    });
  } catch (error) {
    console.error('Error in createEvent:', error);
    next(error);
  }
};

/**
 * @desc    Update event (Admin only)
 * @route   PUT /api/v1/events/:id
 * @access  Private/Admin
 */
export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Evento actualizado exitosamente',
      data: event,
    });
  } catch (error) {
    console.error('Error in updateEvent:', error);
    next(error);
  }
};

/**
 * @desc    Delete event (Admin only)
 * @route   DELETE /api/v1/events/:id
 * @access  Private/Admin
 */
export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado',
      });
    }

    // TODO: Delete all associated registrations
    await EventRegistration.deleteMany({ event: id });

    res.status(200).json({
      success: true,
      message: 'Evento eliminado exitosamente',
      data: null,
    });
  } catch (error) {
    console.error('Error in deleteEvent:', error);
    next(error);
  }
};

/**
 * @desc    Get event registrations (Admin only)
 * @route   GET /api/v1/events/:id/registrations
 * @access  Private/Admin
 */
export const getEventRegistrations = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.query;

    // Verify event exists
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado',
      });
    }

    // Get registrations
    const registrations = await EventRegistration.findByEvent(id, status);

    res.status(200).json({
      success: true,
      count: registrations.length,
      event: {
        _id: event._id,
        title: event.title,
        date: event.date,
        capacity: event.capacity,
        registeredCount: event.registeredCount,
      },
      data: registrations.map((reg) => ({
        _id: reg._id,
        user: {
          _id: reg.user._id,
          name: reg.user.preferredName,
          email: reg.user.email,
          phone: reg.user.phone,
          profileImage: reg.user.profileImage,
        },
        status: reg.status,
        registeredAt: reg.registeredAt,
        cancelledAt: reg.cancelledAt,
        notes: reg.notes,
        attended: reg.attended,
        attendedAt: reg.attendedAt,
      })),
    });
  } catch (error) {
    console.error('Error in getEventRegistrations:', error);
    next(error);
  }
};
