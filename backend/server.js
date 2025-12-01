import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import connectDB from './src/config/database.js';
import routes from './src/routes/index.js';
import errorHandler from './src/middleware/errorHandler.js';
import './src/config/passport.js'; // Configuración de Passport OAuth

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();

// Conectar a MongoDB
connectDB();

// Middleware de seguridad
app.use(helmet());

// CORS - Acepta cualquier puerto localhost en desarrollo
app.use(cors({
  origin: process.env.NODE_ENV === 'development'
    ? /http:\/\/localhost:\d+/  // Acepta cualquier puerto localhost en dev
    : process.env.CORS_ORIGIN,
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Passport initialization (OAuth)
app.use(passport.initialize());

// Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 requests por ventana
  message: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
  // Excluir rutas de admin del rate limiting (ya están protegidas por autenticación)
  skip: (req) => req.url.startsWith('/v1/admin'),
});

app.use('/api/', limiter);

// Servir archivos estáticos (uploads - modo desarrollo)
app.use('/uploads', express.static('uploads'));

// Ruta de health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Rutas de la API
app.use('/api/v1', routes);

// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

// Error handler (debe ser el último middleware)
app.use(errorHandler);

// Puerto
const PORT = process.env.PORT || 5000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en modo ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api/v1`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health\n`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  // En producción, cerrar el servidor gracefully
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1);
});
