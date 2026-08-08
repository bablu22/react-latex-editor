import { setFontFamily, setFontSize } from "../../utils";
import { FONT_FAMILIES, FONT_SIZES } from "../../constants/editorConstants";
import type { Editor } from "@tiptap/react";

export interface FontControlsProps {
  editor: Editor | null;
  readOnly?: boolean;
}

const FontControls = ({ editor, readOnly }: FontControlsProps) => {
  const currentFontSize =
    editor?.getAttributes("customTextStyle")?.fontSize || "";
  const currentFontFamily =
    editor?.getAttributes("customTextStyle")?.fontFamily || "";

  return (
    <div className="toolbar-group toolbar-font-controls" role="group" aria-label="Font">
      <select
        className="toolbar-select toolbar-select-font"
        aria-label="Font family"
        disabled={!editor || readOnly}
        value={currentFontFamily}
        onChange={(e) => setFontFamily(editor, e.target.value)}
      >
        {FONT_FAMILIES.map((font) => (
          <option key={font.name} value={font.value}>
            {font.name}
          </option>
        ))}
      </select>

      <select
        className="toolbar-select toolbar-select-size"
        aria-label="Font size"
        disabled={!editor || readOnly}
        value={currentFontSize}
        onChange={(e) => {
          if (e.target.value) setFontSize(editor, e.target.value);
          else editor?.chain().focus().unsetMark("customTextStyle").run();
        }}
      >
        <option value="">Size</option>
        {FONT_SIZES.map((size) => (
          <option key={size} value={size}>
            {size.replace("px", "")}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FontControls;
