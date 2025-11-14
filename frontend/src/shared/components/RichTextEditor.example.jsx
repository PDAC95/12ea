import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import RichTextEditor from './RichTextEditor';

/**
 * EJEMPLO DE USO: RichTextEditor con React Hook Form
 * Task 10.3 - Sprint 4
 *
 * Este archivo demuestra cómo integrar el RichTextEditor
 * con React Hook Form y validaciones Yup
 */

/**
 * Schema de validación para el contenido del editor
 */
const schema = yup.object({
  title: yup
    .string()
    .required('El título es requerido')
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(150, 'El título no puede exceder 150 caracteres'),
  content: yup
    .string()
    .required('El contenido es requerido')
    .test('min-content', 'El contenido debe tener al menos 50 caracteres', (value) => {
      // Remover tags HTML para validar longitud real del contenido
      const textContent = value?.replace(/<[^>]*>/g, '').trim();
      return textContent && textContent.length >= 50;
    })
    .test('max-content', 'El contenido no puede exceder 10000 caracteres', (value) => {
      const textContent = value?.replace(/<[^>]*>/g, '').trim();
      return !textContent || textContent.length <= 10000;
    }),
});

/**
 * Ejemplo de formulario con RichTextEditor
 */
const ExampleBlogForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      content: '<p>Contenido HTML inicial...</p>',
    },
  });

  const onSubmit = async (data) => {
    console.log('Form data:', data);
    console.log('HTML Content:', data.content);

    // Aquí harías el POST al backend
    // const response = await api.post('/blog/posts', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Crear Artículo de Blog</h1>

      {/* Campo Título */}
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Título del artículo *
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
                w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500
                ${errors.title ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="Ej: Cómo adaptarse a la vida en Canadá"
            />
          )}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Campo Contenido - RichTextEditor */}
      <div className="mb-6">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Contenido del artículo *
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
              disabled={isSubmitting}
            />
          )}
        />
      </div>

      {/* Botones */}
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : 'Publicar Artículo'}
        </button>
      </div>
    </form>
  );
};

export default ExampleBlogForm;

/**
 * EJEMPLO 2: Uso básico sin React Hook Form
 */
export const ExampleBasicUsage = () => {
  const [content, setContent] = useState('<p>Contenido inicial...</p>');

  const handleSave = () => {
    console.log('Contenido HTML:', content);
    // Enviar al backend
  };

  return (
    <div className="p-6">
      <RichTextEditor
        value={content}
        onChange={setContent}
        placeholder="Escribe algo..."
      />

      <button
        onClick={handleSave}
        className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg"
      >
        Guardar
      </button>
    </div>
  );
};

/**
 * EJEMPLO 3: Cargar HTML existente para edición
 */
export const ExampleEditExisting = () => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');

  useEffect(() => {
    // Simular fetch de contenido existente
    const fetchContent = async () => {
      // const response = await api.get('/blog/posts/123');
      const existingHtml = `
        <h2>Título del artículo existente</h2>
        <p>Este es un <strong>artículo existente</strong> que estamos editando.</p>
        <ul>
          <li>Punto uno</li>
          <li>Punto dos</li>
        </ul>
      `;
      setContent(existingHtml);
      setLoading(false);
    };

    fetchContent();
  }, []);

  if (loading) {
    return <div>Cargando editor...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Editar Artículo</h2>
      <RichTextEditor
        value={content}
        onChange={setContent}
        placeholder="Edita el contenido..."
      />
    </div>
  );
};
