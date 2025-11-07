import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';

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
   */
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Llamar al servicio de autenticación
      const response = await authService.login(data.email, data.password);
      const { token, user } = response.data;

      // Guardar token y usuario en contexto (localStorage + state)
      login(token, user);

      // Redirigir al dashboard
      navigate('/dashboard');
    } catch (error) {
      setSubmitError(error.message);
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
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
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
            className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
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
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            disabled={isSubmitting}
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700 cursor-pointer">
            Recordarme
          </label>
        </div>

        <a
          href="/forgot-password"
          className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition"
        >
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      {/* Botón Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
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
    </form>
  );
};

export default LoginForm;
