import { Link } from 'react-router-dom';
import ForgotPasswordForm from '../components/ForgotPasswordForm';

/**
 * ForgotPasswordPage - Página de recuperación de contraseña
 * Contiene el formulario para solicitar recuperación de contraseña
 */
const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header con logo placeholder */}
          <div className="text-center mb-8">
            <div className="inline-block w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">EA</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ¿Olvidaste tu Contraseña?
            </h1>
            <p className="text-gray-600">
              No te preocupes, te ayudaremos a recuperarla
            </p>
          </div>

          {/* Forgot Password Form Component */}
          <ForgotPasswordForm />
        </div>

        {/* Footer text */}
        <p className="text-center mt-6 text-sm text-gray-600">
          ¿Recordaste tu contraseña?{' '}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 hover:underline transition"
          >
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
