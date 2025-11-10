import { Link } from 'react-router-dom';
import ResetPasswordForm from '../components/ResetPasswordForm';
import logo from '../../../assets/images/logo/logo.png';

/**
 * ResetPasswordPage - Página para restablecer contraseña con token
 *
 * Ruta: /reset-password/:token
 *
 * Features:
 * - Layout centrado profesional
 * - Incluye ResetPasswordForm (el form extrae el token internamente)
 * - Gradient background consistente
 * - Logo real de Entre Amigas
 * - Responsive mobile-first
 *
 * @returns {JSX.Element} Página de restablecimiento de contraseña
 */
const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-warm-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card Principal */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-soft-lg p-8 md:p-10">
          {/* Header con logo */}
          <div className="text-center mb-8">
            <img
              src={logo}
              alt="Entre Amigas"
              className="w-16 h-16 object-contain mx-auto mb-4"
            />
            <h1 className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-3">
              Nueva Contraseña
            </h1>
            <p className="text-gray-600 leading-relaxed">
              Ingresa tu nueva contraseña para tu cuenta
            </p>
          </div>

          {/* ResetPasswordForm Component */}
          <ResetPasswordForm />
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-600 mt-6 text-sm">
          ¿Recordaste tu contraseña?{' '}
          <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
