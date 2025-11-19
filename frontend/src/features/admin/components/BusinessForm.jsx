import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import { AlertCircle, Save, X } from 'lucide-react';
import {
  businessSchema,
  defaultBusinessValues,
  businessToFormValues,
  BUSINESS_CATEGORIES,
} from '../validation/businessSchema';
import ImageUpload from '../../../shared/components/ImageUpload';

/**
 * BusinessForm - Formulario para crear/editar negocios
 *
 * Features:
 * - React Hook Form con validación Yup
 * - Modo create/edit
 * - Mensajes de error claros por campo
 * - Campos requeridos marcados con *
 * - Botones de acción (Guardar, Cancelar)
 * - Responsive design
 * - Loading state durante submit
 *
 * Sprint 3 - US-009: Panel Admin
 * Task 9.5 - Frontend BusinessForm
 *
 * @param {Object} props
 * @param {Object} [props.initialData] - Datos del negocio para modo edit (opcional)
 * @param {Function} props.onSubmit - Callback cuando se envía el form (recibe formData)
 * @param {Function} [props.onCancel] - Callback cuando se cancela (opcional)
 * @param {boolean} [props.isLoading] - Estado de carga durante submit
 * @param {string} [props.submitError] - Error del servidor para mostrar
 * @returns {JSX.Element} Business form
 */
