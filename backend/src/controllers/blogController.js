import BlogPost from '../models/BlogPost.js';
import { generateUniqueSlug } from '../utils/slugify.js';

/**
 * @desc    Crear nuevo artículo de blog
 * @route   POST /api/v1/admin/blog
 * @access  Private/Admin
 */
export const createBlogPost = async (req, res, next) => {
  try {
    const {
      title,
      content,
      excerpt,
      featuredImage,
      category,
      tags,
      status,
      metaDescription,
      metaKeywords,
      isFeatured,
      allowComments,
    } = req.body;

    // Validaciones requeridas
    if (!title || !content || !excerpt || !featuredImage || !category) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: title, content, excerpt, featuredImage, category',
      });
    }

    // Generar slug único desde el título
    const slug = await generateUniqueSlug(title);

    // Crear artículo
    const blogPost = await BlogPost.create({
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      category,
      tags: tags || [],
      status: status || 'draft',
      metaDescription,
      metaKeywords: metaKeywords || [],
      isFeatured: isFeatured || false,
      allowComments: allowComments !== undefined ? allowComments : true,
      author: req.user.id, // Admin que lo crea
      lastEditedBy: req.user.id,
    });

    // Populate author
    await blogPost.populate('author', 'preferredName email profileImage');

    res.status(201).json({
      success: true,
      message: 'Artículo creado exitosamente',
      data: blogPost,
    });
  } catch (error) {
    console.error('Error en createBlogPost:', error);

    // Manejar error de validación de Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: messages,
      });
    }

    next(error);
  }
};

/**
 * @desc    Actualizar artículo de blog
 * @route   PUT /api/v1/admin/blog/:id
 * @access  Private/Admin
 */
export const updateBlogPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      excerpt,
      featuredImage,
      category,
      tags,
      status,
      metaDescription,
      metaKeywords,
      isFeatured,
      allowComments,
    } = req.body;

    // Buscar artículo
    const blogPost = await BlogPost.findById(id);

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado',
      });
    }

    // Si se cambia el título, regenerar slug
    if (title && title !== blogPost.title) {
      const newSlug = await generateUniqueSlug(title, id);
      blogPost.slug = newSlug;
      blogPost.title = title;
    }

    // Actualizar campos proporcionados
    if (content !== undefined) blogPost.content = content;
    if (excerpt !== undefined) blogPost.excerpt = excerpt;
    if (featuredImage !== undefined) blogPost.featuredImage = featuredImage;
    if (category !== undefined) blogPost.category = category;
    if (tags !== undefined) blogPost.tags = tags;
    if (status !== undefined) blogPost.status = status;
    if (metaDescription !== undefined) blogPost.metaDescription = metaDescription;
    if (metaKeywords !== undefined) blogPost.metaKeywords = metaKeywords;
    if (isFeatured !== undefined) blogPost.isFeatured = isFeatured;
    if (allowComments !== undefined) blogPost.allowComments = allowComments;

    // Actualizar metadata de edición
    blogPost.lastEditedBy = req.user.id;
    blogPost.lastEditedAt = new Date();

    // Guardar cambios
    await blogPost.save();

    // Populate author
    await blogPost.populate('author', 'preferredName email profileImage');
    await blogPost.populate('lastEditedBy', 'preferredName email');

    res.status(200).json({
      success: true,
      message: 'Artículo actualizado exitosamente',
      data: blogPost,
    });
  } catch (error) {
    console.error('Error en updateBlogPost:', error);

    // Manejar error de validación de Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: messages,
      });
    }

    next(error);
  }
};

/**
 * @desc    Publicar artículo (cambiar de draft a published)
 * @route   PATCH /api/v1/admin/blog/:id/publish
 * @access  Private/Admin
 */
export const publishBlogPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Buscar artículo
    const blogPost = await BlogPost.findById(id);

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado',
      });
    }

    // Verificar que no esté ya publicado
    if (blogPost.status === 'published') {
      return res.status(400).json({
        success: false,
        message: 'El artículo ya está publicado',
      });
    }

    // Publicar artículo (usa método del modelo)
    await blogPost.publish();

    // Actualizar metadata de edición
    blogPost.lastEditedBy = req.user.id;
    blogPost.lastEditedAt = new Date();
    await blogPost.save();

    // Populate author
    await blogPost.populate('author', 'preferredName email profileImage');

    res.status(200).json({
      success: true,
      message: 'Artículo publicado exitosamente',
      data: blogPost,
    });
  } catch (error) {
    console.error('Error en publishBlogPost:', error);
    next(error);
  }
};

