import BlogPost from '../models/BlogPost.js';
import { BLOG_CATEGORIES, getCategoriesForSelect } from '../constants/blog.js';

/**
 * Blog Controller - Entre Amigas
 * Controlador para gestión de artículos del blog
 */

// =====================================
// PUBLIC ENDPOINTS
// =====================================

/**
 * @desc    Get all blog categories
 * @route   GET /api/v1/blog/categories
 * @access  Public
 */
export const getCategories = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        categories: BLOG_CATEGORIES,
        categoriesForSelect: getCategoriesForSelect(),
      },
      message: 'Categorías de blog obtenidas exitosamente',
    });
  } catch (error) {
    console.error('Error al obtener categorías de blog:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error al obtener categorías de blog',
      },
    });
  }
};

/**
 * @desc    Get all published blog posts
 * @route   GET /api/v1/blog
 * @access  Public
 * @params  ?category=Wellness|Amistad|Amor Propio|Migración|Consejos|Historias
 *          ?page=1
 *          ?limit=10
 *          ?featured=true
 *          ?search=keyword
 */
export const getAllBlogPosts = async (req, res, next) => {
  try {
    const {
      category,
      page = 1,
      limit = 10,
      featured,
      search,
    } = req.query;

    // Build query - solo artículos publicados
    const query = {
      status: 'published',
    };

    // Filter by category
    if (category && ['Wellness', 'Amistad', 'Amor Propio', 'Migración', 'Consejos', 'Historias'].includes(category)) {
      query.category = category;
    }

    // Filter by featured
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Search in title, excerpt, content, and tags (text search)
    if (search) {
      // Usar búsqueda de texto si está disponible
      query.$text = { $search: search };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = Math.min(parseInt(limit), 50); // Max 50 por página

    // Execute query
    const posts = search
      ? await BlogPost.find(query, { score: { $meta: 'textScore' } })
          .populate('author', 'preferredName profileImage')
          .select('-content -__v') // Excluir content completo para lista
          .sort({ score: { $meta: 'textScore' }, publishedAt: -1 })
          .limit(limitNum)
          .skip(skip)
      : await BlogPost.find(query)
          .populate('author', 'preferredName profileImage')
          .select('-content -__v') // Excluir content completo para lista
          .limit(limitNum)
          .skip(skip)
          .sort({ publishedAt: -1 }); // Ordenar por fecha de publicación descendente

    // Count total documents
    const total = await BlogPost.countDocuments(query);

    // Response
    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
        hasNext: skip + posts.length < total,
        hasPrev: parseInt(page) > 1,
      },
      filters: {
        category: category || 'all',
        featured: featured === 'true',
        search: search || null,
      },
      data: posts.map((post) => ({
        _id: post._id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage,
        category: post.category,
        tags: post.tags,
        author: post.author
          ? {
              _id: post.author._id,
              name: post.author.preferredName,
              profileImage: post.author.profileImage,
            }
          : null,
        publishedAt: post.publishedAt,
        readTime: post.readTime,
        views: post.views,
        isFeatured: post.isFeatured,
        url: post.getUrl(),
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Error in getAllBlogPosts:', error);
    next(error);
  }
};

/**
 * @desc    Get blog post by slug
 * @route   GET /api/v1/blog/:slug
 * @access  Public
 */
export const getBlogPostBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Find published post by slug
    const post = await BlogPost.findOne({ slug, status: 'published' })
      .populate('author', 'preferredName email profileImage bio');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado',
      });
    }

    // Increment views count
    await post.incrementViews();

    // Get related posts (same category)
    const relatedPosts = await BlogPost.findRelated(post._id, post.category, 3);

    // Response
    res.status(200).json({
      success: true,
      data: {
        _id: post._id,
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage,
        category: post.category,
        tags: post.tags,
        author: post.author
          ? {
              _id: post.author._id,
              name: post.author.preferredName,
              email: post.author.email,
              profileImage: post.author.profileImage,
              bio: post.author.bio,
            }
          : null,
        publishedAt: post.publishedAt,
        readTime: post.readTime,
        views: post.views,
        isFeatured: post.isFeatured,
        allowComments: post.allowComments,
        metaDescription: post.metaDescription,
        metaKeywords: post.metaKeywords,
        url: post.getUrl(),
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        // Related posts
        relatedPosts: relatedPosts.map((related) => ({
          _id: related._id,
          title: related.title,
          slug: related.slug,
          excerpt: related.excerpt,
          featuredImage: related.featuredImage,
          category: related.category,
          publishedAt: related.publishedAt,
          readTime: related.readTime,
          url: related.getUrl(),
        })),
      },
    });
  } catch (error) {
    console.error('Error in getBlogPostBySlug:', error);
    next(error);
  }
};

// =====================================
// ADMIN ENDPOINTS (Coming in future sprints)
// =====================================

/**
 * @desc    Create new blog post (Admin only)
 * @route   POST /api/v1/blog
 * @access  Private/Admin
 */
export const createBlogPost = async (req, res, next) => {
  try {
    const postData = {
      ...req.body,
      author: req.user.id, // Admin como autor
    };

    const post = await BlogPost.create(postData);

    res.status(201).json({
      success: true,
      message: 'Artículo creado exitosamente',
      data: post,
    });
  } catch (error) {
    console.error('Error in createBlogPost:', error);
    next(error);
  }
};

/**
 * @desc    Update blog post (Admin only)
 * @route   PUT /api/v1/blog/:slug
 * @access  Private/Admin
 */
export const updateBlogPost = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const post = await BlogPost.findOneAndUpdate(
      { slug },
      {
        ...req.body,
        lastEditedBy: req.user.id,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Artículo actualizado exitosamente',
      data: post,
    });
  } catch (error) {
    console.error('Error in updateBlogPost:', error);
    next(error);
  }
};

/**
 * @desc    Delete blog post (Admin only)
 * @route   DELETE /api/v1/blog/:slug
 * @access  Private/Admin
 */
export const deleteBlogPost = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const post = await BlogPost.findOneAndDelete({ slug });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Artículo eliminado exitosamente',
      data: null,
    });
  } catch (error) {
    console.error('Error in deleteBlogPost:', error);
    next(error);
  }
};

/**
 * @desc    Get blog statistics (Admin only)
 * @route   GET /api/v1/blog/stats
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
    console.error('Error in getBlogStats:', error);
    next(error);
  }
};
