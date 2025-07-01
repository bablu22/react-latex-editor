import React, { useRef, useState } from "react";
import { Editor, EditorRef, Viewer } from "react-latex-editor";
import "react-latex-editor/styles";

function BasicUsageExample() {
  const editorRef = useRef<EditorRef>(null);
  const [content, setContent] = useState(
    "<p>Start typing your content here...</p>",
  );
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    console.log("Content changed:", newContent);
  };

  const handleImageRequest = () => {
    const imageUrl = prompt("Enter image URL:");
    if (imageUrl && editorRef.current) {
      editorRef.current.addImage([imageUrl]);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={isDarkMode ? "dark-theme" : ""}>
      <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <h1>React Rich Text with Math - Basic Usage</h1>

        <div style={{ marginBottom: "1rem" }}>
          <button
            onClick={toggleDarkMode}
            style={{
              padding: "0.5rem 1rem",
              background: isDarkMode ? "#374151" : "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
            }}
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
          }}
        >
          <div>
            <h2>Editor</h2>
            <Editor
              ref={editorRef}
              initialContent={content}
              onChange={handleContentChange}
              placeholder="Start typing your content here..."
              autoFocus={true}
              onImageSelectionRequest={handleImageRequest}
              minHeight="400px"
            />
          </div>

          <div>
            <h2>Preview</h2>
            <div
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
                padding: "1rem",
                minHeight: "400px",
                background: isDarkMode ? "#2d2d2d" : "white",
              }}
            >
              <Viewer content={content} />
            </div>
          </div>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <h3>HTML Output:</h3>
          <pre
            style={{
              background: "#f1f5f9",
              padding: "1rem",
              borderRadius: "0.25rem",
              overflow: "auto",
              fontSize: "12px",
            }}
          >
            {content}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default BasicUsageExample;