const BusinessForm = ({ initialData, onSubmit, onCancel, isLoading = false, submitError }) => {
  /**
   * Determinar modo (create o edit)
   */
  const isEditMode = !!initialData;

  /**
   * Setup React Hook Form con Yup resolver
   */
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: yupResolver(businessSchema),
    defaultValues: isEditMode ? businessToFormValues(initialData) : defaultBusinessValues,
    mode: 'onBlur', // Validar al salir del campo
  });

  /**
   * Estado para logo upload
   */
  const [logoUrl, setLogoUrl] = useState(initialData?.logo || null);

  /**
   * Resetear form si cambian los datos iniciales (modo edit)
   */
  useEffect(() => {
    if (isEditMode && initialData) {
      reset(businessToFormValues(initialData));
    }
  }, [initialData, isEditMode, reset]);

  /**
   * Handler para submit
   */
  const onSubmitHandler = (data) => {
    console.log('🔍 === BUSINESS FORM SUBMIT DEBUG ===');
    console.log('📋 Data from React Hook Form:', data);
    console.log('🖼️  logoUrl state:', logoUrl);

    // Agregar logo al data antes de enviar
    const submitData = {
      ...data,
      logo: logoUrl,
    };

    console.log('📤 Final submitData:', submitData);
    console.log('📝 submitData keys:', Object.keys(submitData));
    console.log('=== END DEBUG ===');

    onSubmit(submitData);
  };

  /**
   * Renderizar campo de texto con label y error
   */
  const renderTextField = ({
    name,
    label,
    placeholder,
    required = false,
    type = 'text',
    helperText,
  }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={`
          w-full px-3 py-2 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          transition-colors
          ${errors[name] ? 'border-red-500 bg-red-50' : 'border-gray-300'}
          ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}
        `}
        disabled={isLoading}
      />
      {helperText && !errors[name] && (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      )}
      {errors[name] && (
        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {errors[name].message}
        </p>
      )}
    </div>
  );

  /**
   * Renderizar textarea con label y error
   */
  const renderTextArea = ({ name, label, placeholder, required = false, rows = 4 }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={name}
        placeholder={placeholder}
        rows={rows}
        {...register(name)}
        className={`
          w-full px-3 py-2 border rounded-lg resize-none
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          transition-colors
          ${errors[name] ? 'border-red-500 bg-red-50' : 'border-gray-300'}
          ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}
        `}
        disabled={isLoading}
      />
      {errors[name] && (
        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {errors[name].message}
        </p>
      )}
    </div>
  );

  /**
   * Renderizar select con label y error
   */
  const renderSelect = ({ name, label, options, required = false, placeholder = 'Selecciona una opción' }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={name}
        {...register(name)}
        className={`
          w-full px-3 py-2 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          transition-colors
          ${errors[name] ? 'border-red-500 bg-red-50' : 'border-gray-300'}
          ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}
        `}
        disabled={isLoading}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {errors[name] && (
        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {errors[name].message}
        </p>
      )}
    </div>
  );

  /**
   * Renderizar error del servidor con información detallada
   * Sprint 5 - Task 5.4.3: Mejorar mensajes de error
   */
  const renderServerError = () => {
    if (!submitError) return null;

    // Detectar tipo de error
    const isValidationError = submitError.toLowerCase().includes('inválid') ||
                               submitError.toLowerCase().includes('formato') ||
                               submitError.toLowerCase().includes('requerido');

    const isUrlError = submitError.toLowerCase().includes('url') ||
                      submitError.toLowerCase().includes('website');

    return (
      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-base font-semibold text-red-900 mb-1">
            {isValidationError ? '❌ Error de Validación' : '❌ Error al Guardar el Negocio'}
          </h4>
          <p className="text-sm text-red-800 mb-2 font-medium">{submitError}</p>

          {/* Sugerencias para errores de validación */}
          {isValidationError && (
            <div className="bg-red-100 border border-red-300 rounded-md p-3 mt-2">
              <p className="text-xs font-semibold text-red-900 mb-2">💡 Sugerencias para Resolver:</p>
              <ul className="text-xs text-red-800 space-y-1.5 ml-4 list-disc">
                <li>Verifica que todos los campos marcados con <span className="text-red-600 font-bold">*</span> estén completos</li>
                <li>Revisa los formatos de contacto (teléfono, email, WhatsApp)</li>
                <li className="font-medium">Los mensajes de error bajo cada campo muestran ejemplos válidos</li>
              </ul>
            </div>
          )}

          {/* Ayuda específica para errores de URL */}
          {isUrlError && (
            <div className="bg-blue-50 border border-blue-300 rounded-md p-3 mt-2">
              <p className="text-xs font-semibold text-blue-900 mb-1">🌐 Formato de URL Correcto:</p>
              <ul className="text-xs text-blue-800 space-y-0.5 ml-4 list-disc">
                <li>✅ https://ejemplo.com</li>
                <li>✅ http://www.ejemplo.com</li>
                <li>✅ ejemplo.com (se agregará http:// automáticamente)</li>
                <li>❌ www ejemplo com (sin puntos ni protocolo)</li>
              </ul>
            </div>
          )}

          {/* Mensaje para errores 400 genéricos */}
          {!isValidationError && !isUrlError && submitError.includes('400') && (
            <p className="text-xs text-red-700 mt-2 bg-red-100 border border-red-200 rounded px-2 py-1.5 italic">
              ⚠️ El servidor rechazó los datos. Por favor, verifica que todos los campos tengan el formato correcto y vuelve a intentar.
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      {/* Error del servidor mejorado */}
      {renderServerError()}

      {/* Sección: Información Básica */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderTextField({
            name: 'name',
            label: 'Nombre del Negocio',
            placeholder: 'Ej: Café Entre Amigas',
            required: true,
          })}

          {renderSelect({
            name: 'category',
            label: 'Categoría',
            options: BUSINESS_CATEGORIES,
            required: true,
          })}

          {renderTextField({
            name: 'city',
            label: 'Ciudad',
            placeholder: 'Ej: Toronto',
            required: true,
          })}

          {renderTextField({
            name: 'address',
            label: 'Dirección',
            placeholder: 'Ej: 123 Queen St W',
          })}
        </div>

        <div className="mt-4">
          {renderTextArea({
            name: 'description',
            label: 'Descripción',
            placeholder: 'Describe tu negocio, servicios, horarios, etc. (mínimo 20 caracteres)',
            required: true,
            rows: 5,
          })}
        </div>

        {/* Logo */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo del Negocio
          </label>
          <ImageUpload
            currentImage={logoUrl}
            onImageUploaded={setLogoUrl}
            folder="businesses"
            maxSizeMB={5}
          />
          <p className="text-xs text-gray-500 mt-1">
            Esta imagen aparecerá en la tarjeta del negocio
          </p>
        </div>
      </div>

      {/* Sección: Información de Contacto */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderTextField({
            name: 'phone',
            label: 'Teléfono',
            type: 'tel',
            placeholder: '+1 (416) 123-4567',
            helperText: 'Formato: 10-20 dígitos, puede incluir espacios y guiones',
          })}

          {renderTextField({
            name: 'whatsapp',
            label: 'WhatsApp',
            type: 'tel',
            placeholder: '+1 (416) 123-4567',
            helperText: 'Número de WhatsApp para contacto directo',
          })}

          {renderTextField({
            name: 'email',
            label: 'Email',
            type: 'email',
            placeholder: 'contacto@ejemplo.com',
          })}

          {renderTextField({
            name: 'website',
            label: 'Sitio Web',
            type: 'text',
            placeholder: 'www.ejemplo.com',
            helperText: 'Opcional. Puedes incluir http:// o solo escribir ejemplo.com',
          })}
        </div>
      </div>

      {/* Sección: Redes Sociales */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Redes Sociales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderTextField({
            name: 'instagram',
            label: 'Instagram',
            placeholder: 'usuario_instagram',
            helperText: 'Solo el nombre de usuario (sin @)',
          })}

          {renderTextField({
            name: 'facebook',
            label: 'Facebook',
            placeholder: 'usuario.facebook',
            helperText: 'Solo el nombre de usuario',
          })}
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancelar
          </button>
        )}

        <button
          type="submit"
          disabled={isLoading || !isDirty}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 min-w-[120px] justify-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {isEditMode ? 'Guardar Cambios' : 'Crear Negocio'}
            </>
          )}
        </button>
      </div>

      {/* Info mensaje para indicar campos requeridos */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
        <p className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-blue-600" />
          Los campos marcados con <span className="text-red-500 font-semibold">*</span> son
          obligatorios.
        </p>
      </div>
    </form>
  );
};

BusinessForm.propTypes = {
  initialData: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    category: PropTypes.string,
    description: PropTypes.string,
    city: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    whatsapp: PropTypes.string,
    address: PropTypes.string,
    website: PropTypes.string,
    instagram: PropTypes.string,
    facebook: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  isLoading: PropTypes.bool,
  submitError: PropTypes.string,
};

export default BusinessForm;
