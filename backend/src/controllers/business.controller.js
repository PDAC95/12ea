import Business from '../models/Business.js';
import User from '../models/User.js';
import { sendBusinessApprovalEmail, sendBusinessRejectionEmail } from '../services/email.service.js';

/**
 * Business Controller - Entre Amigas
 * Controlador para gestión de negocios de mujeres migrantes
 */

/**
 * @route   GET /api/v1/businesses
 * @desc    Obtener lista de negocios con filtros y paginación
 * @access  Public
 * @query   search, category, city, page, limit, featured, verified
 */
export const getAll = async (req, res) => {
  try {
    const {
      search,
      category,
      city,
      page = 1,
      limit = 20,
      featured,
      verified,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build query - Solo mostrar negocios activos Y aprobados
    const query = { isActive: true, status: 'approved' };

    // Filtro por categoría
    if (category) {
      query.category = category;
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

    const businesses = await Business.find(query, projection)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .populate('owner', 'preferredName email profileImage city')
      .lean();

    // Total count para paginación
    const totalItems = await Business.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limitNum);

    // Response con paginación
    res.status(200).json({
      success: true,
      data: {
        items: businesses,
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
    console.error('Error en getAll businesses:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la lista de negocios',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   GET /api/v1/admin/businesses
 * @desc    Obtener TODOS los negocios (incluye inactivos) - Admin only
 * @access  Private/Admin
 * @query   search, category, city, page, limit
 */
export const getAllAdmin = async (req, res) => {
  try {
    const {
      search,
      category,
      city,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build query - SIN FILTRO de isActive (muestra todos)
    const query = {};

    // Filtro por categoría
    if (category) {
      query.category = category;
    }

    // Filtro por ciudad
    if (city) {
      query.city = { $regex: new RegExp(city, 'i') };
    }

    // Búsqueda de texto completo
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
      sortOptions.score = { $meta: 'textScore' };
    } else {
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    // Execute query
    const projection = search ? { score: { $meta: 'textScore' } } : {};

    const businesses = await Business.find(query, projection)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .populate('owner', 'preferredName email profileImage city')
      .lean();

    // Total count
    const total = await Business.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    // Response en formato esperado por frontend
    res.status(200).json({
      success: true,
      businesses, // Array de negocios
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNext: pageNum < totalPages,
      hasPrev: pageNum > 1,
    });
  } catch (error) {
    console.error('Error en getAllAdmin:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener negocios',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/v1/businesses/:id
 * @desc    Obtener detalle de un negocio por ID
 * @access  Public
 */
export const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const business = await Business.findById(id)
      .populate('owner', 'preferredName email profileImage city bio')
      .lean();

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Negocio no encontrado',
      });
    }

    // Si el negocio no está activo, solo lo pueden ver admins o el owner
    if (!business.isActive) {
      // Verificar si el usuario está autenticado y es owner o admin
      if (!req.user || (req.user.id !== business.owner._id.toString() && req.user.role !== 'admin')) {
        return res.status(404).json({
          success: false,
          message: 'Negocio no encontrado',
        });
      }
    }

    res.status(200).json({
      success: true,
      data: business,
    });
  } catch (error) {
    console.error('Error en getById business:', error);

    // Error de ObjectId inválido
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'ID de negocio inválido',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al obtener el negocio',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   POST /api/v1/businesses/:id/view
 * @desc    Incrementar contador de vistas de un negocio
 * @access  Public
 */
export const incrementView = async (req, res) => {
  try {
    const { id } = req.params;

    const business = await Business.findById(id);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Negocio no encontrado',
      });
    }

    await business.incrementViews();

    res.status(200).json({
      success: true,
      message: 'Vista registrada',
      data: {
        views: business.views,
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
 * @route   POST /api/v1/businesses/:id/contact-click
 * @desc    Incrementar contador de clics en información de contacto
 * @access  Public
 */
export const incrementContactClick = async (req, res) => {
  try {
    const { id } = req.params;

    const business = await Business.findById(id);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Negocio no encontrado',
      });
    }

    await business.incrementContactClicks();

    res.status(200).json({
      success: true,
      message: 'Clic de contacto registrado',
      data: {
        contactClicks: business.contactClicks,
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
 * @route   GET /api/v1/businesses/featured
 * @desc    Obtener negocios destacados
 * @access  Public
 * @query   limit (default: 6)
 */
export const getFeatured = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const featured = await Business.findFeatured(parseInt(limit));

    res.status(200).json({
      success: true,
      data: featured,
    });
  } catch (error) {
    console.error('Error en getFeatured:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener negocios destacados',
    });
  }
};

/**
 * @route   GET /api/v1/businesses/stats
 * @desc    Obtener estadísticas generales de negocios
 * @access  Public
 */
export const getStats = async (req, res) => {
  try {
    const stats = await Business.getStats();

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
 * @route   POST /api/v1/businesses
 * @desc    Crear nuevo negocio
 * @access  Private (requiere autenticación)
 */
export const create = async (req, res) => {
  try {
    // 🔍 DEBUGGING: Log del request body completo
    console.log('\n📋 === CREATE BUSINESS DEBUG ===');
    console.log('🔐 Usuario autenticado:', req.user?.id, req.user?.email);
    console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));
    console.log('📝 Campos recibidos:', Object.keys(req.body));

    const {
      name,
      category,
      description,
      phone,
      email,
      whatsapp,
      city,
      address,
      website,
      instagram,
      facebook,
      logo,
      images,
    } = req.body;

    // 🔍 DEBUGGING: Log de campos extraídos
    console.log('\n✅ Campos extraídos:');
    console.log('  - name:', name);
    console.log('  - category:', category);
    console.log('  - description:', description ? `${description.substring(0, 50)}...` : 'N/A');
    console.log('  - city:', city);
    console.log('  - website:', website || 'N/A');
    console.log('  - phone:', phone || 'N/A');
    console.log('  - email:', email || 'N/A');

    // El owner es el usuario autenticado
    const owner = req.user.id;

    // 🔍 DEBUGGING: Log antes de crear
    console.log('\n🚀 Intentando crear negocio en MongoDB...');

    // Crear negocio
    const business = await Business.create({
      name,
      category,
      description,
      phone,
      email,
      whatsapp,
      city,
      address,
      website,
      instagram,
      facebook,
      logo,
      images,
      owner,
    });

    console.log('✅ Negocio creado exitosamente:', business._id);
    console.log('=== END DEBUG ===\n');

    // Populate owner para respuesta
    await business.populate('owner', 'preferredName email');

    res.status(201).json({
      success: true,
      message: 'Negocio creado exitosamente',
      data: business,
    });
  } catch (error) {
    console.error('\n❌ === ERROR EN CREATE BUSINESS ===');
    console.error('📛 Error completo:', error);
    console.error('📛 Error message:', error.message);
    console.error('📛 Error name:', error.name);

    // Errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      console.error('📛 Validation Error detectado');
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
        value: err.value,
      }));

      console.error('📛 Errores de validación:', JSON.stringify(errors, null, 2));
      console.error('=== END ERROR DEBUG ===\n');

      return res.status(400).json({
        success: false,
        message: 'Error de validación de MongoDB',
        errors,
      });
    }

    console.error('📛 Error tipo:', typeof error);
    console.error('📛 Error stack:', error.stack);
    console.error('=== END ERROR DEBUG ===\n');

    res.status(500).json({
      success: false,
      message: 'Error al crear el negocio',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   PUT /api/v1/businesses/:id
 * @desc    Actualizar negocio existente
 * @access  Private (requiere ser owner o admin)
 */
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Buscar negocio
    const business = await Business.findById(id);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Negocio no encontrado',
      });
    }

    // Verificar que el usuario sea owner o admin
    if (business.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para editar este negocio',
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

    // Guardar quién modificó el negocio
    updates.lastModifiedBy = req.user.id;

    // Actualizar
    const updatedBusiness = await Business.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('owner', 'preferredName email');

    res.status(200).json({
      success: true,
      message: 'Negocio actualizado exitosamente',
      data: updatedBusiness,
    });
  } catch (error) {
    console.error('Error en update business:', error);

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
      message: 'Error al actualizar el negocio',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   DELETE /api/v1/businesses/:id
 * @desc    Eliminar negocio (soft delete - marca como inactivo)
 * @access  Private (requiere ser owner o admin)
 */
export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const business = await Business.findById(id);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Negocio no encontrado',
      });
    }

    // Verificar que el usuario sea owner o admin
    if (business.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar este negocio',
      });
    }

    // Soft delete (marcar como inactivo)
    business.isActive = false;
    await business.save();

    res.status(200).json({
      success: true,
      message: 'Negocio eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error en remove business:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el negocio',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   GET /api/v1/businesses/my-businesses
 * @desc    Obtener negocios del usuario autenticado
 * @access  Private
 */
export const getMyBusinesses = async (req, res) => {
  try {
    const businesses = await Business.findByOwner(req.user.id);

    res.status(200).json({
      success: true,
      data: businesses,
    });
  } catch (error) {
    console.error('Error en getMyBusinesses:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tus negocios',
    });
  }
};

/**
 * @route   GET /api/v1/businesses/categories
 * @desc    Obtener lista de categorías disponibles
 * @access  Public
 */
export const getCategories = async (req, res) => {
  try {
    // Categorías definidas en el modelo
    const categories = [
      'Gastronomía',
      'Belleza y Bienestar',
      'Moda y Accesorios',
      'Servicios Profesionales',
      'Educación y Talleres',
      'Arte y Manualidades',
      'Salud',
      'Tecnología',
      'Eventos y Entretenimiento',
      'Otros',
    ];

    // Opcional: obtener conteo por categoría
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Business.countDocuments({
          category,
          isActive: true,
        });
        return { name: category, count };
      })
    );

    res.status(200).json({
      success: true,
      data: categoriesWithCount,
    });
  } catch (error) {
    console.error('Error en getCategories:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener categorías',
    });
  }
};

