import { setBackgroundColor } from "../../utils";
import type { Editor } from "@tiptap/react";

interface ColorControlsProps {
  editor: Editor | null;
  readOnly?: boolean;
}

const ColorControls = ({ editor, readOnly }: ColorControlsProps) => {
  const textColor = editor?.getAttributes("textStyle")?.color || "#000000";
  const bgColor =
    editor?.getAttributes("backgroundColor")?.backgroundColor || "#ffffff";

  return (
    <div className="toolbar-group" role="group" aria-label="Colors">
      <label className="toolbar-color" title="Text color">
        <span className="toolbar-color-icon" aria-hidden="true">
          A
          <i style={{ background: textColor }} />
        </span>
        <input
          type="color"
          aria-label="Text color"
          disabled={!editor || readOnly}
          value={/^#[0-9A-Fa-f]{6}$/.test(textColor) ? textColor : "#000000"}
          onChange={(e) =>
            editor?.chain().focus().setColor(e.target.value).run()
          }
        />
      </label>
      <label className="toolbar-color" title="Highlight color">
        <span className="toolbar-color-icon toolbar-color-icon-bg" aria-hidden="true">
          <i style={{ background: bgColor }} />
        </span>
        <input
          type="color"
          aria-label="Background color"
          disabled={!editor || readOnly}
          value={/^#[0-9A-Fa-f]{6}$/.test(bgColor) ? bgColor : "#ffffff"}
          onChange={(e) => setBackgroundColor(editor, e.target.value)}
        />
      </label>
    </div>
  );
};

export default ColorControls;
