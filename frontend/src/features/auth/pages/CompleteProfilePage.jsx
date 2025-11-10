import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Loader2, UserCircle, Phone, Calendar, MapPin } from 'lucide-react';
import { updateProfile } from '../services/authService';
import { useAuth } from '../context/AuthContext';

/**
 * Esquema de validación para completar perfil
 */
const completeProfileSchema = yup.object({
  phone: yup
    .string()
    .required('El teléfono es requerido')
    .matches(
      /^[\d\s\-\+\(\)]+$/,
      'El teléfono solo puede contener números, espacios, guiones, paréntesis y signo +'
    )
    .min(10, 'El teléfono debe tener al menos 10 caracteres')
    .max(15, 'El teléfono no puede exceder 15 caracteres'),
  birthday: yup
    .date()
    .required('La fecha de nacimiento es requerida')
    .max(new Date(), 'La fecha de nacimiento no puede ser futura')
    .test('age', 'Debes tener al menos 18 años', function (value) {
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
    .min(2, 'La ciudad debe tener al menos 2 caracteres')
    .max(50, 'La ciudad no puede exceder 50 caracteres')
    .matches(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s,\-\.\/]+$/,
      'La ciudad solo puede contener letras, espacios y caracteres de puntuación básicos'
    ),
});

/**
 * CompleteProfilePage - Formulario para completar datos faltantes después de Google OAuth
 */
const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(completeProfileSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError('');

    try {
      // Formatear fecha a YYYY-MM-DD
      const formattedData = {
        phone: data.phone.trim(),
        birthday: data.birthday,
        city: data.city.trim(),
      };

      const response = await updateProfile(formattedData);

      // Actualizar usuario en AuthContext
      if (response.data && response.data.user) {
        updateUser(response.data.user);
        console.log('✅ Perfil actualizado en AuthContext');
      }

      // Redirigir al dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('❌ Error al completar perfil:', err);
      setError(err.message || 'Error al actualizar perfil. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white p-4">
      <div className="bg-white rounded-2xl shadow-soft-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCircle className="w-10 h-10 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Completa tu Perfil
          </h1>
          <p className="text-gray-600">
            Solo necesitamos algunos datos más para continuar
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="flex items-center text-sm font-medium text-gray-700 mb-2"
            >
              <Phone className="w-4 h-4 mr-2 text-primary-600" />
              Teléfono
            </label>
            <input
              type="tel"
              id="phone"
              {...register('phone')}
              placeholder="+1 (519) 123-4567"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                errors.phone
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 hover:border-primary-400'
              }`}
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          {/* Birthday */}
          <div>
            <label
              htmlFor="birthday"
              className="flex items-center text-sm font-medium text-gray-700 mb-2"
            >
              <Calendar className="w-4 h-4 mr-2 text-primary-600" />
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              id="birthday"
              {...register('birthday')}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                errors.birthday
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 hover:border-primary-400'
              }`}
              disabled={isSubmitting}
            />
            {errors.birthday && (
              <p className="mt-1 text-sm text-red-600">{errors.birthday.message}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="flex items-center text-sm font-medium text-gray-700 mb-2"
            >
              <MapPin className="w-4 h-4 mr-2 text-primary-600" />
              Ciudad
            </label>
            <select
              id="city"
              {...register('city')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                errors.city
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 hover:border-primary-400'
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              'Completar Perfil'
            )}
          </button>
        </form>

        {/* Skip Option */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/dashboard', { replace: true })}
            disabled={isSubmitting}
            className="text-sm text-gray-600 hover:text-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Completar después
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
