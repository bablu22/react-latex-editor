import React, { useRef, useCallback } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import "./ResizableImageView.css";

const ResizableImageView = ({ node, updateAttributes }) => {
  const containerRef = useRef(null);
  const { width, align } = node.attrs;

  const handleResize = useCallback(
    (e) => {
      e.preventDefault();
      const startX = e.pageX;
      const startWidth = containerRef.current.clientWidth;

      const handleDrag = (event) => {
        const newWidth = startWidth + (event.pageX - startX);
        updateAttributes({ width: `${Math.max(50, newWidth)}px` }); // min width 50px
      };

      const stopDrag = () => {
        document.removeEventListener("mousemove", handleDrag);
        document.removeEventListener("mouseup", stopDrag);
      };

      document.addEventListener("mousemove", handleDrag);
      document.addEventListener("mouseup", stopDrag);
    },
    [updateAttributes],
  );

  return (
    <NodeViewWrapper
      className={`resizable-image-container align-${align}`}
      style={{ width }}
      ref={containerRef}
    >
      <img
        src={node.attrs.src}
        alt={node.attrs.alt}
        title={node.attrs.title}
        className="editor-image"
        draggable="true"
      />
      <div className="resize-handle-left" onMouseDown={handleResize}></div>
      <div className="resize-handle-right" onMouseDown={handleResize}></div>
    </NodeViewWrapper>
  );
};

export default ResizableImageView;
