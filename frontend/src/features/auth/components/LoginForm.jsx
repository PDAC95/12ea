import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../../../shared/config/constants';

/**
 * Schema de validación con Yup para el formulario de login
 */
const loginSchema = yup.object({
  email: yup
    .string()
    .required('El email es requerido')
    .email('El email no es válido')
    .lowercase()
    .trim(),

  password: yup
    .string()
    .required('La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),

  rememberMe: yup.boolean(),
});

/**
 * LoginForm - Formulario de inicio de sesión
 * Usa React Hook Form + Yup para validaciones
 */
const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur', // Validar al perder el foco
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  /**
   * Maneja el envío del formulario
   * POST a /api/v1/auth/login (solo para users, NO admins)
   */
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Llamar al servicio de autenticación (POST /auth/login)
      const response = await authService.login(data.email, data.password, data.rememberMe);
      const { token, user } = response.data;

      // Guardar token y usuario en contexto (localStorage + state)
      login(token, user);

      // Redirigir al dashboard de usuaria
      navigate('/dashboard');
    } catch (error) {
      // Manejar diferentes tipos de errores del backend
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error?.message;

        // Error 403 - Usuario es admin (debe usar /admin/login)
        if (status === 403) {
          setSubmitError(
            'Parece que tienes una cuenta de administradora. Por favor usa el panel de administración.'
          );
        }
        // Error 429 - Rate limit (demasiados intentos)
        else if (status === 429) {
          setSubmitError(
            message || 'Demasiados intentos de login. Por favor intenta en 15 minutos.'
          );
        }
        // Error 401 - Credenciales inválidas
        else if (status === 401) {
          setSubmitError('Credenciales inválidas. Verifica tu email y contraseña.');
        }
        // Otros errores del servidor
        else {
          setSubmitError(message || error.message || 'Error al iniciar sesión');
        }
      } else {
        // Error de red o sin respuesta del servidor
        setSubmitError(error.message || 'No se pudo conectar con el servidor');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto space-y-4">
      {/* Mensaje de error general */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{submitError}</p>
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="tu@email.com"
          disabled={isSubmitting}
          autoComplete="email"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Contraseña */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña *
        </label>
        <div className="relative">
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            id="password"
            className={`w-full px-4 py-2 pr-10 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="••••••••"
            disabled={isSubmitting}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Recordarme y Olvidaste tu contraseña */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            {...register('rememberMe')}
            type="checkbox"
            id="rememberMe"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
            disabled={isSubmitting}
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700 cursor-pointer">
            Recordarme <span className="text-xs text-gray-500">(mantener sesión por 30 días)</span>
          </label>
        </div>

        <a
          href="/forgot-password"
          className="text-sm text-primary-600 hover:text-primary-700 hover:underline transition"
        >
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      {/* Botón Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-soft-lg focus:ring-4 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 flex items-center justify-center"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin mr-2" size={20} />
            Iniciando sesión...
          </>
        ) : (
          'Iniciar Sesión'
        )}
      </button>

      {/* Divider */}
      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 flex-shrink text-sm text-gray-500">o continúa con</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={() => {
          window.location.href = `${API_URL}/auth/google`;
        }}
        className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 hover:border-primary-300 hover:shadow-soft transition-all duration-300 flex items-center justify-center gap-3"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continuar con Google
      </button>
    </form>
  );
};

export default LoginForm;
