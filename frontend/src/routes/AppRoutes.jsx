import { Routes, Route } from 'react-router-dom';

// Protected Route Component
import ProtectedRoute from './ProtectedRoute';

// Public Pages - Landing
import LandingPage from '../features/landing/pages/LandingPage';

// Public Pages - Auth
import RegisterPage from '../features/auth/pages/RegisterPage';
import LoginPage from '../features/auth/pages/LoginPage';
import VerifyEmailPage from '../features/auth/pages/VerifyEmailPage';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '../features/auth/pages/ResetPasswordPage';
import GoogleCallbackPage from '../features/auth/pages/GoogleCallbackPage';
import CompleteProfilePage from '../features/auth/pages/CompleteProfilePage';

// Protected Pages
import DashboardPage from '../features/dashboard/pages/DashboardPage';

// Common Pages
import NotFoundPage from '../shared/components/common/NotFoundPage';

/**
 * AppRoutes - Configuración central de rutas de la aplicación
 *
 * Rutas Públicas:
 * - / → LandingPage (placeholder)
 * - /register → RegisterPage
 * - /login → LoginPage
 * - /verify-email/:token → VerifyEmailPage
 * - /forgot-password → ForgotPasswordPage
 * - /reset-password/:token → ResetPasswordPage
 *
 * Rutas Protegidas (requieren autenticación):
 * - /dashboard → DashboardPage
 *
 * Ruta de Error:
 * - * → NotFoundPage (404)
 *
 * Convenciones:
 * - Rutas protegidas envueltas en <ProtectedRoute>
 * - Todas las rutas usan React Router v6 syntax
 * - 404 siempre al final
 *
 * @returns {JSX.Element} Configuración de rutas
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* ============================================
          RUTAS PÚBLICAS - No requieren autenticación
          ============================================ */}

      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Pages */}
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/auth/callback" element={<GoogleCallbackPage />} />
      <Route path="/complete-profile" element={<CompleteProfilePage />} />

      {/* ============================================
          RUTAS PROTEGIDAS - Requieren autenticación
          ============================================ */}

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* TODO: Agregar más rutas protegidas en futuros sprints:
          - /events → EventsPage
          - /events/:id → EventDetailPage
          - /businesses → BusinessDirectoryPage
          - /businesses/:id → BusinessDetailPage
          - /blog → BlogPage
          - /blog/:slug → BlogPostPage
          - /profile → ProfilePage
          - /admin → AdminPage (solo admin)
      */}

      {/* ============================================
          RUTA 404 - Debe estar al final
          ============================================ */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
