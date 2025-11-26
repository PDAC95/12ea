import express from 'express';

const router = express.Router();

// Ruta de prueba
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Entre Amigas v1.0',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      upload: '/api/v1/upload',
      auth: '/api/v1/auth',
      businesses: '/api/v1/businesses ✅',
      services: '/api/v1/services ✅',
      users: '/api/v1/users ✅ (Profile endpoints)',
      events: '/api/v1/events ✅',
      blog: '/api/v1/blog ✅',
      adminStats: '/api/v1/admin/stats ✅ (Admin only)',
      adminEvents: '/api/v1/admin/events ✅ (Admin only)',
      adminBlog: '/api/v1/admin/blog ✅ (Admin only)',
      adminBusiness: '/api/v1/admin/businesses ✅ (Admin only)',
      adminServices: '/api/v1/admin/services ✅ (Admin only)',
      adminUsers: '/api/v1/admin/users ✅ (Admin only)',
    },
  });
});

// Aquí se importarán las rutas de cada módulo
import uploadRoutes from './upload.routes.js';
import authRoutes from './auth.routes.js';
import businessRoutes from './business.routes.js';
import serviceRoutes from './service.routes.js';
import eventRoutes from './event.routes.js';
import blogRoutes from './blog.routes.js';
import adminRoutes from './admin.routes.js';
import adminEventsRoutes from './admin.events.routes.js';
import adminBlogRoutes from './admin.blog.routes.js';
import adminBusinessRoutes from './admin.business.routes.js';
import adminServiceRoutes from './admin.service.routes.js';
import adminUserRoutes from './admin.user.routes.js';
import userRoutes from './user.routes.js';

// Rutas de upload (AWS S3)
router.use('/upload', uploadRoutes);

// Rutas de autenticación
router.use('/auth', authRoutes);

// Rutas de negocios
router.use('/businesses', businessRoutes);

// Rutas de servicios
router.use('/services', serviceRoutes);

// Rutas de eventos
router.use('/events', eventRoutes);

// Rutas de blog
router.use('/blog', blogRoutes);

// Rutas de administración - General (Stats)
router.use('/admin', adminRoutes);

// Rutas de administración - Eventos
router.use('/admin/events', adminEventsRoutes);

// Rutas de administración - Blog
router.use('/admin/blog', adminBlogRoutes);

// Rutas de administración - Negocios
router.use('/admin/businesses', adminBusinessRoutes);

// Rutas de administración - Servicios
router.use('/admin/services', adminServiceRoutes);

// Rutas de administración - Usuarios
router.use('/admin/users', adminUserRoutes);

// Rutas de usuarios
router.use('/users', userRoutes);

export default router;
