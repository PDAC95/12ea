import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

/**
 * NotFoundPage - Página 404 para rutas no encontradas
 *
 * Features:
 * - Mensaje amigable de error 404
 * - Links de navegación útiles
 * - Diseño responsive
 *
 * @returns {JSX.Element} Página 404
 */
const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="text-center">
        {/* 404 */}
        <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>

        {/* Mensaje */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Página No Encontrada
        </h2>
        <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            <Home className="w-5 h-5" />
            Ir al Inicio
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver Atrás
          </button>
        </div>

        {/* Footer */}
        <p className="mt-12 text-gray-500 text-sm">
          Si crees que esto es un error, por favor{' '}
          <a href="mailto:support@entreamigas.com" className="text-primary-600 hover:text-primary-700">
            contáctanos
          </a>
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
