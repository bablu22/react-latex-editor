import { useCallback, useState, type FormEvent } from "react";
import ToolbarButton from "./ToolbarButton";
import { insertSvg, insertTable } from "../../utils/editorUtils";
import { isLikelySvgMarkup } from "../../utils/media";
import type { Editor } from "@tiptap/react";

interface SpecialFeaturesControlsProps {
  editor: Editor | null;
  readOnly?: boolean;
  onMathDialogOpen: () => void;
  onImagePicker: () => void;
}

function isYouTubeUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return (
      hostname === "youtu.be" ||
      hostname === "youtube.com" ||
      hostname === "www.youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "www.youtube-nocookie.com"
    );
  } catch {
    return false;
  }
}

const SpecialFeaturesControls = ({
  editor,
  readOnly,
  onMathDialogOpen,
  onImagePicker,
}: SpecialFeaturesControlsProps) => {
  const [showSvgDialog, setShowSvgDialog] = useState(false);
  const [svgMarkup, setSvgMarkup] = useState("");
  const [svgError, setSvgError] = useState<string | null>(null);

  const closeSvgDialog = useCallback(() => {
    setShowSvgDialog(false);
    setSvgMarkup("");
    setSvgError(null);
  }, []);

  const handleSvgSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      if (!editor) return;

      const markup = svgMarkup.trim();
      if (!markup || !isLikelySvgMarkup(markup)) {
        setSvgError("Paste valid SVG markup (must include an <svg> element)");
        return;
      }

      try {
        await insertSvg(editor, markup);
        closeSvgDialog();
      } catch (err) {
        setSvgError(err instanceof Error ? err.message : "Failed to insert SVG");
      }
    },
    [editor, svgMarkup, closeSvgDialog],
  );

  return (
    <>
      <div className="toolbar-group" role="group" aria-label="Insert">
        <ToolbarButton
          onClick={onMathDialogOpen}
          title="Insert equation"
          shortcut="Ctrl+M"
          disabled={!editor || readOnly}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 5H9l-4 14H3" />
            <path d="M13 13l6 6" />
            <path d="M13 19l6-6" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          onClick={onImagePicker}
          title="Insert image"
          disabled={!editor || readOnly}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => setShowSvgDialog(true)}
          title="Paste SVG code"
          disabled={!editor || readOnly}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 18l6-6-6-6" />
            <path d="M8 6l-6 6 6 6" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => insertTable(editor)}
          title="Insert table"
          disabled={!editor || readOnly}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="1" />
            <path d="M3 9h18" />
            <path d="M3 15h18" />
            <path d="M9 3v18" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            if (!editor) return;
            const url = window.prompt("Enter YouTube video URL:");
            if (!url) return;
            if (!isYouTubeUrl(url.trim())) {
              window.alert("Please enter a valid YouTube URL");
              return;
            }
            editor.chain().focus().setYoutubeVideo({ src: url.trim() }).run();
          }}
          title="Insert YouTube video"
          disabled={!editor || readOnly}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="3" />
            <path d="M10 9l5 3-5 3V9z" fill="currentColor" stroke="none" />
          </svg>
        </ToolbarButton>
      </div>

      {showSvgDialog && (
        <div
          className="image-dialog-overlay"
          onClick={closeSvgDialog}
          role="presentation"
        >
          <div
            className="image-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="svg-paste-dialog-title"
          >
            <h3 id="svg-paste-dialog-title">Paste SVG code</h3>
            {svgError && (
              <p className="image-dialog-error" role="alert">
                {svgError}
              </p>
            )}
            <form onSubmit={handleSvgSubmit}>
              <label htmlFor="toolbar-svg-markup-input" className="sr-only">
                SVG markup
              </label>
              <textarea
                id="toolbar-svg-markup-input"
                className="image-dialog-svg-input"
                placeholder={'<svg xmlns="http://www.w3.org/2000/svg" ...>...</svg>'}
                value={svgMarkup}
                onChange={(e) => {
                  setSvgMarkup(e.target.value);
                  setSvgError(null);
                }}
                rows={10}
                autoFocus
              />
              <div className="image-dialog-buttons">
                <button type="submit" disabled={!svgMarkup.trim()}>
                  Insert SVG
                </button>
                <button type="button" onClick={closeSvgDialog}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SpecialFeaturesControls;
