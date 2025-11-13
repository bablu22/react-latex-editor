import React, { useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { Editor, EditorRef } from "./components/Editor";
import Viewer from "./components/Viewer";
import ImagePickerDialog from "./components/ImagePickerDialog";

const DevApp: React.FC = () => {
  const editorRef = useRef<EditorRef>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(
    "<p>Start typing your question here...</p>",
  );

  // Handle image selection request
  const handleImageSelectionRequest = () => {
    setShowImageDialog(true);
  };

  // Handle image selection from dialog
  const handleImageSelect = (urls: string[]) => {
    if (editorRef.current) {
      editorRef.current.addImage(urls);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>React Rich Text Editor - Image Usage Guide</h1>

      <div>
        <div>
          <h2>Editor</h2>
          <Editor
            ref={editorRef}
            initialContent={content}
            onChange={(content) => {
              console.log("Content changed:", content);
              setContent(content);
            }}
            placeholder="Type here... Click the image button in the toolbar!"
            readOnly={false}
            autoFocus={true}
            className="my-editor"
            onImageSelectionRequest={handleImageSelectionRequest}
          />
        </div>

        <div className="!max-w-md mt-8 overflow-auto border p-4">
          <h2>Preview</h2>
          <Viewer content={content} />
          <button type="button" onClick={() => setOpen(!open)}>
            Open
          </button>
        </div>
      </div>

      {open && (
        <div>
          <h2>Preview</h2>
          <Viewer content={content} />
        </div>
      )}
      <ImagePickerDialog
        isOpen={showImageDialog}
        onClose={() => setShowImageDialog(false)}
        onImageSelect={handleImageSelect}
      />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DevApp />
  </React.StrictMode>,
);
