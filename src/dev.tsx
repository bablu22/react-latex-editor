import React, { useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { Editor, EditorRef } from "./components/Editor";
import Viewer from "./components/Viewer";
import "./styles/editor.css";
import "./styles/dev.css";

const SAMPLE = `<p>Write exam questions with inline math like <span data-type="math" data-latex="E = mc^2">E = mc^2</span> right in the sentence.</p>
<p>Text before <span data-type="math" data-latex="\\int_{-\\infty}^{\\infty} e^{-x^2}\\,dx = \\sqrt{\\pi}" data-display-mode="true" class="math-node-wrapper math-node-wrapper-block">\\int_{-\\infty}^{\\infty} e^{-x^2}\\,dx = \\sqrt{\\pi}</span> and text after stays editable.</p>
<p>Use <strong>Ctrl/Cmd + M</strong> for the equation dialog, or type <code>$x^2$</code> for quick inline math.</p>`;

const DevApp: React.FC = () => {
  const editorRef = useRef<EditorRef>(null);
  const [content, setContent] = useState(SAMPLE);

  return (
    <div className="dev-app">
      <header className="dev-header">
        <div className="dev-brand">
          <span className="dev-mark" aria-hidden="true">
            ∑
          </span>
          <div>
            <h1>React LaTeX Editor</h1>
            <p>Professional rich text with MathLive equations, tables, images &amp; video</p>
          </div>
        </div>
        <div className="dev-actions">
          <button
            type="button"
            className="dev-btn"
            onClick={() => editorRef.current?.clearContent()}
          >
            Clear
          </button>
          <button
            type="button"
            className="dev-btn dev-btn-primary"
            onClick={() => {
              const html = editorRef.current?.getHTML() ?? "";
              void navigator.clipboard?.writeText(html);
            }}
          >
            Copy HTML
          </button>
        </div>
      </header>

      <main className="dev-layout">
        <section className="dev-panel">
          <div className="dev-panel-header">
            <h2>Editor</h2>
            <span className="dev-hint">Ctrl+M math · Ctrl+K link</span>
          </div>
          <Editor
            ref={editorRef}
            initialContent={content}
            onChange={setContent}
            placeholder="Start writing… insert math with Ctrl/Cmd+M"
            autoFocus
            minHeight="420px"
          />
        </section>

        <section className="dev-panel dev-preview">
          <div className="dev-panel-header">
            <h2>Live preview</h2>
            <span className="dev-hint">MathJax render</span>
          </div>
          <div className="dev-preview-body">
            <Viewer content={content} />
          </div>
        </section>
      </main>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DevApp />
  </React.StrictMode>,
);
