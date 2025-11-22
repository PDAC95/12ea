import Service from '../models/Service.js';
import User from '../models/User.js';

/**
 * Service Controller - Entre Amigas
 * Controlador para gestión de servicios profesionales de mujeres migrantes
 */

/**
 * @route   GET /api/v1/services
 * @desc    Obtener lista de servicios con filtros y paginación
 * @access  Public
 * @query   search, serviceType, city, page, limit, featured, verified
 */
export const getAll = async (req, res) => {
  try {
    const {
      search,
      serviceType,
      city,
      page = 1,
      limit = 20,
      featured,
      verified,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build query
    const query = { isActive: true };

    // Filtro por tipo de servicio
    if (serviceType) {
      query.serviceType = serviceType;
    }

    // Filtro por ciudad
    if (city) {
      query.city = { $regex: new RegExp(city, 'i') }; // Case-insensitive
    }

    // Filtro por destacados
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Filtro por verificados
    if (verified === 'true') {
      query.isVerified = true;
    }

    // Búsqueda de texto completo (si se proporciona)
    if (search) {
      query.$text = { $search: search };
    }

    // Paginación
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    const sortOptions = {};
    if (search) {
      // Si hay búsqueda de texto, ordenar por relevancia
      sortOptions.score = { $meta: 'textScore' };
    } else {
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    // Execute query
    const projection = search ? { score: { $meta: 'textScore' } } : {};

    const services = await Service.find(query, projection)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .populate('owner', 'preferredName email profileImage city')
      .lean();

    // Total count para paginación
    const totalItems = await Service.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limitNum);

    // Response con paginación
    res.status(200).json({
      success: true,
      data: {
        items: services,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems,
          itemsPerPage: limitNum,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1,
        },
      },
    });
  } catch (error) {
    console.error('Error en getAll services:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la lista de servicios',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   GET /api/v1/services/:id
 * @desc    Obtener detalle de un servicio por ID
 * @access  Public
 */
export const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id)
      .populate('owner', 'preferredName email profileImage city bio')
      .lean();

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado',
      });
    }

    // Si el servicio no está activo, solo lo pueden ver admins o el owner
    if (!service.isActive) {
      // Verificar si el usuario está autenticado y es owner o admin
      if (!req.user || (req.user.id !== service.owner._id.toString() && req.user.role !== 'admin')) {
        return res.status(404).json({
          success: false,
          message: 'Servicio no encontrado',
        });
      }
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error('Error en getById service:', error);

    // Error de ObjectId inválido
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'ID de servicio inválido',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al obtener el servicio',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   POST /api/v1/services/:id/view
 * @desc    Incrementar contador de vistas de un servicio
 * @access  Public
 */
export const incrementView = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado',
      });
    }

    await service.incrementViews();

    res.status(200).json({
      success: true,
      message: 'Vista registrada',
      data: {
        views: service.views,
      },
    });
  } catch (error) {
    console.error('Error en incrementView:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar vista',
    });
  }
};

/**
 * @route   POST /api/v1/services/:id/contact-click
 * @desc    Incrementar contador de clics en información de contacto
 * @access  Public
 */
export const incrementContactClick = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado',
      });
    }

    await service.incrementContactClicks();

    res.status(200).json({
      success: true,
      message: 'Clic de contacto registrado',
      data: {
        contactClicks: service.contactClicks,
      },
    });
  } catch (error) {
    console.error('Error en incrementContactClick:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar clic de contacto',
    });
  }
};

/**
 * @route   GET /api/v1/services/featured
 * @desc    Obtener servicios destacados
 * @access  Public
 * @query   limit (default: 6)
 */
export const getFeatured = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const featured = await Service.find({
      isActive: true,
      isFeatured: true,
    })
      .limit(parseInt(limit))
      .populate('owner', 'preferredName email profileImage')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: featured,
    });
  } catch (error) {
    console.error('Error en getFeatured:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener servicios destacados',
    });
  }
};

/**
 * @route   GET /api/v1/services/stats
 * @desc    Obtener estadísticas generales de servicios
 * @access  Public
 */
export const getStats = async (req, res) => {
  try {
    const stats = await Service.getStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error en getStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
    });
  }
};

/**
 * @route   POST /api/v1/services
 * @desc    Crear nuevo servicio
 * @access  Private (requiere autenticación)
 */
