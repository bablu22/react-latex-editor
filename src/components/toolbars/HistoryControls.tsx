import ToolbarButton from "./ToolbarButton";
import type { Editor } from "@tiptap/react";

interface HistoryControlsProps {
  editor: Editor | null;
  readOnly?: boolean;
}

const HistoryControls = ({ editor, readOnly }: HistoryControlsProps) => {
  return (
    <div className="toolbar-group" role="group" aria-label="History">
      <ToolbarButton
        onClick={() => editor?.chain().focus().undo().run()}
        title="Undo"
        shortcut="Ctrl+Z"
        disabled={!editor || readOnly || !editor.can().undo()}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7v6h6" />
          <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6.7 3L3 13" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().redo().run()}
        title="Redo"
        shortcut="Ctrl+Shift+Z"
        disabled={!editor || readOnly || !editor.can().redo()}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 7v6h-6" />
          <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6.7 3L21 13" />
        </svg>
      </ToolbarButton>
    </div>
  );
};

export default HistoryControls;
