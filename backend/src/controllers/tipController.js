import Tip from '../models/Tip.js';
import { TIP_CATEGORIES } from '../constants/tip.js';

/**
 * Tip Controller - Entre Amigas
 * Controlador para gestión de tips comunitarios
 */

// =====================================
// PUBLIC ENDPOINTS
// =====================================

/**
 * @desc    Get all tip categories
 * @route   GET /api/v1/tips/categories
 * @access  Public
 */
export const getCategories = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        categories: TIP_CATEGORIES,
      },
      message: 'Categorías de tips obtenidas exitosamente',
    });
  } catch (error) {
    console.error('Error al obtener categorías de tips:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error al obtener categorías de tips',
      },
    });
  }
};

/**
 * @desc    Get all approved tips (public)
 * @route   GET /api/v1/tips
 * @access  Public
 * @params  ?category=Inmigración y Adaptación|Emprendimiento|etc.
 *          ?page=1
 *          ?limit=20
 *          ?search=keyword
 *          ?sortBy=createdAt|views|likes
 */
export const getAllTips = async (req, res, next) => {
  try {
    const {
      category,
      page = 1,
      limit = 20,
      search,
      sortBy = 'createdAt',
    } = req.query;

    // Build query - solo tips aprobados
    const query = {
      status: 'approved',
    };

    // Filter by category
    if (category && TIP_CATEGORIES.includes(category)) {
      query.category = category;
    }

    // Search in title and content (text search)
    if (search) {
      query.$text = { $search: search };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = Math.min(parseInt(limit), 50); // Max 50 por página

    // Sort options
    const sortOptions = {
      createdAt: { createdAt: -1 },
      views: { views: -1, createdAt: -1 },
      likes: { likeCount: -1, createdAt: -1 },
    };

    const sort = sortOptions[sortBy] || sortOptions.createdAt;

    // Execute query
    let tips;
    if (search) {
      tips = await Tip.find(query, { score: { $meta: 'textScore' } })
        .populate('author', 'preferredName fullName profileImage')
        .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
        .limit(limitNum)
        .skip(skip);
    } else {
      // Para sorting por likes, necesitamos agregar el virtual field
      if (sortBy === 'likes') {
        tips = await Tip.aggregate([
          { $match: query },
          {
            $addFields: {
              likeCount: { $size: '$likes' },
            },
          },
          { $sort: { likeCount: -1, createdAt: -1 } },
          { $skip: skip },
          { $limit: limitNum },
          {
            $lookup: {
              from: 'users',
              localField: 'author',
              foreignField: '_id',
              as: 'author',
            },
          },
          { $unwind: '$author' },
          {
            $project: {
              title: 1,
              content: 1,
              category: 1,
              views: 1,
              likeCount: 1,
              createdAt: 1,
              updatedAt: 1,
              'author._id': 1,
              'author.preferredName': 1,
              'author.fullName': 1,
              'author.profileImage': 1,
            },
          },
        ]);
      } else {
        tips = await Tip.find(query)
          .populate('author', 'preferredName fullName profileImage')
          .sort(sort)
          .limit(limitNum)
          .skip(skip);
      }
    }

    // Count total documents
    const total = await Tip.countDocuments(query);

    // Calcular category counts SOLO si no hay búsqueda activa
    let categoryCounts = {};
    if (!search) {
      const countsAggregation = await Tip.aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]);

      countsAggregation.forEach((item) => {
        categoryCounts[item._id] = item.count;
      });
    }

    // Response
    res.status(200).json({
      success: true,
      count: tips.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
        hasNext: skip + tips.length < total,
        hasPrev: parseInt(page) > 1,
      },
      filters: {
        category: category || 'all',
        search: search || null,
        sortBy,
      },
      data: {
        tips: tips.map((tip) => ({
          _id: tip._id,
          title: tip.title,
          content: tip.content,
          category: tip.category,
          author: tip.author
            ? {
                _id: tip.author._id,
                preferredName: tip.author.preferredName,
                fullName: tip.author.fullName || tip.author.preferredName,
                profileImage: tip.author.profileImage,
              }
            : null,
          viewsCount: tip.views || 0,
          likesCount: tip.likeCount || (tip.likes ? tip.likes.length : 0),
          createdAt: tip.createdAt,
          updatedAt: tip.updatedAt,
        })),
        categoryCounts,
      },
    });
  } catch (error) {
    console.error('Error in getAllTips:', error);
    next(error);
  }
};

