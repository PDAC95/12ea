import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import LoginForm from '../components/LoginForm';
import logo from '../../../assets/images/logo/logo.png';

/**
 * LoginPage - Página de inicio de sesión
 * Contiene el formulario de login con layout completo
 */
const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-warm-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card principal */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-soft-lg p-8 md:p-10">
          {/* Header con logo */}
          <div className="text-center mb-8">
            <img
              src={logo}
              alt="Entre Amigas"
              className="w-16 h-16 object-contain mx-auto mb-4"
            />
            <h1 className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-3">
              Bienvenida de Vuelta
            </h1>
            <p className="text-gray-600 leading-relaxed">
              Inicia sesión para conectar con tu comunidad
            </p>
          </div>

          {/* Login Form Component */}
          <LoginForm />

        </div>

        {/* Link to Register */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link
              to="/register"
              className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              Regístrate Ahora
            </Link>
          </p>
        </div>

        {/* Footer text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Juntas somos más fuertes 💜
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