/**
 * @route   POST /api/v1/businesses/propose
 * @desc    Proponer negocio para revisión (usuario regular)
 * @access  Private (requiere autenticación)
 * Sistema de Propuesta de Negocios - PLAN-BUSINESS-PROPOSAL-SYSTEM
 */
export const proposeBusiness = async (req, res) => {
  try {
    console.log('\n📋 === PROPOSE BUSINESS DEBUG ===');
    console.log('🔐 Usuario autenticado:', req.user?.id, req.user?.email);
    console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));
    console.log('📝 Campos recibidos:', Object.keys(req.body));
    console.log('📎 Archivo recibido (req.file):', req.file ? req.file.originalname : 'No hay archivo');

    const {
      name,
      category,
      description,
      phone,
      email,
      whatsapp,
      city,
      address,
      website,
      instagram,
      facebook,
    } = req.body;

    console.log('\n✅ Campos extraídos:');
    console.log('  - name:', name);
    console.log('  - category:', category);
    console.log('  - description:', description ? `${description.substring(0, 50)}...` : 'N/A');
    console.log('  - city:', city);
    console.log('  - website:', website || 'N/A');
    console.log('  - phone:', phone || 'N/A');
    console.log('  - email:', email || 'N/A');

    // El owner y submittedBy son el usuario autenticado
    const userId = req.user.id;

    // Si hay archivo de logo, subirlo a S3
    let logoUrl = null;
    if (req.file) {
      console.log('\n📤 Subiendo logo a S3...');
      const { uploadToS3 } = await import('../services/upload.service.js');
      const uploadResult = await uploadToS3(req.file, 'businesses', userId);
      logoUrl = uploadResult.url;
      console.log('✅ Logo subido:', logoUrl);
    }

    console.log('\n🚀 Creando negocio con status="pending" para revisión...');

    // Crear negocio con status='pending'
    const business = await Business.create({
      name,
      category,
      description,
      phone,
      email,
      whatsapp,
      city,
      address,
      website,
      instagram,
      facebook,
      logo: logoUrl, // URL de S3 o null
      owner: userId,
      submittedBy: userId,
      status: 'pending', // IMPORTANTE: status pending para revisión
    });

    console.log(`📋 Usuario [${req.user.email}] propuso negocio: "${name}" (ID: ${business._id})`);
    console.log('=== END DEBUG ===\n');

    // Populate para respuesta
    await business.populate('submittedBy', 'preferredName email');

    res.status(201).json({
      success: true,
      message: 'Tu negocio ha sido enviado para revisión. Nuestro equipo lo revisará pronto.',
      data: business,
    });
  } catch (error) {
    console.error('\n❌ === ERROR EN PROPOSE BUSINESS ===');
    console.error('📛 Error completo:', error);
    console.error('📛 Error message:', error.message);
    console.error('📛 Error name:', error.name);

    // Errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      console.error('📛 Validation Error detectado');
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
        value: err.value,
      }));

      console.error('📛 Errores de validación:', JSON.stringify(errors, null, 2));
      console.error('=== END ERROR DEBUG ===\n');

      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors,
      });
    }

    console.error('📛 Error stack:', error.stack);
    console.error('=== END ERROR DEBUG ===\n');

    res.status(500).json({
      success: false,
      message: 'Error al enviar propuesta de negocio',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   GET /api/v1/admin/businesses/pending
 * @desc    Obtener negocios pendientes de aprobación
 * @access  Private/Admin
 * Sistema de Propuesta de Negocios - PLAN-BUSINESS-PROPOSAL-SYSTEM
 */
export const getPendingBusinesses = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const businesses = await Business.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('submittedBy', 'preferredName email profileImage')
      .populate('owner', 'preferredName email')
      .lean();

    const total = await Business.countDocuments({ status: 'pending' });

    console.log(`📋 Admin solicitó ${businesses.length} negocios pendientes (total: ${total})`);

    res.status(200).json({
      success: true,
      data: {
        businesses,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error('Error en getPendingBusinesses:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener negocios pendientes',
    });
  }
};

/**
 * @route   PATCH /api/v1/admin/businesses/:id/approve
 * @desc    Aprobar negocio pendiente
 * @access  Private/Admin
 * Sistema de Propuesta de Negocios - PLAN-BUSINESS-PROPOSAL-SYSTEM
 */
export const approveBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const business = await Business.findById(id).populate('submittedBy', 'preferredName email');

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Negocio no encontrado',
      });
    }

    if (business.status !== 'pending') {
      return res.status(409).json({
        success: false,
        message: `Este negocio ya fue ${business.status === 'approved' ? 'aprobado' : 'rechazado'}`,
      });
    }

    await business.approve(req.user.id);

    console.log(`✅ Admin [${req.user.email}] aprobó negocio: "${business.name}" (ID: ${business._id})`);

    // Enviar email de aprobación
    try {
      await sendBusinessApprovalEmail(business.submittedBy.email, business.submittedBy.preferredName, business);
      console.log(`📧 Email de aprobación enviado a ${business.submittedBy.email}`);
    } catch (emailError) {
      console.error('⚠️ Error al enviar email de aprobación:', emailError);
      // No falla la operación si el email falla
    }

    res.status(200).json({
      success: true,
      message: 'Negocio aprobado exitosamente',
      data: business,
    });
  } catch (error) {
    console.error('Error en approveBusiness:', error);
    res.status(500).json({
      success: false,
      message: 'Error al aprobar el negocio',
    });
  }
};

