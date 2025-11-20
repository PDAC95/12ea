import { useState } from 'react';
import { X, Calendar, Clock, MapPin, Link as LinkIcon, Users, Lightbulb, Loader2 } from 'lucide-react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../../../shared/utils/api';
import { useToast } from '../../../shared/context/ToastContext';

/**
 * ProposeEventModal - Modal para proponer eventos
 *
 * Features:
 * - Formulario con campos: title, description, date, time, mode, location, link, capacity
 * - Validación con Yup
 * - Submit crea evento con status "pending"
 * - Loading state durante submit
 * - Validaciones condicionales (location para presencial, link para virtual)
 * - Modal responsive
 *
 * Sprint 5 - US-5.10: User Submission Workflows
 * Task 5.10.1 - Crear Modal de Proponer Evento
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Estado del modal
 * @param {Function} props.onClose - Handler para cerrar modal
 * @returns {JSX.Element} Modal de proponer evento
 */

// Schema de validación
const proposeEventSchema = yup.object({
  title: yup
    .string()
    .required('El título es requerido')
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(100, 'El título no puede exceder 100 caracteres'),
  description: yup
    .string()
    .required('La descripción es requerida')
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .max(1000, 'La descripción no puede exceder 1000 caracteres'),
  date: yup
    .date()
    .required('La fecha es requerida')
    .min(new Date(), 'La fecha debe ser futura')
    .typeError('Fecha inválida'),
  time: yup
    .string()
    .required('La hora es requerida')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)'),
  mode: yup
    .string()
    .required('La modalidad es requerida')
    .oneOf(['virtual', 'presencial', 'híbrido'], 'Modalidad inválida'),
  location: yup.string().when('mode', {
    is: (mode) => mode === 'presencial' || mode === 'híbrido',
    then: (schema) => schema.required('La ubicación es requerida para eventos presenciales o híbridos'),
    otherwise: (schema) => schema.notRequired(),
  }),
  link: yup.string().when('mode', {
    is: (mode) => mode === 'virtual' || mode === 'híbrido',
    then: (schema) =>
      schema
        .required('El link es requerido para eventos virtuales o híbridos')
        .url('El link debe ser una URL válida'),
    otherwise: (schema) => schema.notRequired(),
  }),
  capacity: yup
    .number()
    .required('La capacidad es requerida')
    .min(1, 'La capacidad mínima es 1 persona')
    .max(1000, 'La capacidad máxima es 1000 personas')
    .typeError('La capacidad debe ser un número'),
}).required();

const ProposeEventModal = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(proposeEventSchema),
    mode: 'onBlur',
  });

  // Watch mode para mostrar/ocultar campos condicionales
  const selectedMode = watch('mode');

  /**
   * Handler para cerrar modal
   */
  const handleClose = () => {
    reset();
    onClose();
  };

  /**
   * Handler para submit del formulario
   */
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Preparar datos para el backend
      const eventData = {
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        mode: data.mode,
        location: data.location || null,
        link: data.link || null,
        capacity: parseInt(data.capacity),
      };

      // Hacer request al backend
      const response = await api.post('/events/propose', eventData);

      // Mostrar mensaje de éxito
      showToast(
        response.data.message || 'Propuesta enviada exitosamente. Será revisada por un administrador.',
        'success'
      );

      // Cerrar modal y resetear form
      handleClose();
    } catch (error) {
      console.error('Error proposing event:', error);
      const errorMessage =
        error.response?.data?.message || 'Error al enviar la propuesta. Intenta de nuevo.';
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // No renderizar si no está abierto
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Proponer Evento</h2>
              <p className="text-sm text-white/80">Comparte tu idea con la comunidad</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Título */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Título del Evento *
            </label>
            <input
              {...register('title')}
              type="text"
              id="title"
              placeholder="Ej: Taller de Emprendimiento para Latinas"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              {...register('description')}
              id="description"
              rows={4}
              placeholder="Describe el evento: qué se hará, qué aprenderán, quién puede asistir..."
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Fecha y Hora */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fecha */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha *
              </label>
              <input
                {...register('date')}
                type="date"
                id="date"
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>

            {/* Hora */}
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Hora *
              </label>
              <input
                {...register('time')}
                type="time"
                id="time"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.time ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.time && (
                <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
              )}
            </div>
          </div>

          {/* Modalidad */}
          <div>
            <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-2">
              Modalidad *
            </label>
            <select
              {...register('mode')}
              id="mode"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.mode ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecciona una modalidad</option>
              <option value="virtual">Virtual</option>
              <option value="presencial">Presencial</option>
              <option value="híbrido">Híbrido (Virtual + Presencial)</option>
            </select>
            {errors.mode && (
              <p className="mt-1 text-sm text-red-600">{errors.mode.message}</p>
            )}
          </div>

          {/* Ubicación (condicional) */}
          {(selectedMode === 'presencial' || selectedMode === 'híbrido') && (
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Ubicación *
              </label>
              <input
                {...register('location')}
                type="text"
                id="location"
                placeholder="Ej: Toronto Public Library - 789 Yonge St"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>
          )}

          {/* Link (condicional) */}
          {(selectedMode === 'virtual' || selectedMode === 'híbrido') && (
            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
                <LinkIcon className="w-4 h-4 inline mr-1" />
                Link del Evento *
              </label>
              <input
                {...register('link')}
                type="url"
                id="link"
                placeholder="https://zoom.us/j/123456789"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.link ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.link && (
                <p className="mt-1 text-sm text-red-600">{errors.link.message}</p>
              )}
            </div>
          )}

          {/* Capacidad */}
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Capacidad Máxima *
            </label>
            <input
              {...register('capacity')}
              type="number"
              id="capacity"
              min="1"
              max="1000"
              placeholder="Ej: 50"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.capacity ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.capacity && (
              <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Número máximo de personas que pueden asistir (1-1000)
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Tu propuesta será revisada por un administrador antes de ser publicada. Te notificaremos cuando sea aprobada.
            </p>
          </div>

          {/* Footer con botones */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Propuesta'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ProposeEventModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ProposeEventModal;
