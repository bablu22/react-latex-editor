import ToolbarButton from "./ToolbarButton";

interface ImageAlignmentControlsProps {
  /**
   * The Tiptap editor instance
   */
  editor: any;
  /**
   * Whether the editor is in read-only mode
   */
  readOnly?: boolean;
}

const ImageAlignmentControls = ({
  editor,
  readOnly,
}: ImageAlignmentControlsProps) => {
  // Only show if an image is selected and not in an image group
  if (!editor?.isActive("image") || editor?.isActive("imageGroup")) return null;

  return (
    <div className="toolbar-group" role="group" aria-label="Image alignment">
      <ToolbarButton
        onClick={() =>
          editor
            ?.chain()
            .focus()
            .updateAttributes("image", { align: "left" })
            .run()
        }
        isActive={editor?.isActive("image", { align: "left" })}
        title="Align Image Left"
        disabled={!editor?.isActive("image") || readOnly}
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
            .updateAttributes("image", { align: "center" })
            .run()
        }
        isActive={editor?.isActive("image", { align: "center" })}
        title="Align Image Center"
        disabled={!editor?.isActive("image") || readOnly}
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
            .updateAttributes("image", { align: "right" })
            .run()
        }
        isActive={editor?.isActive("image", { align: "right" })}
        title="Align Image Right"
        disabled={!editor?.isActive("image") || readOnly}
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

export default ImageAlignmentControls;
