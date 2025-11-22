import { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { X, Upload, Loader2 } from 'lucide-react';
import { useToast } from '../../../shared/context/ToastContext';
import api from '../../../shared/utils/api';
import { proposeServiceSchema, SERVICE_TYPES } from '../validation/proposeServiceSchema';

/**
 * ProposeServiceModal - Modal para proponer un servicio
 *
 * Features:
 * - Form con React Hook Form + Yup validation
 * - Upload de logo con preview
 * - Validación en tiempo real
 * - Submit con FormData (multipart/form-data)
 * - Loading states
 * - Toast notifications
 * - Responsive (fullscreen mobile, centered desktop)
 * - Campos adicionales: credentials, linkedin, facebook, whatsapp
 *
 * Sprint 5+ - Service Proposal System
 * Patrón basado en ProposeBusinessModal.jsx
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Estado del modal
 * @param {function} props.onClose - Callback para cerrar modal
 * @param {function} props.onSuccess - Callback después de submit exitoso
 * @returns {JSX.Element|null}
 */
const ProposeServiceModal = ({ isOpen, onClose, onSuccess }) => {
  const { showToast } = useToast();
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(proposeServiceSchema),
    mode: 'onBlur', // Validar cuando se pierde el foco
  });

  /**
   * Handler para cerrar modal y resetear form
   */
  const handleClose = () => {
    if (isSubmitting) return; // No cerrar si está enviando
    reset();
    setLogoFile(null);
    setLogoPreview(null);
    onClose();
  };

  /**
   * Handler para cambio de archivo de logo
   */
  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > maxSize) {
      showToast('error', 'El logo no puede ser mayor a 5MB');
      e.target.value = null; // Resetear input
      return;
    }

    // Validar tipo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showToast('error', 'El logo debe ser JPG, PNG o WEBP');
      e.target.value = null;
      return;
    }

    // Guardar file y crear preview
    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Handler para remover logo
   */
  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    // Resetear input file
    const fileInput = document.getElementById('logo-input-service');
    if (fileInput) fileInput.value = null;
  };

  /**
   * Handler para submit del form
   */
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    // DEBUG: Log para ver qué datos recibimos de React Hook Form
    console.log('🔍 PROPOSE SERVICE - onSubmit - data recibida de React Hook Form:', data);

    try {
      // Crear FormData para enviar multipart/form-data
      const formData = new FormData();

      // Append todos los campos
      // NOTA: NO enviamos 'owner' - el backend lo asigna automáticamente desde req.user.id
      formData.append('name', data.name);
      formData.append('serviceType', data.serviceType);
      formData.append('description', data.description);
      formData.append('phone', data.phone);
      formData.append('city', data.city);

      // Campos opcionales (solo si tienen valor)
      if (data.email) formData.append('email', data.email);
      if (data.website) formData.append('website', data.website);
      if (data.address) formData.append('address', data.address);
      if (data.whatsapp) formData.append('whatsapp', data.whatsapp);
      if (data.instagram) formData.append('instagram', data.instagram);
      if (data.facebook) formData.append('facebook', data.facebook);
      if (data.linkedin) formData.append('linkedin', data.linkedin);
      if (data.credentials) formData.append('credentials', data.credentials);

      // Append logo si existe
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      // DEBUG: Log para ver qué se está enviando en FormData
      console.log('📦 PROPOSE SERVICE - FormData entries:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ':', pair[1]);
      }

      // POST /services/propose
      const response = await api.post('/services/propose', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Success
      showToast('success', '¡Gracias! Tu servicio será revisado por nuestro equipo');
      handleClose();
      if (onSuccess) onSuccess(response.data.data);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error?.message ||
        'Error al enviar la propuesta';
      showToast('error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal Container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Modal Content */}
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-soft-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-display font-bold text-gray-900">Agregar Mi Servicio</h2>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              aria-label="Cerrar modal"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Info message */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                Tu servicio será revisado por nuestro equipo antes de aparecer en el directorio.
                Recibirás un email cuando sea aprobado.
              </p>
            </div>

            {/* Grid 2 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre del Servicio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Servicio *
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  placeholder="Ej: Consultoría Legal Inmigratoria"
                  disabled={isSubmitting}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              {/* Tipo de Servicio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Servicio *
                </label>
                <select
                  {...register('serviceType')}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.serviceType ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  disabled={isSubmitting}
                >
                  <option value="">Selecciona un tipo</option>
                  {SERVICE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.serviceType && (
                  <p className="mt-1 text-sm text-red-600">{errors.serviceType.message}</p>
                )}
              </div>

              {/* Ciudad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad *</label>
                <input
                  type="text"
                  {...register('city')}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.city ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  placeholder="Ej: Toronto"
                  disabled={isSubmitting}
                />
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono *</label>
                <input
                  type="tel"
                  {...register('phone')}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  placeholder="Ej: 416-555-0123"
                  disabled={isSubmitting}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (opcional)
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  placeholder="contacto@ejemplo.com"
                  disabled={isSubmitting}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp (opcional)
                </label>
                <input
                  type="tel"
                  {...register('whatsapp')}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.whatsapp ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  placeholder="Ej: +1 416-555-0123"
                  disabled={isSubmitting}
                />
                {errors.whatsapp && (
                  <p className="mt-1 text-sm text-red-600">{errors.whatsapp.message}</p>
                )}
              </div>
            </div>

            {/* Descripción (full width) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
                <span className="text-xs text-gray-500 ml-2">(mínimo 50 caracteres)</span>
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none`}
                placeholder="Describe tu servicio, experiencia y en qué puedes ayudar..."
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Credenciales (full width) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Credenciales (opcional)
                <span className="text-xs text-gray-500 ml-2">
                  (títulos, certificaciones, licencias)
                </span>
              </label>
              <textarea
                {...register('credentials')}
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.credentials ? 'border-red-300' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none`}
                placeholder="Ej: Licenciado en Derecho, Certificación ICCRC, 10 años de experiencia..."
                disabled={isSubmitting}
              />
              {errors.credentials && (
                <p className="mt-1 text-sm text-red-600">{errors.credentials.message}</p>
              )}
            </div>

            {/* Grid 2 columnas - Campos opcionales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sitio Web */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sitio Web (opcional)
                </label>
                <input
                  type="url"
                  {...register('website')}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.website ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  placeholder="https://ejemplo.com"
                  disabled={isSubmitting}
                />
                {errors.website && (
                  <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
                )}
              </div>

              {/* Instagram */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram (opcional)
                </label>
                <input
                  type="text"
                  {...register('instagram')}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.instagram ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  placeholder="@miusuario"
                  disabled={isSubmitting}
                />
                {errors.instagram && (
                  <p className="mt-1 text-sm text-red-600">{errors.instagram.message}</p>
                )}
              </div>

              {/* Facebook */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook (opcional)
                </label>
                <input
                  type="url"
                  {...register('facebook')}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.facebook ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  placeholder="https://facebook.com/mipagina"
                  disabled={isSubmitting}
                />
                {errors.facebook && (
                  <p className="mt-1 text-sm text-red-600">{errors.facebook.message}</p>
                )}
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn (opcional)
                </label>
                <input
                  type="url"
                  {...register('linkedin')}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.linkedin ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  placeholder="https://linkedin.com/in/usuario"
                  disabled={isSubmitting}
                />
                {errors.linkedin && (
                  <p className="mt-1 text-sm text-red-600">{errors.linkedin.message}</p>
                )}
              </div>
            </div>

            {/* Dirección (full width) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección (opcional)
              </label>
              <input
                type="text"
                {...register('address')}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.address ? 'border-red-300' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                placeholder="123 Main St, Toronto, ON"
                disabled={isSubmitting}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo (opcional)
                <span className="text-xs text-gray-500 ml-2">(JPG, PNG o WEBP, máx 5MB)</span>
              </label>

              {!logoPreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-400 transition-colors">
                  <input
                    type="file"
                    id="logo-input-service"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleLogoChange}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="logo-input-service" className="cursor-pointer">
                    <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-sm text-gray-600">
                      Haz click para subir o arrastra tu logo aquí
                    </p>
                  </label>
                </div>
              ) : (
                <div className="relative border-2 border-gray-300 rounded-xl p-4">
                  <img
                    src={logoPreview}
                    alt="Preview del logo"
                    className="w-32 h-32 object-cover rounded-xl mx-auto"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    disabled={isSubmitting}
                    aria-label="Remover logo"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium hover:shadow-soft-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Enviando...
                  </>
                ) : (
                  'Enviar para Revisión'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

ProposeServiceModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
};

export default ProposeServiceModal;
