import ToolbarButton from "./ToolbarButton";

interface YouTubeControlsProps {
  /**
   * The Tiptap editor instance
   */
  editor: any;
  /**
   * Whether the editor is in read-only mode
   */
  readOnly?: boolean;
}

const YouTubeControls = ({ editor, readOnly }: YouTubeControlsProps) => {
  // Only show if a YouTube video is selected
  if (!editor?.isActive("youtube")) return null;

  return (
    <div
      className="toolbar-group"
      role="group"
      aria-label="YouTube controls"
      style={{ display: "flex", alignItems: "center", gap: 8 }}
    >
      {/* Alignment Buttons */}
      <ToolbarButton
        onClick={() =>
          editor
            ?.chain()
            .focus()
            .updateAttributes("youtube", { align: "left" })
            .run()
        }
        isActive={editor?.isActive("youtube", { align: "left" })}
        title="Align YouTube Left"
        disabled={!editor?.isActive("youtube") || readOnly}
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
            .updateAttributes("youtube", { align: "center" })
            .run()
        }
        isActive={editor?.isActive("youtube", { align: "center" })}
        title="Align YouTube Center"
        disabled={!editor?.isActive("youtube") || readOnly}
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
            .updateAttributes("youtube", { align: "right" })
            .run()
        }
        isActive={editor?.isActive("youtube", { align: "right" })}
        title="Align YouTube Right"
        disabled={!editor?.isActive("youtube") || readOnly}
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
      {/* Width/Height Inputs */}
      <input
        type="number"
        min={100}
        max={1920}
        step={10}
        value={parseInt(editor.getAttributes("youtube").width || 640, 10)}
        onChange={(e) =>
          editor
            .chain()
            .focus()
            .updateAttributes("youtube", {
              width: `${e.target.value}px`,
            })
            .run()
        }
        style={{
          width: 60,
          marginLeft: 8,
          marginRight: 2,
          fontSize: 14,
          padding: "2px 4px",
        }}
        aria-label="YouTube width"
        disabled={!editor?.isActive("youtube") || readOnly}
        title="YouTube Width"
      />
      <span style={{ fontSize: 14 }}>×</span>
      <input
        type="number"
        min={56}
        max={1080}
        step={10}
        value={parseInt(editor.getAttributes("youtube").height || 360, 10)}
        onChange={(e) =>
          editor
            .chain()
            .focus()
            .updateAttributes("youtube", {
              height: `${e.target.value}px`,
            })
            .run()
        }
        style={{
          width: 60,
          marginLeft: 2,
          fontSize: 14,
          padding: "2px 4px",
        }}
        aria-label="YouTube height"
        disabled={!editor?.isActive("youtube") || readOnly}
        title="YouTube Height"
      />
    </div>
  );
};

export default YouTubeControls;
