import ToolbarButton from "./ToolbarButton";
import { insertTable } from "../../utils/editorUtils";

interface SpecialFeaturesControlsProps {
  /**
   * The Tiptap editor instance
   */
  editor: any;
  /**
   * Whether the editor is in read-only mode
   */
  readOnly?: boolean;
  /**
   * Callback for opening the math dialog
   */
  onMathDialogOpen: () => void;
  /**
   * Callback for image picker
   */
  onImagePicker: () => void;
}

const SpecialFeaturesControls = ({
  editor,
  readOnly,
  onMathDialogOpen,
  onImagePicker,
}: SpecialFeaturesControlsProps) => {
  return (
    <div className="toolbar-group" role="group" aria-label="Special features">
      <ToolbarButton
        onClick={onMathDialogOpen}
        title="Insert Math Equation"
        disabled={!editor || readOnly}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-math"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M19 5h-7l-4 14l-3 -6h-2" />
          <path d="M14 13l6 6" />
          <path d="M14 19l6 -6" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={onImagePicker}
        title="Insert Image"
        disabled={!editor || readOnly}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => insertTable(editor)}
        title="Insert Table"
        disabled={!editor || readOnly}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 3h18v18H3zM12 3v18M3 12h18M3 8h18M3 16h18"></path>
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          const url = window.prompt("Enter YouTube video URL:");
          if (url) {
            editor.chain().focus().setYoutubeVideo({ src: url }).run();
          }
        }}
        title="Insert YouTube Video"
        disabled={!editor || readOnly}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="4" width="20" height="16" rx="3" />
          <polygon points="10,9 16,12 10,15" fill="currentColor" />
        </svg>
      </ToolbarButton>
    </div>
  );
};

export default SpecialFeaturesControls;
