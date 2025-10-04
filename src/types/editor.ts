/**
 * Common types and interfaces for the React LaTeX Editor
 */

/**
 * Editor content format
 */
export type EditorContent = string | Record<string, any>;

/**
 * Editor theme configuration
 */
export interface EditorTheme {
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  focusColor?: string;
}

/**
 * Math equation format
 */
export interface MathEquation {
  latex: string;
  displayMode?: boolean;
}

/**
 * Image configuration
 */
export interface ImageConfig {
  src: string;
  alt?: string;
  width?: string;
  height?: string;
  align?: "left" | "center" | "right";
}

/**
 * Editor state
 */
export interface EditorState {
  content: string;
  isEmpty: boolean;
  isFocused: boolean;
  characterCount?: number;
  wordCount?: number;
}

/**
 * Editor event handlers
 */
export interface EditorEventHandlers {
  onChange?: (content: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onImageSelectionRequest?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Export options for editor content
 */
export interface ExportOptions {
  format: "html" | "json" | "text" | "markdown";
  includeStyles?: boolean;
  prettyPrint?: boolean;
}

/**
 * Editor validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
}
