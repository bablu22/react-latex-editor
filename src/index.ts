// Export main components
export { Editor } from "./components/Editor";
export { default as Viewer } from "./components/Viewer";

// Export types
export type { EditorProps, EditorRef } from "./components/Editor";
export type { MathfieldElement } from "./types/mathlive";

// Export utilities
export { addImage, getEditorProps, insertMath } from "./utils";
export { getEditorExtensions } from "./utils/editorConfig";
export { ensureMathLiveLoaded } from "./types/mathlive";

// Export hooks
export { useEditorKeyboard } from "./hooks/useEditorKeyboard";

// Export extensions (for advanced users who want to customize)
export { default as MathNode } from "./extensions/MathNode";
export { default as InlineMath } from "./extensions/InlineMath";
export { default as ResizableImageExtension } from "./extensions/ResizableImageExtension";
export { default as ImageGroup } from "./extensions/ImageGroup";
export { default as CustomTextStyle } from "./extensions/CustomTextStyle";
export { default as BackgroundColor } from "./extensions/BackgroundColor";
export { default as ResizableYoutubeExtension } from "./extensions/ResizableYoutubeExtension";
