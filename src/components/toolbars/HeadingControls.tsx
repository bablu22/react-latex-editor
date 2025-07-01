import { HEADING_LEVELS } from "../../constants/editorConstants";
import ToolbarButton from "./ToolbarButton";

interface HeadingControlsProps {
  /**
   * The Tiptap editor instance
   */
  editor: any;
  /**
   * Whether the editor is in read-only mode
   */
  readOnly?: boolean;
}

const HeadingControls = ({ editor, readOnly }: HeadingControlsProps) => {
  return (
    <div className="toolbar-group" role="group" aria-label="Headings">
      {HEADING_LEVELS.map((level) => (
        <ToolbarButton
          key={level}
          onClick={() => editor?.chain().focus().toggleHeading({ level }).run()}
          isActive={editor?.isActive("heading", { level })}
          title={`Heading ${level}`}
          disabled={!editor || readOnly}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-heading"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M7 12h10" />
            <path d="M7 5v14" />
            <path d="M17 5v14" />
            <path d="M15 19h4" />
            <path d="M15 5h4" />
            <path d="M5 19h4" />
            <path d="M5 5h4" />
          </svg>
          {level}
        </ToolbarButton>
      ))}
    </div>
  );
};

export default HeadingControls;
