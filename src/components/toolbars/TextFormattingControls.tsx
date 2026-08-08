import ToolbarButton from "./ToolbarButton";
import { normalizeUrl } from "../../utils";
import type { Editor } from "@tiptap/react";

interface TextFormattingControlsProps {
  editor: Editor | null;
  readOnly?: boolean;
}

const TextFormattingControls = ({
  editor,
  readOnly,
}: TextFormattingControlsProps) => {
  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href || "";
    const url = window.prompt("Enter URL:", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: normalizeUrl(url) })
      .run();
  };

  return (
    <div className="toolbar-group" role="group" aria-label="Text formatting">
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleBold().run()}
        isActive={editor?.isActive("bold")}
        title="Bold"
        shortcut="Ctrl+B"
        disabled={!editor || readOnly}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 5h6a3.5 3.5 0 0 1 0 7H7z" />
          <path d="M7 12h7a3.5 3.5 0 0 1 0 7H7z" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        isActive={editor?.isActive("italic")}
        title="Italic"
        shortcut="Ctrl+I"
        disabled={!editor || readOnly}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
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
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 4v6a6 6 0 0 0 12 0V4" />
          <line x1="4" y1="20" x2="20" y2="20" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleStrike().run()}
        isActive={editor?.isActive("strike")}
        title="Strikethrough"
        disabled={!editor || readOnly}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="M16 6.5a4 2.5 0 0 0-4-1.5h-1a3.5 3.5 0 0 0 0 7h2a3.5 3.5 0 0 1 0 7h-1.5a4 2.5 0 0 1-4-1.5" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleHighlight().run()}
        isActive={editor?.isActive("highlight")}
        title="Highlight"
        disabled={!editor || readOnly}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l-6 6v3h9l3-3" />
          <path d="M14 7l3 3 4-4a2.12 2.12 0 0 0-3-3z" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleCode().run()}
        isActive={editor?.isActive("code")}
        title="Inline code"
        disabled={!editor || readOnly}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={setLink}
        isActive={editor?.isActive("link")}
        title="Insert link"
        shortcut="Ctrl+K"
        disabled={!editor || readOnly}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() =>
          editor?.chain().focus().extendMarkRange("link").unsetLink().run()
        }
        title="Remove link"
        disabled={!editor || readOnly || !editor?.isActive("link")}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          <line x1="4" y1="4" x2="20" y2="20" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}
        title="Clear formatting"
        disabled={!editor || readOnly}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 7h16" />
          <path d="M9 7v13" />
          <path d="M15 7v13" />
          <path d="M6 20h12" />
          <path d="M8 3l1 4" />
          <path d="M15 3l1 4" />
        </svg>
      </ToolbarButton>
    </div>
  );
};

export default TextFormattingControls;
