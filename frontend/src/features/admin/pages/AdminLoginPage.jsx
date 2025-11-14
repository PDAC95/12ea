import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Eye, EyeOff, Loader2, Shield, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../../shared/utils/api';
import { useAuth } from '../../auth/context/AuthContext';
import logo from '../../../assets/images/logo/logo.png';

/**
 * Schema de validación con Yup para admin login
 */
const adminLoginSchema = yup.object({
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
});

/**
 * AdminLoginPage - Página de inicio de sesión para administradoras
 * Diseño visual DIFERENTE al login de usuarias (colores oscuros/corporativos)
 * POST a /api/v1/auth/admin/login
 */
const AdminLoginPage = () => {
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
    resolver: yupResolver(adminLoginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  /**
   * Maneja el envío del formulario de admin login
   * POST a /api/v1/auth/admin/login
   */
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // POST a endpoint de admin login
      const response = await api.post('/auth/admin/login', {
        email: data.email,
        password: data.password,
      });

      const { token, user } = response.data.data;

      // Verificar que sea admin (doble check frontend)
      if (user.role !== 'admin') {
        setSubmitError('Acceso denegado. Esta cuenta no tiene permisos de administrador.');
        return;
      }

      // Guardar token y usuario en contexto (localStorage + state)
      login(token, user);

      // Redirigir al dashboard de admin
      navigate('/admin');
    } catch (error) {
      // Manejar diferentes tipos de errores
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error?.message;

        // Error 403 - No es admin
        if (status === 403) {
          setSubmitError(
            message || 'Acceso denegado. Esta cuenta no tiene permisos de administrador.'
          );
        }
        // Error 429 - Rate limit
        else if (status === 429) {
          setSubmitError(
            message || 'Demasiados intentos de login. Por favor intenta en 15 minutos.'
          );
        }
        // Error 401 - Credenciales inválidas
        else if (status === 401) {
          setSubmitError('Credenciales inválidas');
        }
        // Otros errores
        else {
          setSubmitError(message || 'Error al iniciar sesión. Por favor intenta nuevamente.');
        }
      } else {
        setSubmitError('No se pudo conectar con el servidor. Verifica tu conexión.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card principal - diseño corporativo oscuro */}
        <div className="bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/50 p-8 md:p-10">
          {/* Header con shield icon y logo */}
          <div className="text-center mb-8">
            {/* Shield Badge */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>

            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
              Panel de Administración
            </h1>
            <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Acceso restringido solo para administradoras
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Mensaje de error general */}
            {submitError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm leading-relaxed">{submitError}</p>
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Corporativo *
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                className={`w-full px-4 py-3 bg-gray-900/50 border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.email ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="admin@entreamigas.com"
                disabled={isSubmitting}
                autoComplete="email"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña *
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className={`w-full px-4 py-3 pr-12 bg-gray-900/50 border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.password ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 px-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/20 focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Verificando acceso...
                </>
              ) : (
                <>
                  <Shield className="mr-2" size={20} />
                  Ingresar al Panel Admin
                </>
              )}
            </button>
          </form>

          {/* Separator */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-center text-sm text-gray-400">
              Si no eres administradora,{' '}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition"
              >
                ingresa aquí como usuaria
              </Link>
            </p>
          </div>
        </div>

        {/* Footer - Logo discreto */}
        <div className="mt-6 text-center">
          <img src={logo} alt="Entre Amigas" className="w-10 h-10 mx-auto opacity-40" />
          <p className="text-gray-500 text-xs mt-2">Sistema de Administración</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