/**
 * @desc    Get tip by ID
 * @route   GET /api/v1/tips/:id
 * @access  Public
 */
export const getTipById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tip = await Tip.findById(id)
      .populate('author', 'preferredName fullName profileImage bio');

    if (!tip) {
      return res.status(404).json({
        success: false,
        message: 'Tip no encontrado',
      });
    }

    // Solo mostrar tips aprobados al público
    if (tip.status !== 'approved') {
      return res.status(404).json({
        success: false,
        message: 'Tip no encontrado',
      });
    }

    // Incrementar vistas
    await tip.incrementViews();

    // Buscar tips relacionados (misma categoría)
    const relatedTips = await Tip.find({
      category: tip.category,
      status: 'approved',
      _id: { $ne: tip._id },
    })
      .populate('author', 'preferredName fullName profileImage')
      .select('title category views likeCount createdAt')
      .limit(3)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        _id: tip._id,
        title: tip.title,
        content: tip.content,
        category: tip.category,
        author: tip.author
          ? {
              _id: tip.author._id,
              preferredName: tip.author.preferredName,
              fullName: tip.author.fullName,
              profileImage: tip.author.profileImage,
              bio: tip.author.bio,
            }
          : null,
        viewsCount: tip.views || 0,
        likesCount: tip.likeCount || 0,
        likedBy: tip.likes || [],
        createdAt: tip.createdAt,
        updatedAt: tip.updatedAt,
      },
      relatedTips: relatedTips.map((t) => ({
        _id: t._id,
        title: t.title,
        category: t.category,
        viewsCount: t.views || 0,
        likesCount: t.likeCount || 0,
        author: t.author
          ? {
              preferredName: t.author.preferredName,
              fullName: t.author.fullName,
              profileImage: t.author.profileImage,
            }
          : null,
        createdAt: t.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error in getTipById:', error);
    next(error);
  }
};

/**
 * @desc    Get most liked tips
 * @route   GET /api/v1/tips/top/liked
 * @access  Public
 */
export const getMostLikedTips = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const tips = await Tip.findMostLiked(parseInt(limit));

    res.status(200).json({
      success: true,
      count: tips.length,
      data: tips,
    });
  } catch (error) {
    console.error('Error in getMostLikedTips:', error);
    next(error);
  }
};

// =====================================
// PROTECTED ENDPOINTS (User)
// =====================================

/**
 * @desc    Create new tip (proposal)
 * @route   POST /api/v1/tips
 * @access  Private (authenticated users)
 */
export const createTip = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;

    // Validaciones
    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Título, contenido y categoría son requeridos',
      });
    }

    if (!TIP_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Categoría inválida',
      });
    }

    // Crear tip (status pending por defecto)
    const tip = await Tip.create({
      title,
      content,
      category,
      author: req.user.id,
      status: 'pending', // Requiere aprobación admin
    });

    await tip.populate('author', 'preferredName email');

    res.status(201).json({
      success: true,
      data: tip,
      message: '¡Gracias por tu aporte! Tu tip será revisado por nuestro equipo antes de publicarse.',
    });
  } catch (error) {
    console.error('Error in createTip:', error);
    next(error);
  }
};

/**
 * @desc    Get my tips (author)
 * @route   GET /api/v1/tips/my-tips
 * @access  Private
 */
export const getMyTips = async (req, res, next) => {
  try {
    const tips = await Tip.findByAuthor(req.user.id);

    res.status(200).json({
      success: true,
      count: tips.length,
      data: tips.map((tip) => ({
        _id: tip._id,
        title: tip.title,
        content: tip.content,
        category: tip.category,
        status: tip.status,
        views: tip.views,
        likeCount: tip.likeCount,
        rejectionReason: tip.rejectionReason,
        createdAt: tip.createdAt,
        approvedAt: tip.approvedAt,
      })),
    });
  } catch (error) {
    console.error('Error in getMyTips:', error);
    next(error);
  }
};

