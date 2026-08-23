// Export main components
export { Editor } from "./components/Editor";
export { default as Viewer } from "./components/Viewer";
export { default as ErrorBoundary } from "./components/ErrorBoundary";
export { default as ImagePickerDialog } from "./components/ImagePickerDialog";

// Export types
export type { EditorProps, EditorRef } from "./components/Editor";
export type { MathfieldElement } from "./types/mathlive";
export type {
  EditorContent,
  EditorTheme,
  MathEquation,
  ImageConfig,
  ImageInsertItem,
  ImageInsertInput,
  EditorState,
  EditorEventHandlers,
  ExportOptions,
  ValidationResult,
} from "./types/editor";

// Export utilities
export {
  addImage,
  addImagesFromFiles,
  getEditorProps,
  insertMath,
  insertSvg,
  normalizeUrl,
} from "./utils";
export { getEditorContentStats } from "./utils/contentStats";
export type { EditorContentStats } from "./utils/contentStats";
export {
  getEditorExtensions,
  type EditorExtensionOptions,
} from "./utils/editorConfig";
export { ensureMathLiveLoaded } from "./types/mathlive";
export {
  validateLatex,
  sanitizeHtml,
  extractTextFromHtml,
  countWords,
  formatFileSize,
  debounce,
  throttle,
  checkBrowserSupport,
  deepClone,
  isContentEmpty,
  generateId,
} from "./utils/helpers";
export {
  IMAGE_ACCEPT,
  SVG_ACCEPT,
  isSupportedImageFile,
  isSvgFile,
  isSvgSource,
  isLikelySvgMarkup,
  fileToDataUrl,
  sanitizeSvgMarkup,
  svgMarkupToDataUrl,
  filesToImageSources,
} from "./utils/media";

// Export hooks
export { useEditorKeyboard } from "./hooks/useEditorKeyboard";
export {
  useEditorState,
  useEditorAutoSave,
  useEditorSelection,
  useEditorHistory,
} from "./hooks/useEditorState";
export { useResponsive } from "./hooks/useResponsive";
export { useEditorForceUpdate } from "./hooks/useEditorForceUpdate";

// Export extensions (for advanced users who want to customize)
export { default as MathNode } from "./extensions/MathNode";
export { default as InlineMath } from "./extensions/InlineMath";
export { default as ResizableImageExtension } from "./extensions/ResizableImageExtension";
export { default as ImageGroup } from "./extensions/ImageGroup";
export { default as CustomTextStyle } from "./extensions/CustomTextStyle";
export { default as BackgroundColor } from "./extensions/BackgroundColor";
export { default as ResizableYoutubeExtension } from "./extensions/ResizableYoutubeExtension";

// Export constants
export {
  DEFAULT_CONFIG,
  MATH_DELIMITERS,
  KEYBOARD_SHORTCUTS,
  SUPPORTED_IMAGE_FORMATS,
  MAX_FILE_SIZE,
  EDITOR_LIMITS,
  DEFAULT_COLORS,
  FONT_FAMILIES,
  FONT_SIZES,
  HEADING_LEVELS,
  Z_INDEX,
} from "./constants/config";
