// Example demonstrating the MathLive import fix for Next.js
"use client";

import React, { useState, useEffect } from "react";
import { Editor, Viewer } from "react-latex-editor";
import "react-latex-editor/styles";

const NextJSExample = () => {
  const [content, setContent] = useState(
    "<p>Try adding some math: E = mc²</p>",
  );
  const [isClient, setIsClient] = useState(false);

  // Ensure component only renders on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading editor...</div>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>React LaTeX Editor in Next.js</h1>
      <p>✅ MathLive import issues are fixed!</p>

      <div
        style={{
          marginBottom: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <Editor
          initialContent={content}
          onChange={setContent}
          placeholder="Start typing... Use Ctrl+M to add math equations!"
          autoFocus={true}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Preview:</h3>
        <div
          style={{
            border: "1px solid #eee",
            padding: "16px",
            borderRadius: "8px",
          }}
        >
          <Viewer content={content} />
        </div>
      </div>
    </div>
  );
};

export default NextJSExample;
