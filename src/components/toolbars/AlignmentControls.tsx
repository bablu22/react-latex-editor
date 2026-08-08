import ToolbarButton from "./ToolbarButton";
import type { Editor } from "@tiptap/react";

interface AlignmentControlsProps {
  editor: Editor | null;
  readOnly?: boolean;
}

const AlignmentControls = ({ editor, readOnly }: AlignmentControlsProps) => {
  return (
    <div className="toolbar-group" role="group" aria-label="Text alignment">
      <ToolbarButton
        onClick={() => editor?.chain().focus().setTextAlign("left").run()}
        isActive={editor?.isActive({ textAlign: "left" })}
        title="Align left"
        disabled={!editor || readOnly}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="14" y2="12" />
          <line x1="4" y1="18" x2="18" y2="18" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().setTextAlign("center").run()}
        isActive={editor?.isActive({ textAlign: "center" })}
        title="Align center"
        disabled={!editor || readOnly}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="6" y1="12" x2="18" y2="12" />
          <line x1="8" y1="18" x2="16" y2="18" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().setTextAlign("right").run()}
        isActive={editor?.isActive({ textAlign: "right" })}
        title="Align right"
        disabled={!editor || readOnly}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="10" y1="12" x2="20" y2="12" />
          <line x1="6" y1="18" x2="20" y2="18" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
        isActive={editor?.isActive({ textAlign: "justify" })}
        title="Justify"
        disabled={!editor || readOnly}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </ToolbarButton>
    </div>
  );
};

export default AlignmentControls;
