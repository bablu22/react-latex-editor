import { useEffect } from "react";

export interface UseEditorKeyboardOptions {
  onMathDialogOpen?: () => void;
}

export function useEditorKeyboard(
  editor: any,
  options?: UseEditorKeyboardOptions,
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!editor) return;

      // Bold: Ctrl/Cmd + B
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        editor.chain().focus().toggleBold().run();
      }
      // Italic: Ctrl/Cmd + I
      if ((e.ctrlKey || e.metaKey) && e.key === "i") {
        e.preventDefault();
        editor.chain().focus().toggleItalic().run();
      }
      // Underline: Ctrl/Cmd + U
      if ((e.ctrlKey || e.metaKey) && e.key === "u") {
        e.preventDefault();
        editor.chain().focus().toggleUnderline().run();
      }
      // Code Block: Ctrl/Cmd + Shift + C
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "c") {
        e.preventDefault();
        editor.chain().focus().toggleCodeBlock().run();
      }
      // Link: Ctrl/Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const url = window.prompt("Enter URL:");
        if (url) {
          editor.chain().focus().setLink({ href: url }).run();
        }
      }
      // Math Equation: Ctrl/Cmd + M
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key === "m" &&
        options?.onMathDialogOpen
      ) {
        e.preventDefault();
        options.onMathDialogOpen();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [editor, options]);
}
