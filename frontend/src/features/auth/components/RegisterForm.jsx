import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import authService from '../services/authService';

/**
 * Schema de validación con Yup para el formulario de registro
 */
const registerSchema = yup.object({
  fullName: yup
    .string()
    .required('El nombre completo es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),

  preferredName: yup
    .string()
    .required('El nombre preferido es requerido')
    .min(2, 'El nombre preferido debe tener al menos 2 caracteres')
    .max(50, 'El nombre preferido no puede tener más de 50 caracteres'),

  email: yup
    .string()
    .required('El email es requerido')
    .email('El email no es válido')
    .lowercase()
    .trim(),

  phone: yup
    .string()
    .required('El teléfono es requerido')
    .matches(/^[\d\s\-\+\(\)]+$/, 'El teléfono solo puede contener números, espacios y símbolos (+, -, (, ))'),

  birthday: yup
    .date()
    .required('La fecha de nacimiento es requerida')
    .max(new Date(), 'La fecha de nacimiento no puede ser en el futuro')
    .test('age', 'Debes tener al menos 18 años', function (value) {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
      }
      return age >= 18;
    }),

  city: yup
    .string()
    .required('La ciudad es requerida')
    .min(2, 'La ciudad debe tener al menos 2 caracteres'),

  password: yup
    .string()
    .required('La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    ),

  confirmPassword: yup
    .string()
    .required('La confirmación de contraseña es requerida')
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
});

/**
 * RegisterForm - Formulario de registro de usuarios
 * Usa React Hook Form + Yup para validaciones
 */
const RegisterForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: 'onBlur', // Validar al perder el foco
  });

  /**
   * Maneja el envío del formulario
   */
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      await authService.register(data);
      setSubmitSuccess(true);
      reset(); // Limpiar formulario
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si el registro fue exitoso, mostrar mensaje de éxito
  if (submitSuccess) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h3 className="text-xl font-semibold text-green-900 mb-2">
            ¡Registro Exitoso!
          </h3>
          <p className="text-green-700 mb-4">
            Revisa tu email para verificar tu cuenta antes de iniciar sesión.
          </p>
          <p className="text-sm text-green-600">
            Si no recibes el email en unos minutos, revisa tu carpeta de spam.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto space-y-4">
      {/* Mensaje de error general */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{submitError}</p>
        </div>
      )}

      {/* Nombre Completo */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre Completo *
        </label>
        <input
          {...register('fullName')}
          type="text"
          id="fullName"
          className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
            errors.fullName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="María García López"
          disabled={isSubmitting}
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      {/* Nombre Preferido */}
      <div>
        <label htmlFor="preferredName" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre Preferido *
        </label>
        <input
          {...register('preferredName')}
          type="text"
          id="preferredName"
          className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
            errors.preferredName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Mary"
          disabled={isSubmitting}
        />
        {errors.preferredName && (
          <p className="mt-1 text-sm text-red-600">{errors.preferredName.message}</p>
        )}
      </div>

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
          placeholder="maria@ejemplo.com"
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Teléfono */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Teléfono *
        </label>
        <input
          {...register('phone')}
          type="tel"
          id="phone"
          className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="+1 (123) 456-7890"
          disabled={isSubmitting}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      {/* Fecha de Nacimiento */}
      <div>
        <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-1">
          Fecha de Nacimiento *
        </label>
        <input
          {...register('birthday')}
          type="date"
          id="birthday"
          className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
            errors.birthday ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
        />
        {errors.birthday && (
          <p className="mt-1 text-sm text-red-600">{errors.birthday.message}</p>
        )}
      </div>

      {/* Ciudad */}
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
          Ciudad *
        </label>
        <select
          {...register('city')}
          id="city"
          className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
            errors.city ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
        >
          <option value="">Selecciona tu ciudad</option>
          <option value="Kitchener/Waterloo">Kitchener/Waterloo</option>
          <option value="Cambridge">Cambridge</option>
          <option value="Guelph">Guelph</option>
          <option value="Otra">Otra</option>
        </select>
        {errors.city && (
          <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
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
        <p className="mt-1 text-xs text-gray-500">
          Mínimo 8 caracteres, incluyendo mayúscula, minúscula y número
        </p>
      </div>

      {/* Confirmar Contraseña */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirmar Contraseña *
        </label>
        <div className="relative">
          <input
            {...register('confirmPassword')}
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            className={`w-full px-4 py-2 pr-10 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="••••••••"
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
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
            Registrando...
          </>
        ) : (
          'Crear Cuenta'
        )}
      </button>

      {/* Divider */}
      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 flex-shrink text-sm text-gray-500">o regístrate con</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={() => {
          // Redirigir al backend para iniciar flujo de Google OAuth
          const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
          window.location.href = `${backendUrl}/auth/google`;
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

      {/* Texto legal */}
      <p className="text-xs text-gray-500 text-center">
        Al registrarte, aceptas nuestros Términos de Servicio y Política de Privacidad
      </p>
    </form>
  );
};

export default RegisterForm;
