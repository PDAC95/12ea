import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

/**
 * LoginPage - Página de inicio de sesión
 * Contiene el formulario de login con layout completo
 */
const LoginPage = () => {
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
              Bienvenida de Vuelta
            </h1>
            <p className="text-gray-600">
              Inicia sesión para conectar con tu comunidad
            </p>
          </div>

          {/* Login Form Component */}
          <LoginForm />

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                ¿No tienes cuenta?
              </span>
            </div>
          </div>

          {/* Link to Register */}
          <div className="text-center">
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition"
            >
              Regístrate Ahora
            </Link>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Entre Amigas es un espacio seguro y acogedor donde puedes conectar con mujeres
          que comparten tus experiencias.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
