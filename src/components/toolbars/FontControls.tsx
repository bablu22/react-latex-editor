import { setBackgroundColor } from "../../utils";

export interface FontControlsProps {
  /**
   * The Tiptap editor instance
   */
  editor: any;
  /**
   * Whether the editor is in read-only mode
   */
  readOnly?: boolean;
}

const FontControls = ({ editor, readOnly }: FontControlsProps) => {
  return (
    <div className="toolbar-group" role="group" aria-label="Color controls">
      {/* Text Color */}
      <div className="tooltip-container" style={{ position: "relative" }}>
        <input
          type="color"
          aria-label="Text Color"
          disabled={!editor || readOnly}
          onChange={(e) =>
            editor?.chain().focus().setColor(e.target.value).run()
          }
          style={{
            width: 36,
            height: 36,
            border: "2px solid rgba(226, 232, 240, 0.8)",
            borderRadius: "0.375rem",
            background: "none",
            cursor: "pointer",
            marginRight: 4,
          }}
        />
        <div className="tooltip">Text Color</div>
      </div>

      {/* Background Color */}
      <div className="tooltip-container" style={{ position: "relative" }}>
        <input
          type="color"
          aria-label="Background Color"
          disabled={!editor || readOnly}
          onChange={(e) => setBackgroundColor(editor, e.target.value)}
          style={{
            width: 36,
            height: 36,
            border: "2px solid rgba(226, 232, 240, 0.8)",
            borderRadius: "0.375rem",
            background: "none",
            cursor: "pointer",
            marginRight: 4,
          }}
        />
        <div className="tooltip">Background Color</div>
      </div>
    </div>
  );
};

export default FontControls;
