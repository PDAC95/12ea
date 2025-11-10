import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import RegisterForm from '../components/RegisterForm';
import logo from '../../../assets/images/logo/logo.png';

/**
 * RegisterPage - Página de registro con diseño moderno y femenino
 *
 * Features:
 * - Diseño moderno con gradientes suaves
 * - Layout responsive y accesible
 * - Integración con RegisterForm
 * - Links a otras páginas
 *
 * @returns {JSX.Element} Página de registro
 */
const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-warm-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card Principal */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-soft-lg p-8 md:p-10">
          {/* Logo y Badge */}
          <div className="flex flex-col items-center mb-8">
            <img
              src={logo}
              alt="Entre Amigas"
              className="w-16 h-16 object-contain mb-4"
            />

            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5 text-primary-500" />
              <span className="text-xs font-medium text-primary-700">Gratis para siempre</span>
            </div>
          </div>

          {/* Título y Descripción */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-3">
              Únete a Entre Amigas
            </h1>
            <p className="text-gray-600 leading-relaxed">
              Crea tu cuenta y conecta con tu comunidad
            </p>
          </div>

          {/* RegisterForm */}
          <RegisterForm />
        </div>

        {/* Link a Login */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link
              to="/login"
              className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              Inicia Sesión
            </Link>
          </p>
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Juntas somos más fuertes 💜
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
