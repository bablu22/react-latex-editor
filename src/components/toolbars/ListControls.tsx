import ToolbarButton from "./ToolbarButton";
import type { Editor } from "@tiptap/react";

interface ListControlsProps {
  editor: Editor | null;
  readOnly?: boolean;
}

const ListControls = ({ editor, readOnly }: ListControlsProps) => {
  return (
    <div className="toolbar-group" role="group" aria-label="Lists">
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        isActive={editor?.isActive("bulletList")}
        title="Bullet list"
        disabled={!editor || readOnly}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <line x1="9" y1="6" x2="20" y2="6" />
          <line x1="9" y1="12" x2="20" y2="12" />
          <line x1="9" y1="18" x2="20" y2="18" />
          <circle cx="5" cy="6" r="1" fill="currentColor" />
          <circle cx="5" cy="12" r="1" fill="currentColor" />
          <circle cx="5" cy="18" r="1" fill="currentColor" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        isActive={editor?.isActive("orderedList")}
        title="Numbered list"
        disabled={!editor || readOnly}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <line x1="10" y1="6" x2="20" y2="6" />
          <line x1="10" y1="12" x2="20" y2="12" />
          <line x1="10" y1="18" x2="20" y2="18" />
          <path d="M4 6h1v4" />
          <path d="M4 10h2" />
          <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleTaskList().run()}
        isActive={editor?.isActive("taskList")}
        title="Task list"
        disabled={!editor || readOnly}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="6" height="6" rx="1" />
          <path d="M4.5 8l1.2 1.2L9 6.5" />
          <line x1="13" y1="8" x2="21" y2="8" />
          <rect x="3" y="13" width="6" height="6" rx="1" />
          <line x1="13" y1="16" x2="21" y2="16" />
        </svg>
      </ToolbarButton>
    </div>
  );
};

export default ListControls;
