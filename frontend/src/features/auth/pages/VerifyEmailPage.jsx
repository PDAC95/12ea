import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import authService from '../services/authService';
import logo from '../../../assets/images/logo/logo.png';

/**
 * VerifyEmailPage - Página de verificación de email
 * Verifica el email del usuario usando el token de la URL
 */
const VerifyEmailPage = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await authService.verifyEmail(token);
        setStatus('success');
        setMessage(
          response.message || 'Email verificado exitosamente. Ya puedes iniciar sesión.'
        );
      } catch (error) {
        setStatus('error');
        setMessage(error.message);
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('Token de verificación no encontrado en la URL');
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-warm-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-soft-lg p-8 md:p-10">
          {/* Header con logo */}
          <div className="text-center mb-8">
            <img
              src={logo}
              alt="Entre Amigas"
              className="w-16 h-16 object-contain mx-auto mb-4"
            />
            <h1 className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
              Verificación de Email
            </h1>
          </div>

          {/* Loading State */}
          {status === 'loading' && (
            <div className="text-center py-8">
              <Loader2 className="animate-spin mx-auto mb-4 text-primary-600" size={48} />
              <p className="text-gray-600 text-lg font-medium">
                Verificando tu email...
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Por favor espera un momento
              </p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto mb-4 text-green-600" size={64} />
              <h2 className="text-2xl font-display font-bold text-green-900 mb-3">
                ¡Verificación Exitosa!
              </h2>
              <p className="text-green-700 mb-6">
                {message}
              </p>
              <Link
                to="/login"
                className="inline-block w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-soft-lg transition-all duration-300 hover:scale-105"
              >
                Iniciar Sesión
              </Link>
              <p className="text-sm text-gray-500 mt-4">
                Ya puedes acceder a tu cuenta y comenzar a conectar con la comunidad
              </p>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="text-center py-8">
              <XCircle className="mx-auto mb-4 text-red-600" size={64} />
              <h2 className="text-2xl font-display font-bold text-red-900 mb-3">
                Error de Verificación
              </h2>
              <p className="text-red-700 mb-6">
                {message}
              </p>

              {/* Posibles acciones según el error */}
              <div className="space-y-3">
                {/* Siempre mostrar link a login */}
                <Link
                  to="/login"
                  className="block w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-soft-lg transition-all duration-300 hover:scale-105"
                >
                  Ir a Iniciar Sesión
                </Link>

                {/* Link a registro si el token expiró */}
                {(message.includes('expiró') || message.includes('expirado') || message.includes('expired')) && (
                  <Link
                    to="/register"
                    className="block w-full bg-white border-2 border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:border-primary-300 hover:bg-primary-50 transition-all duration-300"
                  >
                    Crear Nueva Cuenta
                  </Link>
                )}
              </div>

              <p className="text-sm text-gray-500 mt-4">
                Si necesitas ayuda, contáctanos a soporte@entreamigas.com
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <p className="text-center mt-6 text-sm text-gray-600">
          ¿Problemas con la verificación?{' '}
          <a
            href="mailto:soporte@entreamigas.com"
            className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            Contáctanos
          </a>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
