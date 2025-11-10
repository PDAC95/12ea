import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMe } from '../services/authService';

/**
 * GoogleCallbackPage - Página de callback de Google OAuth
 * Procesa el token JWT recibido y redirige al usuario
 */
const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState('loading'); // loading, success, error

  useEffect(() => {
    const processCallback = async () => {
      // Obtener parámetros de URL
      const token = searchParams.get('token');
      const needsProfile = searchParams.get('needsProfile') === 'true';
      const error = searchParams.get('error');

      // Si hay error, mostrar mensaje y redirigir a login
      if (error) {
        console.error('❌ Error en Google OAuth:', error);
        setStatus('error');
        setTimeout(() => {
          navigate('/login?error=' + error);
        }, 2000);
        return;
      }

      // Si no hay token, redirigir a login
      if (!token) {
        console.error('❌ No se recibió token de Google OAuth');
        setStatus('error');
        setTimeout(() => {
          navigate('/login?error=no_token');
        }, 2000);
        return;
      }

      try {
        // Guardar token temporalmente en localStorage para que la API pueda usarlo
        localStorage.setItem('token', token);
        console.log('✅ Token de Google OAuth guardado');

        // Obtener datos del usuario desde el backend
        const response = await getMe();
        const userData = response.data.user;
        console.log('✅ Datos de usuario obtenidos:', userData);

        // Guardar token y usuario en AuthContext (esto actualiza isAuthenticated)
        login(token, userData);

        setStatus('success');

        // Redirigir según si necesita completar perfil
        setTimeout(() => {
          if (needsProfile) {
            console.log('⚠️ Usuario necesita completar perfil (phone, birthday, city)');
            navigate('/complete-profile', { replace: true });
          } else {
            console.log('✅ Perfil completo, redirigiendo a dashboard');
            navigate('/dashboard', { replace: true });
          }
        }, 1500);
      } catch (err) {
        console.error('❌ Error al obtener datos del usuario:', err);
        setStatus('error');
        localStorage.removeItem('token');
        setTimeout(() => {
          navigate('/login?error=fetch_user_failed');
        }, 2000);
      }
    };

    processCallback();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white p-4">
      <div className="bg-white rounded-2xl shadow-soft-xl p-8 w-full max-w-md text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-primary-500 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Procesando autenticación...
            </h2>
            <p className="text-gray-600">
              Espera un momento mientras completamos tu registro.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ¡Autenticación exitosa!
            </h2>
            <p className="text-gray-600">
              Redirigiendo...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Error en la autenticación
            </h2>
            <p className="text-gray-600">
              Hubo un problema con tu autenticación de Google. Redirigiendo al login...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleCallbackPage;
