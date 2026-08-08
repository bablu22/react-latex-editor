import { useEffect } from "react";
import type { Editor } from "@tiptap/react";

export interface UseEditorKeyboardOptions {
  onMathDialogOpen?: () => void;
}

/**
 * Registers editor-scoped shortcuts that TipTap does not already provide.
 * Bold/italic/underline are handled by TipTap extensions — do not duplicate them.
 */
export function useEditorKeyboard(
  editor: Editor | null,
  options?: UseEditorKeyboardOptions,
) {
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!editor.isFocused && !editor.view.hasFocus()) return;

      const mod = e.ctrlKey || e.metaKey;

      // Link: Ctrl/Cmd + K
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const previousUrl = editor.getAttributes("link").href || "";
        const url = window.prompt("Enter URL:", previousUrl);
        if (url === null) return;
        if (url === "") {
          editor.chain().focus().extendMarkRange("link").unsetLink().run();
          return;
        }
        const href = /^(https?:|mailto:|tel:|\/|#)/i.test(url)
          ? url
          : `https://${url}`;
        editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
        return;
      }

      // Math Equation: Ctrl/Cmd + M
      if (mod && e.key.toLowerCase() === "m" && options?.onMathDialogOpen) {
        e.preventDefault();
        options.onMathDialogOpen();
      }
    };

    const dom = editor.view.dom;
    dom.addEventListener("keydown", handleKeyDown);
    return () => dom.removeEventListener("keydown", handleKeyDown);
  }, [editor, options?.onMathDialogOpen]);
}
