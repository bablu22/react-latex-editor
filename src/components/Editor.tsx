import { EditorContent, useEditor, type Editor as TiptapEditor } from "@tiptap/react";
import {
  useCallback,
  useImperativeHandle,
  useState,
  forwardRef,
  useMemo,
  useEffect,
  useRef,
} from "react";
import {
  addImage,
  addImagesFromFiles,
  getEditorProps,
  insertMath,
  insertSvg,
} from "../utils";
import { getEditorExtensions } from "../utils/editorConfig";
import EditorToolbar from "./EditorToolbar";
import LoadingOverlay from "./LoadingOverlay";
import "../styles/editor.css";
import MathEquationDialog from "./MathEquationDialog";
import { useEditorKeyboard } from "../hooks/useEditorKeyboard";
import TableControls from "./TableControls";
import CharacterCount from "./CharacterCount";
import ErrorBoundary from "./ErrorBoundary";
import ImagePickerDialog from "./ImagePickerDialog";
import { IMAGE_ACCEPT, filesToImageSources } from "../utils/media";
import type { ImageInsertInput } from "../types/editor";

export interface EditorRef {
  /**
   * Insert image(s) or SVG figure(s).
   * Accepts URL strings or `{ src, mediaType: "svg" }` objects.
   */
  addImage: (input: ImageInsertInput) => void;
  /**
   * Insert an SVG from markup, URL, data URL, or File.
   */
  addSvg: (source: string | File, options?: { alt?: string; width?: string }) => Promise<void>;
  /**
   * Insert images/SVGs from a FileList (e.g. from your own file input).
   * Converts to data URLs so content persists when saved via getHTML().
   */
  addImagesFromFiles: (files: FileList | File[]) => Promise<void>;
  getHTML: () => string;
  getJSON: () => Record<string, unknown>;
  getText: () => string;
  setContent: (content: string) => void;
  clearContent: () => void;
  focus: () => void;
  blur: () => void;
  isEmpty: () => boolean;
  getEditor: () => TiptapEditor | null;
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
   * Callback for image selection requests.
   * If omitted, a built-in image picker dialog is shown.
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
  /**
   * Callback when an error occurs
   */
  onError?: (error: Error) => void;
}

export const Editor = forwardRef<EditorRef, EditorProps>((props, ref) => {
  const [showMathDialog, setShowMathDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    initialContent = "<p></p>",
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
    onError,
  } = props;

  const extensions = useMemo(
    () => getEditorExtensions({ placeholder }),
    [placeholder],
  );

  const editor = useEditor({
    content: initialContent,
    editable: !readOnly,
    autofocus: autoFocus,
    immediatelyRender: false,
    editorProps: getEditorProps({
      className,
      placeholder,
    }),
    onUpdate: ({ editor: ed }) => {
      onChange?.(ed.getHTML());
    },
    extensions,
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(!readOnly);
    }
  }, [editor, readOnly]);

  useImperativeHandle(
    ref,
    () => ({
      addImage: (input: ImageInsertInput) => {
        if (editor) addImage(editor, input);
      },
      addSvg: (source, options) => {
        if (!editor) {
          return Promise.reject(new Error("Editor is not ready"));
        }
        return insertSvg(editor, source, options);
      },
      addImagesFromFiles: (files) => {
        if (!editor) {
          return Promise.reject(new Error("Editor is not ready"));
        }
        return addImagesFromFiles(editor, files);
      },
      getHTML: () => editor?.getHTML() ?? "",
      getJSON: () => (editor?.getJSON() as Record<string, unknown>) ?? {},
      getText: () => editor?.getText() ?? "",
      setContent: (content: string) => {
        editor?.commands.setContent(content);
      },
      clearContent: () => {
        editor?.commands.clearContent(true);
      },
      focus: () => {
        editor?.commands.focus();
      },
      blur: () => {
        editor?.commands.blur();
      },
      isEmpty: () => editor?.isEmpty ?? true,
      getEditor: () => editor,
    }),
    [editor],
  );

  const reportError = useCallback(
    (err: Error) => {
      setError(err);
      onError?.(err);
    },
    [onError],
  );

  const handleBuiltInFilePick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files?.length || !editor) return;

      setIsImageLoading(true);
      try {
        const items = await filesToImageSources(files);
        addImage(
          editor,
          items.map((item) => ({
            src: item.src,
            alt: item.alt,
            mediaType: (item.isSvg ? "svg" : "image") as "svg" | "image",
          })),
        );
        setError(null);
      } catch (err) {
        reportError(err instanceof Error ? err : new Error("Failed to add image"));
      } finally {
        setIsImageLoading(false);
        e.target.value = "";
      }
    },
    [editor, reportError],
  );

  const handleImagePicker = useCallback(() => {
    if (!editor || readOnly) return;

    if (onImageSelectionRequest) {
      onImageSelectionRequest();
    } else {
      setShowImageDialog(true);
    }
  }, [editor, onImageSelectionRequest, readOnly]);

  const handleImageSelect = useCallback(
    (
      items: Array<{
        src: string;
        alt?: string;
        mediaType?: "image" | "svg";
      }>,
    ) => {
      if (editor) {
        addImage(editor, items);
      }
    },
    [editor],
  );

  const openMathDialog = useCallback(() => {
    if (!readOnly) setShowMathDialog(true);
  }, [readOnly]);

  useEditorKeyboard(editor, {
    onMathDialogOpen: openMathDialog,
  });

  const handleInsertMath = useCallback(
    (latex: string, displayMode = false) => {
      try {
        if (editor) {
          insertMath(editor, latex, displayMode);
          setError(null);
        }
      } catch (err) {
        reportError(err instanceof Error ? err : new Error("Math insertion failed"));
      }
    },
    [editor, reportError],
  );

  const handleCloseError = useCallback(() => {
    setError(null);
  }, []);

  const editorStyle = {
    minHeight,
    ...(maxHeight && { maxHeight, overflow: "auto" as const }),
  };

  return (
    <ErrorBoundary>
      <div className={`editor-shell ${className}`.trim()}>
        <div
          className="custom-editor"
          style={editorStyle}
          role="application"
          aria-label="Rich text editor"
        >
          <EditorToolbar
            editor={editor}
            readOnly={readOnly}
            onMathDialogOpen={openMathDialog}
            onImagePicker={handleImagePicker}
          />

          <EditorContent editor={editor} className="editor-content" />

          <LoadingOverlay isLoading={isImageLoading} />

          {showCharacterCount && <CharacterCount editor={editor} />}
        </div>

        {showTableControls && (
          <TableControls editor={editor} readOnly={readOnly} />
        )}

        {showMathDialog && (
          <MathEquationDialog
            onClose={() => setShowMathDialog(false)}
            onInsert={handleInsertMath}
          />
        )}

        {!onImageSelectionRequest && (
          <ImagePickerDialog
            isOpen={showImageDialog}
            onClose={() => setShowImageDialog(false)}
            onImageSelect={handleImageSelect}
            onUploadClick={handleBuiltInFilePick}
          />
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={IMAGE_ACCEPT}
          multiple
          hidden
          onChange={handleFileChange}
          aria-hidden="true"
        />

        {error && (
          <div className="error-message" role="alert">
            <p>{error.message}</p>
            <button
              onClick={handleCloseError}
              className="error-close"
              aria-label="Close error message"
              type="button"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
});

Editor.displayName = "Editor";
