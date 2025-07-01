import { EditorContent, useEditor } from "@tiptap/react";
import { useCallback, useImperativeHandle, useState, forwardRef } from "react";
import { addImage, getEditorProps, insertMath } from "../utils";
import { getEditorExtensions } from "../utils/editorConfig";
import EditorToolbar from "./EditorToolbar";
import LoadingOverlay from "./LoadingOverlay";
import "../styles/editor.css";
import MathEquationDialog from "./MathEquationDialog";
import { useEditorKeyboard } from "../hooks/useEditorKeyboard";
import TableControls from "./TableControls";
import CharacterCount from "./CharacterCount";

export interface EditorRef {
  addImage: (urls: string[]) => void;
  getHTML: () => string | undefined;
  setContent: (content: string) => void;
}

export interface EditorProps {
  /**
   * Initial content of the editor
   */
  initialContent?: string;
  /**
   * Callback function when content changes
   */
  onChange?: (content: string) => void;
  /**
   * Placeholder text for the editor
   */
  placeholder?: string;
  /**
   * Whether the editor is read-only
   */
  readOnly?: boolean;
  /**
   * Whether to auto-focus the editor on mount
   */
  autoFocus?: boolean;
  /**
   * Additional CSS class name for styling
   */
  className?: string;
  /**
   * Callback for image selection requests
   */
  onImageSelectionRequest?: () => void;
  /**
   * Minimum height of the editor
   */
  minHeight?: string;
  /**
   * Maximum height of the editor (for scrolling)
   */
  maxHeight?: string;
  /**
   * Whether to show the character count
   */
  showCharacterCount?: boolean;
  /**
   * Whether to show table controls
   */
  showTableControls?: boolean;
}

export const Editor = forwardRef<EditorRef, EditorProps>((props, ref) => {
  const [showMathDialog, setShowMathDialog] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const {
    initialContent = "<p>Start typing something...</p>",
    onChange,
    placeholder = "Start typing...",
    readOnly = false,
    autoFocus = false,
    className = "",
    onImageSelectionRequest,
    minHeight = "300px",
    maxHeight,
    showCharacterCount = true,
    showTableControls = true,
  } = props;

  const editor = useEditor({
    content: initialContent,
    editable: !readOnly,
    autofocus: autoFocus,
    editorProps: getEditorProps({
      className,
      placeholder,
    }),
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
    extensions: getEditorExtensions(),
  });

  useImperativeHandle(ref, () => ({
    addImage: (urls: string[]) => {
      if (editor) {
        addImage(editor, urls);
      }
    },
    getHTML: () => editor?.getHTML(),
    setContent: (content: string) => {
      if (editor) {
        editor.commands.setContent(content);
      }
    },
  }));

  const handleImagePicker = useCallback(() => {
    if (!editor) return;

    if (onImageSelectionRequest) {
      onImageSelectionRequest();
    } else {
      setIsImageLoading(true);

      // Placeholder for image selection logic
      // This could be a modal or file picker to select images
      setTimeout(() => {
        setIsImageLoading(false);
        // Simulate adding an image after selection
        addImage(editor, ["https://example.com/image.jpg"]);
      }, 2000);
    }
  }, [editor, onImageSelectionRequest]);

  useEditorKeyboard(editor);

  const handleInsertMath = useCallback(
    (latex: string) => {
      try {
        if (editor) {
          insertMath(editor, latex);
          setError(null);
        }
      } catch (err) {
        setError(err as Error);
      }
    },
    [editor],
  );

  const handleCloseError = useCallback(() => {
    setError(null);
  }, []);

  const editorStyle = {
    minHeight,
    ...(maxHeight && { maxHeight, overflow: "auto" }),
  };

  return (
    <>
      <div
        className={`custom-editor ${className}`}
        style={editorStyle}
        role="textbox"
        aria-label="Rich text editor"
        aria-multiline="true"
        aria-readonly={readOnly}
      >
        <EditorToolbar
          editor={editor}
          readOnly={readOnly}
          onMathDialogOpen={() => setShowMathDialog(true)}
          onImagePicker={handleImagePicker}
        />

        <EditorContent editor={editor} className="editor-content" />

        <LoadingOverlay isLoading={isImageLoading} />
      </div>

      {showTableControls && (
        <TableControls editor={editor} readOnly={readOnly} />
      )}
      {showCharacterCount && <CharacterCount editor={editor} />}

      {showMathDialog && (
        <MathEquationDialog
          onClose={() => setShowMathDialog(false)}
          onInsert={handleInsertMath}
        />
      )}

      {error && (
        <div className="error-message" role="alert">
          <p>Error inserting math equation: {error.message}</p>
          <button
            onClick={handleCloseError}
            className="error-close"
            aria-label="Close error message"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
});

Editor.displayName = "Editor";