/**
 * @desc    Update my tip (only if pending or rejected)
 * @route   PUT /api/v1/tips/:id
 * @access  Private
 */
export const updateMyTip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;

    const tip = await Tip.findById(id);

    if (!tip) {
      return res.status(404).json({
        success: false,
        message: 'Tip no encontrado',
      });
    }

    // Verificar que el usuario sea el autor
    if (tip.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para editar este tip',
      });
    }

    // Solo se puede editar si está pending o rejected
    if (tip.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'No puedes editar un tip que ya fue aprobado',
      });
    }

    // Validar categoría si se proporciona
    if (category && !TIP_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Categoría inválida',
      });
    }

    // Actualizar campos
    if (title) tip.title = title;
    if (content) tip.content = content;
    if (category) tip.category = category;

    // Si era rejected, volver a pending
    if (tip.status === 'rejected') {
      tip.status = 'pending';
      tip.rejectionReason = null;
    }

    await tip.save();

    res.status(200).json({
      success: true,
      data: tip,
      message: 'Tip actualizado exitosamente',
    });
  } catch (error) {
    console.error('Error in updateMyTip:', error);
    next(error);
  }
};

/**
 * @desc    Delete my tip (only if pending or rejected)
 * @route   DELETE /api/v1/tips/:id
 * @access  Private
 */
export const deleteMyTip = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tip = await Tip.findById(id);

    if (!tip) {
      return res.status(404).json({
        success: false,
        message: 'Tip no encontrado',
      });
    }

    // Verificar que el usuario sea el autor
    if (tip.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar este tip',
      });
    }

    // Solo se puede eliminar si está pending o rejected
    if (tip.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'No puedes eliminar un tip que ya fue aprobado. Contacta a un administrador.',
      });
    }

    await tip.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Tip eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error in deleteMyTip:', error);
    next(error);
  }
};

/**
 * @desc    Like a tip
 * @route   POST /api/v1/tips/:id/like
 * @access  Private
 */
export const likeTip = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tip = await Tip.findById(id);

    if (!tip) {
      return res.status(404).json({
        success: false,
        message: 'Tip no encontrado',
      });
    }

    // Verificar si ya dio like
    const alreadyLiked = tip.likes.includes(req.user.id);

    if (alreadyLiked) {
      return res.status(400).json({
        success: false,
        message: 'Ya diste like a este tip',
      });
    }

    await tip.addLike(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        likeCount: tip.likeCount,
      },
      message: 'Like agregado exitosamente',
    });
  } catch (error) {
    console.error('Error in likeTip:', error);
    next(error);
  }
};

/**
 * @desc    Unlike a tip
 * @route   DELETE /api/v1/tips/:id/like
 * @access  Private
 */
export const unlikeTip = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tip = await Tip.findById(id);

    if (!tip) {
      return res.status(404).json({
        success: false,
        message: 'Tip no encontrado',
      });
    }

    // Verificar si dio like previamente
    const alreadyLiked = tip.likes.includes(req.user.id);

    if (!alreadyLiked) {
      return res.status(400).json({
        success: false,
        message: 'No has dado like a este tip',
      });
    }

    await tip.removeLike(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        likeCount: tip.likeCount,
      },
      message: 'Like removido exitosamente',
    });
  } catch (error) {
    console.error('Error in unlikeTip:', error);
    next(error);
  }
};

// =====================================
// ADMIN ENDPOINTS
// =====================================

/**
 * @desc    Get all tips (admin - any status)
 * @route   GET /api/v1/admin/tips
 * @access  Private/Admin
 */
