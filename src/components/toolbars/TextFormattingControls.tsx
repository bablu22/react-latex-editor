import ToolbarButton from "./ToolbarButton";
import { setBackgroundColor } from "../../utils";

interface TextFormattingControlsProps {
  /** * The Tiptap editor instance
   */
  editor: any;
  /**
   * Whether the editor is in read-only mode
   */
  readOnly?: boolean;
}

const TextFormattingControls = ({
  editor,
  readOnly,
}: TextFormattingControlsProps) => {
  return (
    <div className="toolbar-group" role="group" aria-label="Text formatting">
      {/* Link Button */}
      <ToolbarButton
        onClick={() => {
          if (!editor) return;
          const previousUrl = editor.getAttributes("link").href || "";
          const url = window.prompt("Enter URL:", previousUrl);
          if (url === null) return; // Cancelled
          if (url === "") {
            editor.chain().focus().unsetLink().run();
            return;
          }
          editor.chain().focus().setLink({ href: url }).run();
        }}
        isActive={editor?.isActive("link")}
        title="Insert/Edit Link"
        shortcut="Ctrl+K"
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
          <path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"></path>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      </ToolbarButton>
      {/* Unlink Button (only active if selection is a link) */}
      <ToolbarButton
        onClick={() => editor?.chain().focus().unsetLink().run()}
        isActive={false}
        title="Remove Link"
        disabled={!editor || readOnly || !editor?.isActive("link")}
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
          <path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"></path>
          <line x1="8" y1="12" x2="16" y2="12"></line>
          <line x1="17" y1="7" x2="7" y2="17"></line>
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleBold().run()}
        isActive={editor?.isActive("bold")}
        title="Bold"
        shortcut="Ctrl+B"
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
          <path d="M7 5h6a3 3 0 0 1 0 6H7z" />
          <path d="M7 11h8a3 3 0 0 1 0 6H7z" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        isActive={editor?.isActive("italic")}
        title="Italic"
        shortcut="Ctrl+I"
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
          <line x1="19" y1="4" x2="10" y2="4" />
          <line x1="14" y1="20" x2="5" y2="20" />
          <line x1="15" y1="4" x2="9" y2="20" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleUnderline().run()}
        isActive={editor?.isActive("underline")}
        title="Underline"
        shortcut="Ctrl+U"
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
          <path d="M6 4v6a6 6 0 0 0 12 0V4" />
          <line x1="4" y1="20" x2="20" y2="20" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleStrike().run()}
        isActive={editor?.isActive("strike")}
        title="Strike-through"
        shortcut="Ctrl+Shift+S"
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
          className="icon icon-tabler icons-tabler-outline icon-tabler-strikethrough"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M5 12l14 0" />
          <path d="M16 6.5a4 2 0 0 0 -4 -1.5h-1a3.5 3.5 0 0 0 0 7h2a3.5 3.5 0 0 1 0 7h-1.5a4 2 0 0 1 -4 -1.5" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleHighlight().run()}
        isActive={editor?.isActive("highlight")}
        title="Highlight"
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
          className="icon icon-tabler icons-tabler-outline icon-tabler-highlight"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M3 19h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
          <path d="M12.5 5.5l4 4" />
          <path d="M4.5 13.5l4 4" />
          <path d="M21 15v4h-8l4 -4z" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleSubscript().run()}
        isActive={editor?.isActive("subscript")}
        title="Subscript"
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
          className="icon icon-tabler icons-tabler-outline icon-tabler-subscript"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M5 7l8 10m-8 0l8 -10" />
          <path d="M21 20h-4l3.5 -4a1.73 1.73 0 0 0 -3.5 -2" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleSuperscript().run()}
        isActive={editor?.isActive("superscript")}
        title="Superscript"
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
          className="icon icon-tabler icons-tabler-outline icon-tabler-superscript"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M5 7l8 10m-8 0l8 -10" />
          <path d="M21 11h-4l3.5 -4a1.73 1.73 0 0 0 -3.5 -2" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().unsetAllMarks().run()}
        title="Clear Formatting"
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
          <path d="M17 17L7 7" />
          <path d="M7 17l10-10" />
        </svg>
      </ToolbarButton>

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

export default TextFormattingControls;