/**
 * @desc    Despublicar artículo (cambiar de published a draft)
 * @route   PATCH /api/v1/admin/blog/:id/unpublish
 * @access  Private/Admin
 */
export const unpublishBlogPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Buscar artículo
    const blogPost = await BlogPost.findById(id);

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado',
      });
    }

    // Verificar que esté publicado
    if (blogPost.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'El artículo no está publicado',
      });
    }

    // Despublicar artículo
    await blogPost.unpublish();

    // Actualizar metadata de edición
    blogPost.lastEditedBy = req.user.id;
    blogPost.lastEditedAt = new Date();
    await blogPost.save();

    // Populate author
    await blogPost.populate('author', 'preferredName email profileImage');

    res.status(200).json({
      success: true,
      message: 'Artículo despublicado exitosamente',
      data: blogPost,
    });
  } catch (error) {
    console.error('Error en unpublishBlogPost:', error);
    next(error);
  }
};

/**
 * @desc    Eliminar artículo (soft delete - cambiar a archived)
 * @route   DELETE /api/v1/admin/blog/:id
 * @access  Private/Admin
 */
export const deleteBlogPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Buscar artículo
    const blogPost = await BlogPost.findById(id);

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado',
      });
    }

    // Eliminar permanentemente
    await blogPost.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Artículo eliminado exitosamente',
      data: { id: blogPost._id },
    });
  } catch (error) {
    console.error('Error en deleteBlogPost:', error);
    next(error);
  }
};

/**
 * @desc    Listar todos los artículos (incluye drafts para admin)
 * @route   GET /api/v1/admin/blog
 * @access  Private/Admin
 */
export const getAllBlogPosts = async (req, res, next) => {
  try {
    const {
      status = 'all',
      category,
      search,
      page = 1,
      limit = 20,
      sort = '-updatedAt',
    } = req.query;

    // Construir query
    const query = {};

    // Filtro por status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filtro por categoría
    if (category) {
      query.category = category;
    }

    // Búsqueda de texto
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Paginación
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Contar total
    const total = await BlogPost.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    // Buscar artículos
    const blogPosts = await BlogPost.find(query)
      .populate('author', 'preferredName email profileImage')
      .populate('lastEditedBy', 'preferredName email')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: blogPosts.length,
      total,
      page: pageNum,
      pages: totalPages,
      data: blogPosts,
    });
  } catch (error) {
    console.error('Error en getAllBlogPosts:', error);
    next(error);
  }
};

/**
 * @desc    Obtener artículo por ID (para edición en admin)
 * @route   GET /api/v1/admin/blog/:id
 * @access  Private/Admin
 */
export const getBlogPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blogPost = await BlogPost.findById(id)
      .populate('author', 'preferredName email profileImage')
      .populate('lastEditedBy', 'preferredName email');

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      data: blogPost,
    });
  } catch (error) {
    console.error('Error en getBlogPostById:', error);
    next(error);
  }
};

/**
 * @desc    Destacar/quitar destacado de artículo
 * @route   PATCH /api/v1/admin/blog/:id/feature
 * @access  Private/Admin
 */
export const toggleFeatureBlogPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { featured } = req.body;

    // Buscar artículo
    const blogPost = await BlogPost.findById(id);

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado',
      });
    }

    // Cambiar estado de destacado
    if (featured) {
      await blogPost.feature();
    } else {
      await blogPost.unfeature();
    }

    // Actualizar metadata de edición
    blogPost.lastEditedBy = req.user.id;
    blogPost.lastEditedAt = new Date();
    await blogPost.save();

    // Populate author
    await blogPost.populate('author', 'preferredName email profileImage');

    res.status(200).json({
      success: true,
      message: featured ? 'Artículo destacado' : 'Artículo no destacado',
      data: blogPost,
    });
  } catch (error) {
    console.error('Error en toggleFeatureBlogPost:', error);
    next(error);
  }
};

/**
 * @desc    Obtener estadísticas del blog
 * @route   GET /api/v1/admin/blog/stats
 * @access  Private/Admin
 */
export const getBlogStats = async (req, res, next) => {
  try {
    const stats = await BlogPost.getStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error en getBlogStats:', error);
    next(error);
  }
};
