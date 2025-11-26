import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { User, Mail, Phone, MapPin, FileText, Loader2, Upload, X } from 'lucide-react';
import { useToast } from '../../../shared/context/ToastContext';
import { useAuth } from '../../auth/context/AuthContext';

/**
 * ProfileForm - Formulario de edición de perfil de usuario
 *
 * Features:
 * - Edición de preferredName, phone, city, bio
 * - Email readonly (no editable)
 * - Upload de imagen de perfil con preview
 * - Validaciones de campos
 * - Loading states
 * - Toast notifications
 * - Actualización de contexto de Auth
 *
 * Sprint 5+ - Sistema de Perfil de Usuario
 *
 * @param {Object} props
 * @param {Object} props.profile - Datos del perfil actual
 * @param {Function} props.onUpdate - Callback al actualizar perfil
 * @returns {JSX.Element} Formulario de perfil
 */
const ProfileForm = ({ profile, onUpdate }) => {
  const { toast } = useToast();
  const { updateUser } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    preferredName: '',
    phone: '',
    city: '',
    bio: '',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  /**
   * Inicializar form con datos del perfil
   */
  useEffect(() => {
    if (profile) {
      setFormData({
        preferredName: profile.preferredName || '',
        phone: profile.phone || '',
        city: profile.city || '',
        bio: profile.bio || '',
      });

      if (profile.profileImage) {
        setImagePreview(profile.profileImage);
      }
    }
  }, [profile]);

  /**
   * Handle input change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Handle image upload
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede ser mayor a 5MB');
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('La imagen debe ser JPG, PNG o WEBP');
      return;
    }

    setProfileImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Remove image
   */
  const handleRemoveImage = () => {
    setProfileImage(null);
    setImagePreview(profile?.profileImage || null);
  };

  /**
   * Validate form
   */
  const validate = () => {
    const newErrors = {};

    if (!formData.preferredName.trim()) {
      newErrors.preferredName = 'El nombre es requerido';
    }

    if (formData.phone && !/^[\d\s\-\(\)\+]{10,20}$/.test(formData.phone)) {
      newErrors.phone = 'Formato de teléfono inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.warning('Por favor corrige los errores en el formulario');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare FormData for multipart/form-data
      const submitData = new FormData();
      submitData.append('preferredName', formData.preferredName);
      submitData.append('phone', formData.phone);
      submitData.append('city', formData.city);
      submitData.append('bio', formData.bio);

      if (profileImage) {
        submitData.append('profileImage', profileImage);
      }

      const result = await onUpdate(submitData);

      if (result.success) {
        toast.success('Perfil actualizado exitosamente');

        // Update Auth context with new user data
        updateUser(result.data);

        // Clear image file from state (keep preview)
        setProfileImage(null);
      } else {
        toast.error(result.error || 'Error al actualizar el perfil');
      }
    } catch (err) {
      console.error('Error submitting profile:', err);
      toast.error('Error al actualizar el perfil');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Image Upload */}
      <div className="flex flex-col items-center gap-4 pb-6 border-b border-gray-200">
        <div className="relative">
          {/* Image Preview */}
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-400 to-secondary-400">
                <User className="w-16 h-16 text-white" />
              </div>
            )}
          </div>

          {/* Remove Button */}
          {profileImage && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Upload Button */}
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="hidden"
          />
          <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors border border-primary-200">
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">
              {imagePreview ? 'Cambiar imagen' : 'Subir imagen'}
            </span>
          </div>
        </label>

        <p className="text-xs text-gray-500 text-center">
          JPG, PNG o WEBP. Máximo 5MB.
        </p>
      </div>

      {/* Preferred Name */}
      <div>
        <label htmlFor="preferredName" className="block text-sm font-medium text-gray-700 mb-2">
          Nombre Preferido *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="preferredName"
            name="preferredName"
            value={formData.preferredName}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
              errors.preferredName
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
            } focus:ring-2 focus:outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed`}
            placeholder="¿Cómo te gusta que te llamen?"
          />
        </div>
        {errors.preferredName && (
          <p className="mt-1 text-sm text-red-600">{errors.preferredName}</p>
        )}
      </div>

      {/* Email (readonly) */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="email"
            id="email"
            value={profile.email || ''}
            disabled
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">El email no puede modificarse</p>
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Teléfono
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
              errors.phone
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
            } focus:ring-2 focus:outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed`}
            placeholder="(123) 456-7890"
          />
        </div>
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
        )}
      </div>

      {/* City */}
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
          Ciudad
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
            placeholder="Ciudad de residencia"
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
          Biografía
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3 pointer-events-none">
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            disabled={isSubmitting}
            rows={4}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed resize-none"
            placeholder="Cuéntanos un poco sobre ti..."
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Guardando cambios...
            </>
          ) : (
            'Guardar Cambios'
          )}
        </button>
      </div>
    </form>
  );
};

ProfileForm.propTypes = {
  profile: PropTypes.shape({
    email: PropTypes.string,
    preferredName: PropTypes.string,
    phone: PropTypes.string,
    city: PropTypes.string,
    bio: PropTypes.string,
    profileImage: PropTypes.string,
  }),
  onUpdate: PropTypes.func.isRequired,
};

export default ProfileForm;
