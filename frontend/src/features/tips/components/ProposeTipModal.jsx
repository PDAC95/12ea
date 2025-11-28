import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, Loader2, Lightbulb } from 'lucide-react';
import { useToast } from '../../../shared/context/ToastContext';
import api from '../../../shared/utils/api';
import { TIP_CATEGORIES } from '../../../shared/constants/tipCategories';

/**
 * Validation Schema con Yup
 */
const proposeTipSchema = yup.object().shape({
  title: yup
    .string()
    .required('El título es requerido')
    .max(150, 'El título no puede exceder 150 caracteres')
    .trim(),
  category: yup
    .string()
    .required('La categoría es requerida')
    .oneOf(TIP_CATEGORIES, 'Categoría inválida'),
  content: yup
    .string()
    .required('El contenido es requerido')
    .min(100, 'El contenido debe tener al menos 100 caracteres')
    .max(2000, 'El contenido no puede exceder 2000 caracteres')
    .trim(),
});

/**
 * ProposeTipModal - Modal para proponer un tip comunitario
 *
 * Features:
 * - Form con React Hook Form + Yup validation
 * - Contador de caracteres en tiempo real
 * - Validación: title required max 150, category required, content min 100 max 2000
 * - Submit a POST /api/v1/tips/my/propose
 * - Loading states
 * - Toast notifications
 * - Responsive (fullscreen mobile, centered desktop)
 *
 * Sprint 5+ - Tips Comunitarios
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Estado del modal
 * @param {function} props.onClose - Callback para cerrar modal
 * @param {function} props.onSuccess - Callback después de submit exitoso
 * @returns {JSX.Element|null}
 */
const ProposeTipModal = ({ isOpen, onClose, onSuccess }) => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(proposeTipSchema),
    mode: 'onBlur',
  });

  // Watch para contadores de caracteres
  const titleValue = watch('title', '');
  const contentValue = watch('content', '');

  /**
   * Handler para cerrar modal y resetear form
   */
  const handleClose = () => {
    if (isSubmitting) return;
    reset();
    onClose();
  };

  /**
   * Handler para submit del form
   */
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      await api.post('/tips/my/propose', {
        title: data.title.trim(),
        category: data.category,
        content: data.content.trim(),
      });

      showToast('success', '¡Gracias! Tu tip será revisado por nuestro equipo');
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error proposing tip:', error);
      const errorMessage =
        error.response?.data?.error?.message ||
        'Error al enviar el tip. Intenta de nuevo';
      showToast('error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Bloquear scroll del body cuando modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-bold text-gray-900">
                Compartir Mi Tip
              </h2>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Título */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Título del Tip *
              </label>
              <input
                type="text"
                id="title"
                {...register('title')}
                disabled={isSubmitting}
                placeholder="Ej: Cómo conseguir tu primer trabajo en Canadá"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                } disabled:bg-gray-50 disabled:cursor-not-allowed`}
              />
              <div className="flex items-center justify-between mt-1">
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
                <p className={`text-xs ml-auto ${titleValue.length > 150 ? 'text-red-500' : 'text-gray-500'}`}>
                  {titleValue.length}/150
                </p>
              </div>
            </div>

            {/* Categoría */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                id="category"
                {...register('category')}
                disabled={isSubmitting}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                } disabled:bg-gray-50 disabled:cursor-not-allowed`}
              >
                <option value="">Selecciona una categoría</option>
                {TIP_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>

            {/* Contenido */}
            <div>
              <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
                Contenido del Tip *
              </label>
              <textarea
                id="content"
                {...register('content')}
                disabled={isSubmitting}
                rows={8}
                placeholder="Comparte tu experiencia, consejos prácticos, recursos útiles... Escribe al menos 100 caracteres."
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${
                  errors.content ? 'border-red-500' : 'border-gray-300'
                } disabled:bg-gray-50 disabled:cursor-not-allowed`}
              />
              <div className="flex items-center justify-between mt-1">
                {errors.content && (
                  <p className="text-red-500 text-sm">{errors.content.message}</p>
                )}
                <p className={`text-xs ml-auto ${
                  contentValue.length < 100
                    ? 'text-red-500'
                    : contentValue.length > 2000
                    ? 'text-red-500'
                    : 'text-gray-500'
                }`}>
                  {contentValue.length}/2000
                  {contentValue.length < 100 && ` (mínimo 100)`}
                </p>
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 <strong>Importante:</strong> Tu tip será revisado por nuestro equipo antes de ser publicado.
                Nos aseguraremos de que sea útil y relevante para la comunidad.
              </p>
            </div>

            {/* Footer - Botones */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-5 h-5" />
                    Compartir Tip
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

ProposeTipModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
};

export default ProposeTipModal;
