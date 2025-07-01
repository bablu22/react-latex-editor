import ToolbarButton from "./ToolbarButton";

interface BlockControlsProps {
  /**
   * The Tiptap editor instance
   */
  editor: any;
  /**
   * Whether the editor is in read-only mode
   */
  readOnly?: boolean;
}

const BlockControls = ({ editor, readOnly }: BlockControlsProps) => {
  return (
    <div className="toolbar-group" role="group" aria-label="Blocks">
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        isActive={editor?.isActive("blockquote")}
        title="Blockquote"
        disabled={!editor || readOnly}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().setHorizontalRule().run()}
        title="Horizontal Rule"
        disabled={!editor || readOnly}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().setHardBreak().run()}
        title="Line Break"
        disabled={!editor || readOnly}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 8H3M21 8L17 4M21 8L17 12"></path>
          <path d="M3 16H15M3 16L7 12M3 16L7 20"></path>
        </svg>
      </ToolbarButton>
    </div>
  );
};

export default BlockControls;
