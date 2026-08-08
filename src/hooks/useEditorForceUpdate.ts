import { useEffect, useReducer } from "react";
import type { Editor } from "@tiptap/react";

/**
 * Re-render when the editor document or selection changes.
 * Needed for toolbar active states, character count, and table controls.
 */
export function useEditorForceUpdate(editor: Editor | null) {
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => forceUpdate();

    editor.on("transaction", handleUpdate);
    editor.on("selectionUpdate", handleUpdate);
    editor.on("focus", handleUpdate);
    editor.on("blur", handleUpdate);

    return () => {
      editor.off("transaction", handleUpdate);
      editor.off("selectionUpdate", handleUpdate);
      editor.off("focus", handleUpdate);
      editor.off("blur", handleUpdate);
    };
  }, [editor]);
}
