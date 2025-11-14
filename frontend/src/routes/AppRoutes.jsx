import { Routes, Route } from 'react-router-dom';

// Protected Route Components
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

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
import BusinessDirectoryPage from '../features/business/pages/BusinessDirectoryPage';
import ServiceDirectoryPage from '../features/services/pages/ServiceDirectoryPage';
import EventsPage from '../features/events/pages/EventsPage';
import MyEventsPage from '../features/events/pages/MyEventsPage';
import BlogPage from '../features/blog/pages/BlogPage';
import BlogPostPage from '../features/blog/pages/BlogPostPage';

// Admin Pages
import AdminLoginPage from '../features/admin/pages/AdminLoginPage';
import AdminDashboardPage from '../features/admin/pages/AdminDashboardPage';
import AdminBusinessesPage from '../features/admin/pages/AdminBusinessesPage';
import AdminEventsPage from '../features/admin/pages/AdminEventsPage';
import AdminBlogPage from '../features/admin/pages/AdminBlogPage';

// Common Pages
import NotFoundPage from '../shared/components/common/NotFoundPage';

/**
 * AppRoutes - Configuración central de rutas de la aplicación
 *
 * Rutas Públicas:
 * - / → LandingPage (placeholder)
 * - /register → RegisterPage
 * - /login → LoginPage (solo para users)
 * - /admin/login → AdminLoginPage (solo para admins)
 * - /verify-email/:token → VerifyEmailPage
 * - /forgot-password → ForgotPasswordPage
 * - /reset-password/:token → ResetPasswordPage
 *
 * Rutas Protegidas (requieren autenticación):
 * - /dashboard → DashboardPage
 * - /dashboard/businesses → BusinessDirectoryPage
 * - /dashboard/services → ServiceDirectoryPage
 * - /dashboard/events → EventsPage
 * - /dashboard/my-events → MyEventsPage
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

      {/* Admin Login - Sprint 3.5 FE-1 - PÚBLICA pero separada */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

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

      {/* Business Directory - Sprint 2 US-005 */}
      <Route
        path="/dashboard/businesses"
        element={
          <ProtectedRoute>
            <BusinessDirectoryPage />
          </ProtectedRoute>
        }
      />

      {/* Service Directory - Sprint 2 US-006 */}
      <Route
        path="/dashboard/services"
        element={
          <ProtectedRoute>
            <ServiceDirectoryPage />
          </ProtectedRoute>
        }
      />

      {/* Events - Sprint 3 US-004 */}
      <Route
        path="/dashboard/events"
        element={
          <ProtectedRoute>
            <EventsPage />
          </ProtectedRoute>
        }
      />

      {/* My Events - Sprint 3 US-004 */}
      <Route
        path="/dashboard/my-events"
        element={
          <ProtectedRoute>
            <MyEventsPage />
          </ProtectedRoute>
        }
      />

      {/* Blog - Sprint 3 US-007 */}
      <Route
        path="/dashboard/blog"
        element={
          <ProtectedRoute>
            <BlogPage />
          </ProtectedRoute>
        }
      />

      {/* Blog Post Detail - Sprint 3 US-007 Task 7.4 */}
      <Route
        path="/dashboard/blog/:slug"
        element={
          <ProtectedRoute>
            <BlogPostPage />
          </ProtectedRoute>
        }
      />

      {/* ============================================
          RUTAS ADMIN - Solo para usuarios con role='admin'
          ============================================ */}

      {/* Admin Dashboard - Sprint 3 US-009 Task 9.4 */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }
      />

      {/* Admin Businesses - Sprint 3 US-009 Task 9.7 */}
      <Route
        path="/admin/businesses"
        element={
          <AdminRoute>
            <AdminBusinessesPage />
          </AdminRoute>
        }
      />

      {/* Admin Events - Sprint 4 Task 8.4 Testing */}
      <Route
        path="/admin/events"
        element={
          <AdminRoute>
            <AdminEventsPage />
          </AdminRoute>
        }
      />

      {/* Admin Blog - Sprint 4 Task 10.7 */}
      <Route
        path="/admin/blog"
        element={
          <AdminRoute>
            <AdminBlogPage />
          </AdminRoute>
        }
      />

      {/* TODO: Agregar más rutas admin en futuras tasks:
          - /admin/services → AdminServicesPage
          - /admin/users → AdminUsersPage
      */}

      {/* TODO: Agregar más rutas protegidas en futuros sprints:
          - /events/:id → EventDetailPage
          - /businesses/:id → BusinessDetailPage
          - /profile → ProfilePage
      */}

      {/* ============================================
          RUTA 404 - Debe estar al final
          ============================================ */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
