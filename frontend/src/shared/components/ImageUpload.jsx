import { useState } from 'react';
import PropTypes from 'prop-types';
import { Upload, X, AlertCircle } from 'lucide-react';
import api from '../utils/api';

/**
 * ImageUpload - Componente reutilizable para subir imágenes
 *
 * Features:
 * - Preview de imagen actual o seleccionada
 * - Drag & drop o click to upload
 * - Validación de tipo y tamaño
 * - Loading state durante upload
 * - Error handling
 *
 * @param {Object} props
 * @param {string} [props.currentImage] - URL de imagen actual (modo edit)
 * @param {Function} props.onImageUploaded - Callback con URL de imagen subida
 * @param {string} [props.folder] - Carpeta en S3 (default: 'businesses')
 * @param {number} [props.maxSizeMB] - Tamaño máximo en MB (default: 5)
 * @returns {JSX.Element}
 */
const ImageUpload = ({
  currentImage,
  onImageUploaded,
  folder = 'businesses',
  maxSizeMB = 5
}) => {
  const [preview, setPreview] = useState(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  /**
   * Validar archivo
   */
  const validateFile = (file) => {
    // Validar tipo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return 'Solo se permiten imágenes JPG, PNG o WebP';
    }

    // Validar tamaño
    if (file.size > maxSizeBytes) {
      return `La imagen no puede exceder ${maxSizeMB}MB`;
    }

    return null;
  };

  /**
   * Handler para subir imagen
   */
  const handleUpload = async (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Crear FormData
      const formData = new FormData();
      formData.append('image', file);

      // Upload a S3
      const response = await api.post(`/upload/image?folder=${folder}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('📸 Upload response:', response.data);
      const imageUrl = response.data.data?.url || response.data.url;
      console.log('📸 Image URL extracted:', imageUrl);

      setPreview(imageUrl);
      onImageUploaded(imageUrl);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.response?.data?.message || 'Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  /**
   * Handler para input file
   */
  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  /**
   * Handler para drag & drop
   */
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  /**
   * Remover imagen
   */
  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onImageUploaded(null);
  };

  return (
    <div className="space-y-2">
      {/* Preview o Upload Area */}
      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer"
        >
          <label htmlFor="image-upload" className="cursor-pointer">
            <input
              id="image-upload"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileInput}
              disabled={uploading}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-2">
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                  <p className="text-sm text-gray-600">Subiendo imagen...</p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Click para subir o arrastra la imagen
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG o WebP (máx. {maxSizeMB}MB)
                    </p>
                  </div>
                </>
              )}
            </div>
          </label>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};

ImageUpload.propTypes = {
  currentImage: PropTypes.string,
  onImageUploaded: PropTypes.func.isRequired,
  folder: PropTypes.string,
  maxSizeMB: PropTypes.number,
};

export default ImageUpload;
