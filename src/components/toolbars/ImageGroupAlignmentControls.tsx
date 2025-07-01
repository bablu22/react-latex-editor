import ToolbarButton from "./ToolbarButton";

interface ImageGroupAlignmentControlsProps {
  /**
   * The Tiptap editor instance
   */
  editor: any;
  /**
   * Whether the editor is in read-only mode
   */
  readOnly?: boolean;
}

const ImageGroupAlignmentControls = ({
  editor,
  readOnly,
}: ImageGroupAlignmentControlsProps) => {
  // Only show if an image group is selected
  if (!editor?.isActive("imageGroup")) return null;

  return (
    <div
      className="toolbar-group"
      role="group"
      aria-label="Image group alignment"
    >
      <ToolbarButton
        onClick={() =>
          editor
            ?.chain()
            .focus()
            .updateAttributes("imageGroup", { align: "left" })
            .run()
        }
        isActive={editor?.isActive("imageGroup", { align: "left" })}
        title="Align Group Left"
        disabled={!editor?.isActive("imageGroup") || readOnly}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="15" y2="12"></line>
          <line x1="3" y1="18" x2="18" y2="18"></line>
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() =>
          editor
            ?.chain()
            .focus()
            .updateAttributes("imageGroup", { align: "center" })
            .run()
        }
        isActive={editor?.isActive("imageGroup", { align: "center" })}
        title="Align Group Center"
        disabled={!editor?.isActive("imageGroup") || readOnly}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="6" y1="12" x2="18" y2="12"></line>
          <line x1="4" y1="18" x2="20" y2="18"></line>
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() =>
          editor
            ?.chain()
            .focus()
            .updateAttributes("imageGroup", { align: "right" })
            .run()
        }
        isActive={editor?.isActive("imageGroup", { align: "right" })}
        title="Align Group Right"
        disabled={!editor?.isActive("imageGroup") || readOnly}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="9" y1="12" x2="21" y2="12"></line>
          <line x1="6" y1="18" x2="21" y2="18"></line>
        </svg>
      </ToolbarButton>
    </div>
  );
};

export default ImageGroupAlignmentControls;