export const create = async (req, res) => {
  try {
    const {
      name,
      serviceType,
      description,
      credentials,
      phone,
      email,
      whatsapp,
      city,
      address,
      website,
      instagram,
      facebook,
      linkedin,
      logo,
      images,
    } = req.body;

    // El owner es el usuario autenticado
    const owner = req.user.id;

    // Crear servicio
    const service = await Service.create({
      name,
      serviceType,
      description,
      credentials,
      phone,
      email,
      whatsapp,
      city,
      address,
      website,
      instagram,
      facebook,
      linkedin,
      logo,
      images,
      owner,
    });

    // Populate owner para respuesta
    await service.populate('owner', 'preferredName email');

    res.status(201).json({
      success: true,
      message: 'Servicio creado exitosamente',
      data: service,
    });
  } catch (error) {
    console.error('Error en create service:', error);

    // Errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => ({
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
      message: 'Error al crear el servicio',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   PUT /api/v1/services/:id
 * @desc    Actualizar servicio existente
 * @access  Private (requiere ser owner o admin)
 */
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Buscar servicio
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado',
      });
    }

    // Verificar que el usuario sea owner o admin
    if (service.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para editar este servicio',
      });
    }

    // Campos que no se pueden actualizar directamente
    delete updates.owner;
    delete updates.views;
    delete updates.contactClicks;
    delete updates.isVerified;
    delete updates.isFeatured;
    delete updates.verifiedAt;

    // Si es admin, permitir cambiar isVerified y isFeatured
    if (req.user.role === 'admin') {
      if (req.body.isVerified !== undefined) {
        updates.isVerified = req.body.isVerified;
        if (req.body.isVerified === true) {
          updates.verifiedAt = new Date();
        }
      }
      if (req.body.isFeatured !== undefined) {
        updates.isFeatured = req.body.isFeatured;
      }
    }

    // Guardar quién modificó el servicio
    updates.lastModifiedBy = req.user.id;

    // Actualizar
    const updatedService = await Service.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('owner', 'preferredName email');

    res.status(200).json({
      success: true,
      message: 'Servicio actualizado exitosamente',
      data: updatedService,
    });
  } catch (error) {
    console.error('Error en update service:', error);

    // Errores de validación
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => ({
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
      message: 'Error al actualizar el servicio',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   DELETE /api/v1/services/:id
 * @desc    Eliminar servicio (soft delete - marca como inactivo)
 * @access  Private (requiere ser owner o admin)
 */
export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado',
      });
    }

    // Verificar que el usuario sea owner o admin
    if (service.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar este servicio',
      });
    }

    // Soft delete (marcar como inactivo)
    service.isActive = false;
    await service.save();

    res.status(200).json({
      success: true,
      message: 'Servicio eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error en remove service:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el servicio',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   GET /api/v1/services/my/list
 * @desc    Obtener servicios del usuario autenticado
 * @access  Private
 */
export const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ owner: req.user.id })
      .populate('owner', 'preferredName email')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error('Error en getMyServices:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tus servicios',
    });
  }
};

/**
 * @route   GET /api/v1/services/service-types
 * @desc    Obtener lista de tipos de servicio disponibles
 * @access  Public
 */
export const getServiceTypes = async (req, res) => {
  try {
    // Tipos de servicio definidos en el modelo
    const serviceTypes = [
      'Salud',
      'Legal',
      'Educación',
      'Financiero',
      'Inmigración',
      'Traducción',
      'Tecnología',
      'Consultoría',
      'Otros',
    ];

    // Opcional: obtener conteo por tipo
    const typesWithCount = await Promise.all(
      serviceTypes.map(async (serviceType) => {
        const count = await Service.countDocuments({
          serviceType,
          isActive: true,
        });
        return { name: serviceType, count };
      })
    );

    res.status(200).json({
      success: true,
      data: typesWithCount,
    });
  } catch (error) {
    console.error('Error en getServiceTypes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tipos de servicio',
    });
  }
};

/**
 * @route   POST /api/v1/services/propose
 * @desc    Proponer servicio para revisión (usuario regular)
 * @access  Private (requiere autenticación)
 * Sistema de Propuesta de Servicios - Sprint 5+
 */
export const proposeService = async (req, res) => {
  try {
    console.log('\n📋 === PROPOSE SERVICE DEBUG ===');
    console.log('🔐 Usuario autenticado:', req.user?.id, req.user?.email);
    console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));
    console.log('📝 Campos recibidos:', Object.keys(req.body));
    console.log('📎 Archivo recibido (req.file):', req.file ? req.file.originalname : 'No hay archivo');

    const {
      name,
      serviceType,
      description,
      credentials,
      phone,
      email,
      whatsapp,
      city,
      address,
      website,
      instagram,
      facebook,
      linkedin,
    } = req.body;

    console.log('\n✅ Campos extraídos:');
    console.log('  - name:', name);
    console.log('  - serviceType:', serviceType);
    console.log('  - description:', description ? `${description.substring(0, 50)}...` : 'N/A');
    console.log('  - city:', city);
    console.log('  - credentials:', credentials || 'N/A');
    console.log('  - phone:', phone || 'N/A');
    console.log('  - email:', email || 'N/A');

    // El owner y submittedBy son el usuario autenticado
    const userId = req.user.id;

    // Si hay archivo de logo, subirlo a S3
    let logoUrl = null;
    if (req.file) {
      console.log('\n📤 Subiendo logo a S3...');
      const { uploadToS3 } = await import('../services/upload.service.js');
      const uploadResult = await uploadToS3(req.file, 'services', userId);
      logoUrl = uploadResult.url;
      console.log('✅ Logo subido:', logoUrl);
    }

    console.log('\n🚀 Creando servicio con status="pending" para revisión...');

    // Crear servicio con status='pending'
    const service = await Service.create({
      name,
      serviceType,
      description,
      credentials,
      phone,
      email,
      whatsapp,
      city,
      address,
      website,
      instagram,
      facebook,
      linkedin,
      logo: logoUrl,
      owner: userId,
      submittedBy: userId,
      status: 'pending', // IMPORTANTE: status pending para revisión
    });

    console.log(`📋 Usuario [${req.user.email}] propuso servicio: "${name}" (ID: ${service._id})`);
    console.log('=== END DEBUG ===\n');

    // Populate para respuesta
    await service.populate('submittedBy', 'preferredName email');

    res.status(201).json({
      success: true,
      message: 'Tu servicio ha sido enviado para revisión. Nuestro equipo lo revisará pronto.',
      data: service,
    });
  } catch (error) {
    console.error('\n❌ === ERROR EN PROPOSE SERVICE ===');
    console.error('📛 Error completo:', error);
    console.error('📛 Error message:', error.message);
    console.error('📛 Error name:', error.name);

    // Errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      console.error('📛 Validation Error detectado');
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Error de validación de Mongoose',
        errors,
      });
    }

    // Error genérico
    res.status(500).json({
      success: false,
      message: error.message || 'Error al proponer servicio',
    });
  }
};
