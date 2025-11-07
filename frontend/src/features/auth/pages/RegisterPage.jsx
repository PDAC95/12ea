import { Link } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

/**
 * RegisterPage - Página de registro de usuarios
 * Layout completo con título, formulario y links
 */
const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            {/* Logo placeholder - puedes reemplazar con tu logo */}
            <div className="inline-block w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">EA</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Únete a Entre Amigas
            </h1>
            <p className="text-gray-600">
              Crea tu cuenta y comienza a conectar con nuestra comunidad
            </p>
          </div>

          {/* Register Form */}
          <RegisterForm />

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                ¿Ya tienes cuenta?
              </span>
            </div>
          </div>

          {/* Link to Login */}
          <div className="text-center">
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition"
            >
              Inicia Sesión
            </Link>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Al registrarte, estás dando el primer paso para conectar con una comunidad
          de mujeres que te entienden y te apoyan.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
