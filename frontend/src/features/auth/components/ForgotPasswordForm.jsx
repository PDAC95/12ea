import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Loader2, CheckCircle } from 'lucide-react';
import authService from '../services/authService';

/**
 * Schema de validación con Yup para el formulario de recuperación de contraseña
 */
const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .required('El email es requerido')
    .email('El email no es válido')
    .lowercase()
    .trim(),
});

/**
 * ForgotPasswordForm - Formulario para solicitar recuperación de contraseña
 * Usa React Hook Form + Yup para validaciones
 */
const ForgotPasswordForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onBlur',
  });

  /**
   * Maneja el envío del formulario
   */
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const response = await authService.forgotPassword(data.email);
      setSubmitSuccess(true);
      reset(); // Limpiar formulario
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si la solicitud fue exitosa, mostrar mensaje de éxito
  if (submitSuccess) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <CheckCircle className="mx-auto text-green-600 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-green-900 mb-2">
            ¡Email Enviado!
          </h3>
          <p className="text-green-700 mb-4">
            Si el email existe en nuestro sistema, recibirás instrucciones para
            restablecer tu contraseña.
          </p>
          <p className="text-sm text-green-600">
            Revisa tu bandeja de entrada y también la carpeta de spam.
          </p>
          <div className="mt-6">
            <a
              href="/login"
              className="inline-block w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Volver al Inicio de Sesión
            </a>
          </div>
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

      {/* Instrucciones */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-700 text-sm">
          Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña.
        </p>
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
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="tu@email.com"
          disabled={isSubmitting}
          autoComplete="email"
          autoFocus
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
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
            Enviando...
          </>
        ) : (
          'Enviar Instrucciones'
        )}
      </button>

      {/* Link de regreso a login */}
      <div className="text-center">
        <a
          href="/login"
          className="text-sm text-gray-600 hover:text-gray-900 hover:underline transition"
        >
          Volver al Inicio de Sesión
        </a>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
