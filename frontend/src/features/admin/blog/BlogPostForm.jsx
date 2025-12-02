import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import {
  Upload,
  X,
  Loader2,
  FileText,
  Tag,
  Image as ImageIcon,
  Save,
  Send,
} from 'lucide-react';
import RichTextEditor from '../../../shared/components/RichTextEditor';
import api from '../../../shared/utils/api';

/**
 * BlogPostForm - Formulario para crear y editar artículos de blog
 * Task 10.4 - Sprint 4
 *
 * Features:
 * - Modo create y edit
 * - Validaciones completas con Yup
 * - Auto-generación de slug desde título
 * - Auto-generación de extracto desde contenido
 * - Upload de imagen destacada con preview
 * - Integración con RichTextEditor (Task 10.3)
 * - Botones: Publicar, Guardar Borrador, Cancelar
 * - Loading states en submit
 * - Mensajes de éxito/error
 *
 * Props:
 * - mode: 'create' | 'edit'
 * - initialData: Objeto con datos del post (solo en modo edit)
 * - onSubmit: Callback cuando se guarda (recibe data y isDraft)
 * - onCancel: Callback cuando se cancela
 * - isLoading: Boolean para estado de carga externo (opcional)
 */

/**
 * Schema de validación Yup
 */
const blogPostSchema = yup.object({
  title: yup
    .string()
    .required('El título es requerido')
    .min(10, 'El título debe tener al menos 10 caracteres')
    .max(200, 'El título no puede exceder 200 caracteres'),
  slug: yup
    .string()
    .required('El slug es requerido')
    .matches(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'El slug debe contener solo letras minúsculas, números y guiones'
    )
    .max(250, 'El slug no puede exceder 250 caracteres'),
  content: yup
    .string()
    .required('El contenido es requerido')
    .test('min-content', 'El contenido debe tener al menos 100 caracteres', (value) => {
      const textContent = value?.replace(/<[^>]*>/g, '').trim();
      return textContent && textContent.length >= 100;
    }),
  excerpt: yup.string().max(500, 'El extracto no puede exceder 500 caracteres'),
  featuredImage: yup
    .string()
    .url('Debe ser una URL válida')
    .nullable(),
  category: yup
    .string()
    .required('La categoría es requerida')
    .oneOf(
      [
        'nosotras',
        'bienestar',
        'finanzas',
        'maternidad',
        'emprendimiento',
        'inmigracion',
        'comunidad',
        'educacion',
      ],
      'Categoría inválida'
    ),
});

/**
 * Categorías disponibles para blog posts
 * SINCRONIZADAS CON BACKEND: backend/src/constants/blog.js
 * Last Updated: 2025-12-02 - Bug Fix Sprint 5
 */
const CATEGORIES = [
  { value: 'nosotras', label: 'Nosotras 💖' },
  { value: 'bienestar', label: 'Bienestar 🧘‍♀️' },
  { value: 'finanzas', label: 'Finanzas 💰' },
  { value: 'maternidad', label: 'Maternidad 👶' },
  { value: 'emprendimiento', label: 'Emprendimiento 💼' },
  { value: 'inmigracion', label: 'Inmigración 🌍' },
  { value: 'comunidad', label: 'Comunidad 🤝' },
  { value: 'educacion', label: 'Educación 📚' },
];

