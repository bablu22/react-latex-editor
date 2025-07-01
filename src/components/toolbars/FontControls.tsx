import { FONT_FAMILIES, FONT_SIZES } from "../../constants/editorConstants";
import { setBackgroundColor, setFontFamily, setFontSize } from "../../utils";

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
    <div className="toolbar-group" role="group" aria-label="Font style">
      {/* Font Family */}
      <div className="tooltip-container">
        <select
          onChange={(e) => setFontFamily(editor, e.target.value)}
          disabled={!editor || readOnly}
          defaultValue=""
          style={{
            height: 36,
            marginRight: 4,
            minWidth: 110,
            fontSize: "12px",
          }}
          aria-label="Font family"
        >
          <option value="">Font</option>
          {FONT_FAMILIES.map((f) => (
            <option key={f.value} value={f.value}>
              {f.name}
            </option>
          ))}
        </select>
        <div className="tooltip">Select Font Family</div>
      </div>

      {/* Font Size */}
      <div className="tooltip-container">
        <select
          onChange={(e) => setFontSize(editor, e.target.value)}
          disabled={!editor || readOnly}
          defaultValue=""
          style={{ height: 36, marginRight: 4, minWidth: 65, fontSize: "12px" }}
          aria-label="Font size"
        >
          <option value="">Size</option>
          {FONT_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <div className="tooltip">Select Font Size</div>
      </div>

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
