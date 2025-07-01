import ToolbarButton from "./ToolbarButton";

interface ListControlsProps {
  /**
   * The Tiptap editor instance
   */
  editor: any;
  /**
   * Whether the editor is in read-only mode
   */
  readOnly?: boolean;
}

const ListControls = ({ editor, readOnly }: ListControlsProps) => {
  return (
    <div className="toolbar-group" role="group" aria-label="Lists">
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        isActive={editor?.isActive("bulletList")}
        title="Bullet List"
        disabled={!editor || readOnly}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="9" y1="6" x2="20" y2="6" />
          <line x1="9" y1="12" x2="20" y2="12" />
          <line x1="9" y1="18" x2="20" y2="18" />
          <circle cx="5" cy="6" r="1" />
          <circle cx="5" cy="12" r="1" />
          <circle cx="5" cy="18" r="1" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        isActive={editor?.isActive("orderedList")}
        title="Numbered List"
        disabled={!editor || readOnly}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="11" y1="6" x2="20" y2="6" />
          <line x1="11" y1="12" x2="20" y2="12" />
          <line x1="11" y1="18" x2="20" y2="18" />
          <text x="5" y="8" fontSize="4">
            1
          </text>
          <text x="5" y="14" fontSize="4">
            2
          </text>
          <text x="5" y="20" fontSize="4">
            3
          </text>
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleTaskList().run()}
        isActive={editor?.isActive("taskList")}
        title="Task List"
        disabled={!editor || readOnly}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M9 12l2 2l4 -4" />
        </svg>
      </ToolbarButton>
    </div>
  );
};

export default ListControls;