const BlogPostForm = ({
  mode = 'create',
  initialData = null,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [imagePreview, setImagePreview] = useState(initialData?.featuredImage || null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(blogPostSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      content: initialData?.content || '<p></p>',
      excerpt: initialData?.excerpt || '',
      featuredImage: initialData?.featuredImage || '',
      category: initialData?.category || '',
    },
  });

  const title = watch('title');
  const content = watch('content');

  /**
   * Auto-generar slug desde título
   */
  useEffect(() => {
    if (mode === 'create' && title) {
      const slug = generateSlug(title);
      setValue('slug', slug);
    }
  }, [title, mode, setValue]);

  /**
   * Generar slug URL-friendly desde texto
   */
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD') // Descomponer caracteres Unicode
      .replace(/[\u0300-\u036f]/g, '') // Remover diacríticos
      .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
      .trim()
      .replace(/\s+/g, '-') // Espacios a guiones
      .replace(/-+/g, '-') // Múltiples guiones a uno
      .substring(0, 250); // Límite de longitud
  };

  /**
   * Auto-generar extracto desde contenido (primeros 150 caracteres sin HTML)
   */
  const generateExcerpt = (htmlContent) => {
    const textContent = htmlContent.replace(/<[^>]*>/g, '').trim();
    return textContent.substring(0, 150) + (textContent.length > 150 ? '...' : '');
  };

  /**
   * Handler para upload de imagen
   */
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo y tamaño
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Solo se permiten imágenes JPG, PNG o WebP');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setUploadError('La imagen no puede exceder 5MB');
      return;
    }

    setUploadError('');
    setUploadingImage(true);

    try {
      // Crear FormData
      const formData = new FormData();
      formData.append('image', file);

      // Upload a S3
      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = response.data.data.url;
      setValue('featuredImage', imageUrl);
      setImagePreview(imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError(error.response?.data?.message || 'Error al subir la imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  /**
   * Remover imagen
   */
  const handleRemoveImage = () => {
    setValue('featuredImage', '');
    setImagePreview(null);
    setUploadError('');
  };

  /**
   * Handler submit (Publicar)
   */
  const handlePublish = (data) => {
    const finalData = {
      ...data,
      excerpt: data.excerpt || generateExcerpt(data.content),
      status: 'published',
    };
    onSubmit(finalData, false);
  };

  /**
   * Handler submit (Guardar Borrador)
   */
  const handleSaveDraft = async () => {
    const data = await handleSubmit((formData) => {
      const finalData = {
        ...formData,
        excerpt: formData.excerpt || generateExcerpt(formData.content),
        status: 'draft',
      };
      onSubmit(finalData, true);
    })();
  };

  return (
    <form onSubmit={handleSubmit(handlePublish)} className="space-y-6">
      {/* Título */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Título del artículo <span className="text-red-500">*</span>
        </label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              id="title"
              className={`
                w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                ${errors.title ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="Ej: Cómo emprender en Canadá siendo mujer migrante"
              disabled={isSubmitting || isLoading}
            />
          )}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
          Slug (URL) <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          <Controller
            name="slug"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="slug"
                className={`
                  w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                  ${errors.slug ? 'border-red-500' : 'border-gray-300'}
                `}
                placeholder="como-emprender-en-canada-siendo-mujer-migrante"
                disabled={isSubmitting || isLoading}
              />
            )}
          />
          {/* Preview URL */}
          {watch('slug') && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
              <Tag className="w-4 h-4" />
              <span className="font-mono">
                https://entreamigas.ca/blog/{watch('slug')}
              </span>
            </div>
          )}
        </div>
        {errors.slug && (
          <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
        )}
      </div>

      {/* Categoría */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Categoría <span className="text-red-500">*</span>
        </label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              id="category"
              className={`
                w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                ${errors.category ? 'border-red-500' : 'border-gray-300'}
              `}
              disabled={isSubmitting || isLoading}
            >
              <option value="">Selecciona una categoría</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          )}
        />
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      {/* Contenido (RichTextEditor) */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Contenido del artículo <span className="text-red-500">*</span>
        </label>
        <Controller
          name="content"
          control={control}
          render={({ field, fieldState }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              placeholder="Escribe el contenido del artículo aquí..."
              disabled={isSubmitting || isLoading}
            />
          )}
        />
      </div>

      {/* Extracto */}
      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
          Extracto (opcional)
        </label>
        <p className="text-sm text-gray-500 mb-2">
          Si se deja vacío, se generará automáticamente desde el contenido
        </p>
        <Controller
          name="excerpt"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              id="excerpt"
              rows={3}
              className={`
                w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                ${errors.excerpt ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="Breve descripción del artículo (máximo 500 caracteres)"
              disabled={isSubmitting || isLoading}
            />
          )}
        />
        {errors.excerpt && (
          <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>
        )}
      </div>

      {/* Imagen Destacada */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imagen Destacada
        </label>

        {!imagePreview ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              className="hidden"
              id="featured-image-upload"
              disabled={uploadingImage || isSubmitting || isLoading}
            />
            <label
              htmlFor="featured-image-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              {uploadingImage ? (
                <>
                  <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-3" />
                  <p className="text-gray-600">Subiendo imagen...</p>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-1">
                    Click para subir o arrastra una imagen
                  </p>
                  <p className="text-sm text-gray-500">JPG, PNG o WebP (máx. 5MB)</p>
                </>
              )}
            </label>
          </div>
        ) : (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
              disabled={isSubmitting || isLoading}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {uploadError && (
          <p className="mt-2 text-sm text-red-600">{uploadError}</p>
        )}
      </div>

      {/* Botones */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
          disabled={isSubmitting || isLoading}
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={handleSaveDraft}
          className="px-6 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition font-medium flex items-center justify-center gap-2"
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Guardar Borrador
            </>
          )}
        </button>

        <button
          type="submit"
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium flex items-center justify-center gap-2"
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Publicando...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Publicar Artículo
            </>
          )}
        </button>
      </div>
    </form>
  );
};

BlogPostForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
  initialData: PropTypes.shape({
    title: PropTypes.string,
    slug: PropTypes.string,
    content: PropTypes.string,
    excerpt: PropTypes.string,
    featuredImage: PropTypes.string,
    category: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default BlogPostForm;
