import { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Calendar,
  Clock,
  MapPin,
  Link as LinkIcon,
  Users,
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import api from '../../../shared/utils/api';

/**
 * EventForm - Formulario reutilizable para crear y editar eventos
 * Task 8.4 - Sprint 4
 *
 * Modos:
 * - create: Crear nuevo evento
 * - edit: Editar evento existente
 *
 * Props:
 * @param {string} mode - 'create' o 'edit'
 * @param {object} initialData - Datos iniciales del evento (solo en modo edit)
 * @param {function} onSubmit - Callback al enviar el formulario
 * @param {function} onCancel - Callback al cancelar
 */

// =====================================
// SCHEMA DE VALIDACIÓN YUP
// =====================================

const eventSchema = yup.object({
  title: yup
    .string()
    .required('El título es requerido')
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(150, 'El título no puede exceder 150 caracteres')
    .trim(),

  description: yup
    .string()
    .required('La descripción es requerida')
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .max(2000, 'La descripción no puede exceder 2000 caracteres')
    .trim(),

  date: yup
    .date()
    .required('La fecha es requerida')
    .min(new Date(), 'La fecha debe ser futura')
    .typeError('Ingresa una fecha válida'),

  time: yup
    .string()
    .required('La hora es requerida')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'La hora debe estar en formato HH:MM (ej: 14:30)'),

  mode: yup
    .string()
    .required('La modalidad es requerida')
    .oneOf(['virtual', 'presencial', 'híbrido'], 'Selecciona una modalidad válida'),

  location: yup.string().when('mode', {
    is: (mode) => mode === 'presencial' || mode === 'híbrido',
    then: (schema) =>
      schema
        .required('La ubicación es requerida para eventos presenciales o híbridos')
        .max(200, 'La ubicación no puede exceder 200 caracteres')
        .trim(),
    otherwise: (schema) => schema.notRequired(),
  }),

  link: yup.string().when('mode', {
    is: (mode) => mode === 'virtual' || mode === 'híbrido',
    then: (schema) =>
      schema
        .required('El link es requerido para eventos virtuales o híbridos')
        .url('Ingresa una URL válida (ej: https://zoom.us/j/123456789)')
        .trim(),
    otherwise: (schema) => schema.notRequired(),
  }),

  capacity: yup
    .number()
    .required('La capacidad es requerida')
    .positive('La capacidad debe ser un número positivo')
    .integer('La capacidad debe ser un número entero')
    .min(1, 'La capacidad debe ser al menos 1 persona')
    .max(1000, 'La capacidad no puede exceder 1000 personas')
    .typeError('Ingresa un número válido'),

  category: yup.string().max(50, 'La categoría no puede exceder 50 caracteres').trim(),

  image: yup
    .string()
    .url('La imagen debe ser una URL válida')
    .nullable()
    .notRequired(),
});

// =====================================
// COMPONENTE PRINCIPAL
// =====================================