/**
 * @route   PATCH /api/v1/admin/businesses/:id/reject
 * @desc    Rechazar negocio pendiente
 * @access  Private/Admin
 * Sistema de Propuesta de Negocios - PLAN-BUSINESS-PROPOSAL-SYSTEM
 */
export const rejectBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Debes proporcionar una razón de rechazo (mínimo 10 caracteres)',
      });
    }

    const business = await Business.findById(id).populate('submittedBy', 'preferredName email');

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Negocio no encontrado',
      });
    }

    if (business.status !== 'pending') {
      return res.status(409).json({
        success: false,
        message: 'Este negocio ya fue procesado',
      });
    }

    await business.reject(req.user.id, reason);

    console.log(`❌ Admin [${req.user.email}] rechazó negocio: "${business.name}" - Razón: "${reason}"`);

    // Enviar email de rechazo
    try {
      await sendBusinessRejectionEmail(business.submittedBy.email, business.submittedBy.preferredName, business, reason);
      console.log(`📧 Email de rechazo enviado a ${business.submittedBy.email}`);
    } catch (emailError) {
      console.error('⚠️ Error al enviar email de rechazo:', emailError);
      // No falla la operación si el email falla
    }

    res.status(200).json({
      success: true,
      message: 'Negocio rechazado',
      data: business,
    });
  } catch (error) {
    console.error('Error en rejectBusiness:', error);
    res.status(500).json({
      success: false,
      message: 'Error al rechazar el negocio',
    });
  }
};