export const getAllTipsAdmin = async (req, res, next) => {
  try {
    const {
      status,
      category,
      page = 1,
      limit = 20,
      search,
    } = req.query;

    // Build query
    const query = {};

    if (status) {
      query.status = status;
    }

    if (category && TIP_CATEGORIES.includes(category)) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = Math.min(parseInt(limit), 100);

    // Execute query
    const tips = await Tip.find(query)
      .populate('author', 'preferredName fullName email')
      .populate('approvedBy', 'preferredName email')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await Tip.countDocuments(query);

    res.status(200).json({
      success: true,
      count: tips.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
      data: tips,
    });
  } catch (error) {
    console.error('Error in getAllTipsAdmin:', error);
    next(error);
  }
};

/**
 * @desc    Get pending tips (admin)
 * @route   GET /api/v1/admin/tips/pending
 * @access  Private/Admin
 */
export const getPendingTips = async (req, res, next) => {
  try {
    const tips = await Tip.findPending();

    res.status(200).json({
      success: true,
      count: tips.length,
      data: tips,
    });
  } catch (error) {
    console.error('Error in getPendingTips:', error);
    next(error);
  }
};

/**
 * @desc    Approve tip
 * @route   PUT /api/v1/admin/tips/:id/approve
 * @access  Private/Admin
 */
export const approveTip = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tip = await Tip.findById(id);

    if (!tip) {
      return res.status(404).json({
        success: false,
        message: 'Tip no encontrado',
      });
    }

    if (tip.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'El tip ya está aprobado',
      });
    }

    await tip.approve(req.user.id);
    await tip.populate('author', 'preferredName email');

    res.status(200).json({
      success: true,
      data: tip,
      message: `Tip "${tip.title}" aprobado exitosamente`,
    });
  } catch (error) {
    console.error('Error in approveTip:', error);
    next(error);
  }
};

/**
 * @desc    Reject tip
 * @route   PUT /api/v1/admin/tips/:id/reject
 * @access  Private/Admin
 */
export const rejectTip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'La razón del rechazo debe tener al menos 10 caracteres',
      });
    }

    const tip = await Tip.findById(id);

    if (!tip) {
      return res.status(404).json({
        success: false,
        message: 'Tip no encontrado',
      });
    }

    if (tip.status === 'rejected') {
      return res.status(400).json({
        success: false,
        message: 'El tip ya está rechazado',
      });
    }

    await tip.reject(req.user.id, reason);
    await tip.populate('author', 'preferredName email');

    res.status(200).json({
      success: true,
      data: tip,
      message: `Tip "${tip.title}" rechazado`,
    });
  } catch (error) {
    console.error('Error in rejectTip:', error);
    next(error);
  }
};

/**
 * @desc    Update tip (admin)
 * @route   PUT /api/v1/admin/tips/:id
 * @access  Private/Admin
 */
export const updateTipAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;

    const tip = await Tip.findById(id);

    if (!tip) {
      return res.status(404).json({
        success: false,
        message: 'Tip no encontrado',
      });
    }

    // Actualizar campos
    if (title) tip.title = title;
    if (content) tip.content = content;
    if (category) tip.category = category;

    await tip.save();

    res.status(200).json({
      success: true,
      message: 'Tip actualizado exitosamente',
      data: tip,
    });
  } catch (error) {
    console.error('Error in updateTipAdmin:', error);
    next(error);
  }
};

/**
 * @desc    Delete tip (admin)
 * @route   DELETE /api/v1/admin/tips/:id
 * @access  Private/Admin
 */
export const deleteTipAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tip = await Tip.findById(id);

    if (!tip) {
      return res.status(404).json({
        success: false,
        message: 'Tip no encontrado',
      });
    }

    await tip.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Tip eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error in deleteTipAdmin:', error);
    next(error);
  }
};

/**
 * @desc    Get tip statistics
 * @route   GET /api/v1/admin/tips/stats
 * @access  Private/Admin
 */
export const getTipStats = async (req, res, next) => {
  try {
    const stats = await Tip.getStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error in getTipStats:', error);
    next(error);
  }
};

export default {
  getAllTipsAdmin,
  getPendingTips,
  approveTip,
  rejectTip,
  updateTipAdmin,
  deleteTipAdmin,
  getTipStats,
};
