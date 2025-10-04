import { useCallback, useEffect, useState } from "react";
import { Editor as TiptapEditor } from "@tiptap/react";

/**
 * Hook to track editor state and statistics
 */
export function useEditorState(editor: TiptapEditor | null) {
  const [state, setState] = useState({
    isEmpty: true,
    isFocused: false,
    characterCount: 0,
    wordCount: 0,
    canUndo: false,
    canRedo: false,
  });

  useEffect(() => {
    if (!editor) return;

    const updateState = () => {
      const text = editor.getText();
      const characterCount = editor.storage.characterCount?.characters() || 0;
      const wordCount = text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;

      setState({
        isEmpty: editor.isEmpty,
        isFocused: editor.isFocused,
        characterCount,
        wordCount,
        canUndo: editor.can().undo(),
        canRedo: editor.can().redo(),
      });
    };

    // Update state on editor changes
    editor.on("update", updateState);
    editor.on("focus", updateState);
    editor.on("blur", updateState);
    editor.on("selectionUpdate", updateState);

    // Initial update
    updateState();

    return () => {
      editor.off("update", updateState);
      editor.off("focus", updateState);
      editor.off("blur", updateState);
      editor.off("selectionUpdate", updateState);
    };
  }, [editor]);

  return state;
}

/**
 * Hook to manage editor content with auto-save
 */
export function useEditorAutoSave(
  editor: TiptapEditor | null,
  onSave: (content: string) => void | Promise<void>,
  delay: number = 2000,
) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (!editor) return;

    let timeoutId: NodeJS.Timeout;

    const handleUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        setIsSaving(true);
        try {
          await onSave(editor.getHTML());
          setLastSaved(new Date());
        } catch (error) {
          console.error("Auto-save failed:", error);
        } finally {
          setIsSaving(false);
        }
      }, delay);
    };

    editor.on("update", handleUpdate);

    return () => {
      clearTimeout(timeoutId);
      editor.off("update", handleUpdate);
    };
  }, [editor, onSave, delay]);

  return { isSaving, lastSaved };
}

/**
 * Hook to handle editor selection
 */
export function useEditorSelection(editor: TiptapEditor | null) {
  const [selection, setSelection] = useState({
    from: 0,
    to: 0,
    empty: true,
  });

  useEffect(() => {
    if (!editor) return;

    const updateSelection = () => {
      const { from, to, empty } = editor.state.selection;
      setSelection({ from, to, empty });
    };

    editor.on("selectionUpdate", updateSelection);
    updateSelection();

    return () => {
      editor.off("selectionUpdate", updateSelection);
    };
  }, [editor]);

  const getSelectedText = useCallback(() => {
    if (!editor) return "";
    const { from, to } = editor.state.selection;
    return editor.state.doc.textBetween(from, to, " ");
  }, [editor]);

  return { ...selection, getSelectedText };
}

/**
 * Hook for undo/redo history management
 */
export function useEditorHistory(editor: TiptapEditor | null) {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const updateHistory = () => {
      setCanUndo(editor.can().undo());
      setCanRedo(editor.can().redo());
    };

    editor.on("update", updateHistory);
    editor.on("transaction", updateHistory);
    updateHistory();

    return () => {
      editor.off("update", updateHistory);
      editor.off("transaction", updateHistory);
    };
  }, [editor]);

  const undo = useCallback(() => {
    editor?.commands.undo();
  }, [editor]);

  const redo = useCallback(() => {
    editor?.commands.redo();
  }, [editor]);

  return { canUndo, canRedo, undo, redo };
}
