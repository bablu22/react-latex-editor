import ToolbarButton from "./ToolbarButton";
import type { Editor } from "@tiptap/react";

interface BlockControlsProps {
  editor: Editor | null;
  readOnly?: boolean;
}

const BlockControls = ({ editor, readOnly }: BlockControlsProps) => {
  return (
    <div className="toolbar-group" role="group" aria-label="Blocks">
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        isActive={editor?.isActive("blockquote")}
        title="Quote"
        disabled={!editor || readOnly}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
        isActive={editor?.isActive("codeBlock")}
        title="Code block"
        disabled={!editor || readOnly}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M8 10l-2 2 2 2" />
          <path d="M16 10l2 2-2 2" />
          <path d="M13 9l-2 6" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().setHorizontalRule().run()}
        title="Divider"
        disabled={!editor || readOnly}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="12" x2="20" y2="12" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleSubscript().run()}
        isActive={editor?.isActive("subscript")}
        title="Subscript"
        disabled={!editor || readOnly}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 7l8 10m-8 0l8-10" />
          <path d="M21 20h-4l3.5-4a1.73 1.73 0 0 0-3.5-2" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleSuperscript().run()}
        isActive={editor?.isActive("superscript")}
        title="Superscript"
        disabled={!editor || readOnly}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 7l8 10m-8 0l8-10" />
          <path d="M21 11h-4l3.5-4a1.73 1.73 0 0 0-3.5-2" />
        </svg>
      </ToolbarButton>
    </div>
  );
};

export default BlockControls;
