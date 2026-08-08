import { HEADING_LEVELS } from "../../constants/editorConstants";
import type { Editor } from "@tiptap/react";
import type { Level } from "@tiptap/extension-heading";

interface HeadingControlsProps {
  editor: Editor | null;
  readOnly?: boolean;
}

function getCurrentHeading(editor: Editor | null): string {
  if (!editor) return "paragraph";
  for (const level of HEADING_LEVELS) {
    if (editor.isActive("heading", { level })) return String(level);
  }
  return "paragraph";
}

const HeadingControls = ({ editor, readOnly }: HeadingControlsProps) => {
  const value = getCurrentHeading(editor);

  return (
    <div className="toolbar-group" role="group" aria-label="Block style">
      <select
        className="toolbar-select toolbar-select-heading"
        aria-label="Text style"
        disabled={!editor || readOnly}
        value={value}
        onChange={(e) => {
          if (!editor) return;
          const next = e.target.value;
          if (next === "paragraph") {
            editor.chain().focus().setParagraph().run();
            return;
          }
          editor
            .chain()
            .focus()
            .toggleHeading({ level: Number(next) as Level })
            .run();
        }}
      >
        <option value="paragraph">Paragraph</option>
        {HEADING_LEVELS.map((level) => (
          <option key={level} value={level}>
            Heading {level}
          </option>
        ))}
      </select>
    </div>
  );
};

export default HeadingControls;
