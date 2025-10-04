/**
 * Configuration constants for the editor
 */

/**
 * Default editor configuration
 */
export const DEFAULT_CONFIG = {
  minHeight: "300px",
  maxHeight: "800px",
  placeholder: "Start typing...",
  autoFocus: false,
  showCharacterCount: true,
  showTableControls: true,
} as const;

/**
 * Math equation delimiters
 */
export const MATH_DELIMITERS = {
  inline: "$",
  block: "$$",
} as const;

/**
 * Editor keyboard shortcuts
 */
export const KEYBOARD_SHORTCUTS = {
  bold: "Mod-b",
  italic: "Mod-i",
  underline: "Mod-u",
  strike: "Mod-Shift-x",
  code: "Mod-e",
  undo: "Mod-z",
  redo: "Mod-Shift-z",
  save: "Mod-s",
  link: "Mod-k",
  math: "Mod-m",
} as const;

/**
 * Supported image formats
 */
export const SUPPORTED_IMAGE_FORMATS = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
] as const;

/**
 * Max file sizes (in bytes)
 */
export const MAX_FILE_SIZE = {
  image: 5 * 1024 * 1024, // 5MB
  video: 50 * 1024 * 1024, // 50MB
} as const;

/**
 * Editor limits
 */
export const EDITOR_LIMITS = {
  maxCharacters: 100000,
  maxImages: 50,
  maxTables: 20,
  maxMathEquations: 200,
} as const;

/**
 * Default colors for text and background
 */
export const DEFAULT_COLORS = [
  "#000000",
  "#ffffff",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
] as const;

/**
 * Font families
 */
export const FONT_FAMILIES = [
  { label: "Default", value: "" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Times New Roman", value: "Times New Roman, serif" },
  { label: "Courier New", value: "Courier New, monospace" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Verdana", value: "Verdana, sans-serif" },
  { label: "Comic Sans", value: "Comic Sans MS, cursive" },
  { label: "Impact", value: "Impact, sans-serif" },
  { label: "Trebuchet", value: "Trebuchet MS, sans-serif" },
] as const;

/**
 * Font sizes
 */
export const FONT_SIZES = [
  { label: "8", value: "8px" },
  { label: "10", value: "10px" },
  { label: "12", value: "12px" },
  { label: "14", value: "14px" },
  { label: "16", value: "16px" },
  { label: "18", value: "18px" },
  { label: "20", value: "20px" },
  { label: "24", value: "24px" },
  { label: "28", value: "28px" },
  { label: "32", value: "32px" },
  { label: "36", value: "36px" },
  { label: "48", value: "48px" },
  { label: "64", value: "64px" },
] as const;

/**
 * Heading levels
 */
export const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const;

/**
 * Z-index layers
 */
export const Z_INDEX = {
  base: 1,
  dropdown: 10,
  toolbar: 50,
  modal: 100,
  tooltip: 150,
  notification: 200,
} as const;
