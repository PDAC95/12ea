import { useState, useEffect } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '../../../shared/context/ToastContext';
import { TIP_CATEGORIES } from '../../../shared/constants/tipCategories';
import api from '../../../shared/utils/api';

/**
 * EditTipModal - Modal para editar un tip (Admin)
 *
 * Features:
 * - Formulario con validación
 * - Character counters
 * - Validaciones min/max
 * - PUT /admin/tips/:id
 * - Toast notifications
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Callback al cerrar
 * @param {Object} props.tip - Tip a editar { _id, title, content, category }
 * @param {Function} props.onSuccess - Callback después de editar exitosamente
 * @returns {JSX.Element}
 */
const EditTipModal = ({ isOpen, onClose, tip, onSuccess }) => {
  const { showToast } = useToast();

  // State del formulario
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Cargar datos del tip cuando se abre el modal
  useEffect(() => {
    if (isOpen && tip) {
      setFormData({
        title: tip.title || '',
        content: tip.content || '',
        category: tip.category || '',
      });
      setErrors({});
    }
  }, [isOpen, tip]);

  /**
   * Handler para cambios en inputs
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Validar formulario
   */
  const validate = () => {
    const newErrors = {};

    // Validar título
    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    } else if (formData.title.length < 5) {
      newErrors.title = 'El título debe tener al menos 5 caracteres';
    } else if (formData.title.length > 150) {
      newErrors.title = 'El título no puede exceder 150 caracteres';
    }

    // Validar contenido
    if (!formData.content.trim()) {
      newErrors.content = 'El contenido es requerido';
    } else if (formData.content.length < 100) {
      newErrors.content = 'El contenido debe tener al menos 100 caracteres';
    } else if (formData.content.length > 2000) {
      newErrors.content = 'El contenido no puede exceder 2000 caracteres';
    }

    // Validar categoría
    if (!formData.category) {
      newErrors.category = 'La categoría es requerida';
    } else if (!TIP_CATEGORIES.includes(formData.category)) {
      newErrors.category = 'Categoría inválida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handler para enviar formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      showToast('error', 'Por favor corrige los errores del formulario');
      return;
    }

    try {
      setLoading(true);

      await api.put(`/admin/tips/${tip._id}`, {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
      });

      showToast('success', 'Tip actualizado exitosamente');
      onSuccess(); // Refrescar lista
      onClose(); // Cerrar modal
    } catch (error) {
      console.error('Error updating tip:', error);
      const errorMessage = error.response?.data?.message || 'Error al actualizar el tip';
      showToast('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handler para cerrar modal
   */
  const handleClose = () => {
    if (loading) return; // No cerrar si está procesando
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Editar Tip
            </h2>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Título */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Título del Tip <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Escribe un título claro y conciso"
              />
              <div className="flex items-center justify-between mt-2">
                {errors.title ? (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Mínimo 5 caracteres
                  </p>
                )}
                <span className={`text-sm font-medium ${
                  formData.title.length > 150 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {formData.title.length}/150
                </span>
              </div>
            </div>

            {/* Categoría */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Selecciona una categoría</option>
                {TIP_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Contenido */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Contenido <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                disabled={loading}
                rows={8}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.content ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Comparte tu consejo o experiencia con la comunidad..."
              />
              <div className="flex items-center justify-between mt-2">
                {errors.content ? (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.content}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Mínimo 100 caracteres
                  </p>
                )}
                <span className={`text-sm font-medium ${
                  formData.content.length < 100
                    ? 'text-orange-600'
                    : formData.content.length > 2000
                    ? 'text-red-600'
                    : 'text-green-600'
                }`}>
                  {formData.content.length}/2000
                </span>
              </div>
            </div>

            {/* Footer - Acciones */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  'Actualizar Tip'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTipModal;
