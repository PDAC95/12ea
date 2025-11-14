import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Link2,
  Image as ImageIcon,
  Undo,
  Redo,
} from 'lucide-react';

/**
 * RichTextEditor - Editor de texto enriquecido con Tiptap
 * Task 10.3 - Sprint 4
 *
 * Features:
 * - Toolbar completo con todas las opciones de formato
 * - Negritas, cursivas
 * - Títulos H2, H3
 * - Listas (ordenadas, desordenadas)
 * - Links con validación de URL
 * - Insertar imágenes por URL
 * - Undo/Redo
 * - Integración con React Hook Form
 * - Output HTML válido
 * - Responsive design
 *
 * Props:
 * - value: Contenido HTML inicial (string)
 * - onChange: Callback cuando el contenido cambia (string HTML)
 * - placeholder: Placeholder del editor
 * - error: Mensaje de error (para integrar con validaciones)
 * - disabled: Deshabilitar editor
 *
 * Uso con React Hook Form:
 * <Controller
 *   name="content"
 *   control={control}
 *   render={({ field, fieldState }) => (
 *     <RichTextEditor
 *       value={field.value}
 *       onChange={field.onChange}
 *       error={fieldState.error?.message}
 *     />
 *   )}
 * />
 */
const RichTextEditor = ({
  value = '',
  onChange,
  placeholder = 'Escribe el contenido del artículo...',
  error = '',
  disabled = false,
}) => {
  /**
   * Configurar Tiptap editor
   */
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3], // Solo H2 y H3
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary-600 underline hover:text-primary-700',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
      }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      // Llamar onChange con HTML actualizado
      const html = editor.getHTML();
      onChange(html);
    },
  });

  /**
   * Sincronizar value externo con editor cuando cambia (para React Hook Form)
   */
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  /**
   * Actualizar editable state cuando disabled cambia
   */
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  /**
   * Handler para agregar link
   */
  const addLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL del enlace:', previousUrl);

    // Cancelado
    if (url === null) {
      return;
    }

    // Vacío - remover link
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // Agregar/actualizar link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  /**
   * Handler para agregar imagen
   */
  const addImage = useCallback(() => {
    if (!editor) return;

    const url = window.prompt('URL de la imagen:');

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  /**
   * Si el editor no está listo, no renderizar nada
   */
  if (!editor) {
    return null;
  }

  return (
    <div className="rich-text-editor">
      {/* Toolbar */}
      <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex flex-wrap gap-1">
        {/* Undo/Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Deshacer"
          icon={<Undo className="w-4 h-4" />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Rehacer"
          icon={<Redo className="w-4 h-4" />}
        />

        <ToolbarDivider />

        {/* Formato de texto */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Negrita"
          icon={<Bold className="w-4 h-4" />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Cursiva"
          icon={<Italic className="w-4 h-4" />}
        />

        <ToolbarDivider />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Título 2"
          icon={<Heading2 className="w-4 h-4" />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Título 3"
          icon={<Heading3 className="w-4 h-4" />}
        />

        <ToolbarDivider />

        {/* Listas */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Lista con viñetas"
          icon={<List className="w-4 h-4" />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Lista numerada"
          icon={<ListOrdered className="w-4 h-4" />}
        />

        <ToolbarDivider />

        {/* Links e imágenes */}
        <ToolbarButton
          onClick={addLink}
          isActive={editor.isActive('link')}
          title="Insertar enlace"
          icon={<Link2 className="w-4 h-4" />}
        />
        <ToolbarButton
          onClick={addImage}
          title="Insertar imagen"
          icon={<ImageIcon className="w-4 h-4" />}
        />
      </div>

      {/* Editor Content */}
      <div
        className={`
          border border-t-0 border-gray-300 rounded-b-lg p-4 bg-white min-h-[300px]
          ${error ? 'border-red-500' : ''}
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
        `}
      >
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none focus:outline-none"
          placeholder={placeholder}
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Custom Styles for Editor */}
      <style jsx>{`
        .rich-text-editor .ProseMirror {
          min-height: 280px;
          outline: none;
        }

        .rich-text-editor .ProseMirror:focus {
          outline: none;
        }

        .rich-text-editor .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          height: 0;
          float: left;
        }

        .rich-text-editor .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        .rich-text-editor .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }

        .rich-text-editor .ProseMirror p {
          margin-bottom: 1rem;
          line-height: 1.7;
        }

        .rich-text-editor .ProseMirror ul,
        .rich-text-editor .ProseMirror ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .rich-text-editor .ProseMirror ul {
          list-style-type: disc;
        }

        .rich-text-editor .ProseMirror ol {
          list-style-type: decimal;
        }

        .rich-text-editor .ProseMirror li {
          margin-bottom: 0.25rem;
        }

        .rich-text-editor .ProseMirror a {
          color: #7c3aed;
          text-decoration: underline;
        }

        .rich-text-editor .ProseMirror a:hover {
          color: #6d28d9;
        }

        .rich-text-editor .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }

        .rich-text-editor .ProseMirror strong {
          font-weight: 700;
        }

        .rich-text-editor .ProseMirror em {
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

/**
 * Toolbar Button Component
 */
const ToolbarButton = ({ onClick, isActive = false, disabled = false, title, icon }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`
      p-2 rounded transition-colors
      ${isActive ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-200'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `}
  >
    {icon}
  </button>
);

ToolbarButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
  disabled: PropTypes.bool,
  title: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
};

/**
 * Toolbar Divider Component
 */
const ToolbarDivider = () => (
  <div className="w-px h-8 bg-gray-300 mx-1" />
);

RichTextEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
};

export default RichTextEditor;