const EventForm = ({ mode = 'create', initialData = {}, onSubmit, onCancel }) => {
  // ===== ESTADO LOCAL =====
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState(initialData?.image || '');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const isEditMode = mode === 'edit';

  // ===== REACT HOOK FORM =====
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm({
    resolver: yupResolver(eventSchema),
    mode: 'onBlur',
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : '',
      time: initialData?.time || '',
      mode: initialData?.mode || '',
      location: initialData?.location || '',
      link: initialData?.link || '',
      capacity: initialData?.capacity || '',
      category: initialData?.category || '',
      image: initialData?.image || '',
    },
  });

  // Observar el valor de "mode" para validaciones condicionales
  const selectedMode = watch('mode');

  // ===== HANDLERS DE IMAGEN =====

  /**
   * Upload de imagen a S3 vía endpoint /api/upload/test
   */
  const uploadImage = async (file) => {
    setIsUploadingImage(true);
    setUploadError('');

    try {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen (JPG, PNG, GIF, etc.)');
      }

      // Validar tamaño (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('La imagen no puede exceder 5MB');
      }

      // Crear FormData
      const formData = new FormData();
      formData.append('image', file);

      // POST a /api/upload/test
      const response = await api.post('/upload/test', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = response.data.data.url;

      // Actualizar estado y formulario
      setImagePreview(imageUrl);
      setValue('image', imageUrl, { shouldValidate: true });
      setUploadError('');

      return imageUrl;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Error al subir la imagen';
      setUploadError(errorMessage);
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setIsUploadingImage(false);
    }
  };

  /**
   * Handler de cambio de archivo (input file)
   */
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadImage(file);
    } catch (error) {
      // Error ya manejado en uploadImage
    }
  };

  /**
   * Handler de drag & drop
   */
  const handleDrop = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (!file) return;

      try {
        await uploadImage(file);
      } catch (error) {
        // Error ya manejado en uploadImage
      }
    },
    [uploadImage]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  /**
   * Remover imagen
   */
  const handleRemoveImage = () => {
    setImagePreview('');
    setValue('image', '', { shouldValidate: true });
    setUploadError('');
  };

  // ===== HANDLER DE SUBMIT =====

  /**
   * Handler principal del formulario
   */
  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      // Transformar data para backend
      const formattedData = {
        ...data,
        mode: data.mode.toLowerCase(),
        date: new Date(data.date).toISOString(),
      };

      // Llamar al callback onSubmit pasado por el padre
      await onSubmit(formattedData);

      // Mostrar mensaje de éxito
      const successMessage = isEditMode
        ? 'Evento actualizado exitosamente'
        : 'Evento creado exitosamente';
      setSubmitSuccess(successMessage);

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSubmitSuccess('');
      }, 3000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Error al ${isEditMode ? 'actualizar' : 'crear'} el evento`;
      setSubmitError(errorMessage);
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===== RENDER =====

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Mensaje de Error General */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm">{submitError}</p>
          </div>
        </div>
      )}

      {/* Mensaje de Éxito */}
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800 text-sm">{submitSuccess}</p>
          </div>
        </div>
      )}

      {/* Título */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Título del Evento *
        </label>
        <input
          {...register('title')}
          type="text"
          id="title"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ej: Taller de Networking para Emprendedoras"
          disabled={isSubmitting}
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      {/* Descripción */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción *
        </label>
        <textarea
          {...register('description')}
          id="description"
          rows={5}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describe el evento, qué se tratará, qué aprenderán las participantes..."
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Fecha y Hora - Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fecha */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="w-4 h-4 inline mr-1" />
            Fecha *
          </label>
          <input
            {...register('date')}
            type="date"
            id="date"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
              errors.date ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
        </div>

        {/* Hora */}
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
            <Clock className="w-4 h-4 inline mr-1" />
            Hora *
          </label>
          <input
            {...register('time')}
            type="time"
            id="time"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
              errors.time ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>}
        </div>
      </div>

      {/* Modalidad */}
      <div>
        <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-1">
          Modalidad *
        </label>
        <select
          {...register('mode')}
          id="mode"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
            errors.mode ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
        >
          <option value="">Selecciona una modalidad</option>
          <option value="virtual">Virtual (online)</option>
          <option value="presencial">Presencial (in-person)</option>
          <option value="híbrido">Híbrido (ambos)</option>
        </select>
        {errors.mode && <p className="mt-1 text-sm text-red-600">{errors.mode.message}</p>}
      </div>

      {/* Ubicación (condicional) */}
      {(selectedMode === 'presencial' || selectedMode === 'híbrido') && (
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin className="w-4 h-4 inline mr-1" />
            Ubicación *
          </label>
          <input
            {...register('location')}
            type="text"
            id="location"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
              errors.location ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: 123 Main St, Toronto, ON M5A 1A1"
            disabled={isSubmitting}
          />
          {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
        </div>
      )}

      {/* Link (condicional) */}
      {(selectedMode === 'virtual' || selectedMode === 'híbrido') && (
        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
            <LinkIcon className="w-4 h-4 inline mr-1" />
            Link del Evento *
          </label>
          <input
            {...register('link')}
            type="url"
            id="link"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
              errors.link ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="https://zoom.us/j/123456789"
            disabled={isSubmitting}
          />
          {errors.link && <p className="mt-1 text-sm text-red-600">{errors.link.message}</p>}
        </div>
      )}

      {/* Capacidad y Categoría - Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Capacidad */}
        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
            <Users className="w-4 h-4 inline mr-1" />
            Capacidad *
          </label>
          <input
            {...register('capacity')}
            type="number"
            id="capacity"
            min="1"
            max="1000"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
              errors.capacity ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: 50"
            disabled={isSubmitting}
          />
          {errors.capacity && <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>}
        </div>

        {/* Categoría */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Categoría (opcional)
          </label>
          <input
            {...register('category')}
            type="text"
            id="category"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: Networking, Educación, Salud"
            disabled={isSubmitting}
          />
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
        </div>
      </div>

      {/* Upload de Imagen */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <ImageIcon className="w-4 h-4 inline mr-1" />
          Imagen del Evento (opcional)
        </label>

        {/* Preview de Imagen Existente */}
        {imagePreview && (
          <div className="mb-4 relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
              disabled={isUploadingImage || isSubmitting}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Drag & Drop Zone */}
        {!imagePreview && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
              isDragging
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-primary-400'
            } ${isUploadingImage || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploadingImage || isSubmitting}
            />
            <label
              htmlFor="imageUpload"
              className={`cursor-pointer ${isUploadingImage || isSubmitting ? 'cursor-not-allowed' : ''}`}
            >
              {isUploadingImage ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
                  <p className="text-gray-600">Subiendo imagen...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-12 h-12 text-gray-400" />
                  <p className="text-gray-600">
                    <span className="font-semibold text-primary-600">Click para subir</span> o arrastra
                    y suelta
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 5MB</p>
                </div>
              )}
            </label>
          </div>
        )}

        {/* Error de Upload */}
        {uploadError && (
          <div className="mt-2 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{uploadError}</p>
          </div>
        )}
      </div>

      {/* Botones de Acción */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || isUploadingImage}
          className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg focus:ring-4 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {isEditMode ? 'Guardando Cambios...' : 'Creando Evento...'}
            </>
          ) : (
            <>{isEditMode ? 'Guardar Cambios' : 'Crear Evento'}</>
          )}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting || isUploadingImage}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 focus:ring-4 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EventForm;
