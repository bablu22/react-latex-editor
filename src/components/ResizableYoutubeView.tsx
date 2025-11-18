import "./ResizableYoutubeView.css";
import React, { useCallback, useState } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import { Node } from "@tiptap/pm/model";

interface YoutubeNodeAttrs {
  src: string;
  width: string;
  height: string;
  align: string;
}

interface ResizableYoutubeViewProps {
  node: Node & {
    attrs: YoutubeNodeAttrs;
  };
  updateAttributes: (attrs: Partial<YoutubeNodeAttrs>) => void;
  selected?: boolean;
}

const ResizableYoutubeView: React.FC<ResizableYoutubeViewProps> = ({
  node,
  updateAttributes,
  selected,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [startHeight, setStartHeight] = useState(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, direction: string) => {
      e.preventDefault();
      setIsResizing(true);
      setStartX(e.clientX);
      setStartY(e.clientY);
      setStartWidth(parseInt(node.attrs.width));
      setStartHeight(parseInt(node.attrs.height));

      const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        let newWidth = startWidth;
        let newHeight = startHeight;

        if (direction.includes("right")) {
          newWidth = Math.max(200, startWidth + deltaX);
        }
        if (direction.includes("left")) {
          newWidth = Math.max(200, startWidth - deltaX);
        }
        if (direction.includes("bottom")) {
          newHeight = Math.max(150, startHeight + deltaY);
        }
        if (direction.includes("top")) {
          newHeight = Math.max(150, startHeight - deltaY);
        }

        updateAttributes({
          width: `${newWidth}px`,
          height: `${newHeight}px`,
        });
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [
      isResizing,
      startX,
      startY,
      startWidth,
      startHeight,
      node.attrs.width,
      node.attrs.height,
      updateAttributes,
    ],
  );

  const handleAlignChange = (align: string) => {
    updateAttributes({ align });
  };

  return (
    <NodeViewWrapper
      className={`resizable-youtube-wrapper ${
        selected ? "ProseMirror-selectednode" : ""
      }`}
      style={{
        textAlign: node.attrs.align as any,
        position: "relative",
        display: "inline-block",
      }}
    >
      <div
        className="resizable-youtube-container"
        style={{
          position: "relative",
          display: "inline-block",
          width: node.attrs.width,
          height: node.attrs.height,
        }}
      >
        <iframe
          src={node.attrs.src}
          width={node.attrs.width}
          height={node.attrs.height}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            display: "block",
            width: "100%",
            height: "100%",
          }}
        />

        {selected && (
          <>
            {/* Resize handles */}
            <div
              className="resize-handle resize-handle-bottom-right"
              onMouseDown={(e) => handleMouseDown(e, "bottom-right")}
              style={{
                position: "absolute",
                bottom: "-5px",
                right: "-5px",
                width: "10px",
                height: "10px",
                backgroundColor: "#007acc",
                cursor: "nw-resize",
                borderRadius: "2px",
              }}
            />
            <div
              className="resize-handle resize-handle-bottom-left"
              onMouseDown={(e) => handleMouseDown(e, "bottom-left")}
              style={{
                position: "absolute",
                bottom: "-5px",
                left: "-5px",
                width: "10px",
                height: "10px",
                backgroundColor: "#007acc",
                cursor: "ne-resize",
                borderRadius: "2px",
              }}
            />
            <div
              className="resize-handle resize-handle-top-right"
              onMouseDown={(e) => handleMouseDown(e, "top-right")}
              style={{
                position: "absolute",
                top: "-5px",
                right: "-5px",
                width: "10px",
                height: "10px",
                backgroundColor: "#007acc",
                cursor: "ne-resize",
                borderRadius: "2px",
              }}
            />
            <div
              className="resize-handle resize-handle-top-left"
              onMouseDown={(e) => handleMouseDown(e, "top-left")}
              style={{
                position: "absolute",
                top: "-5px",
                left: "-5px",
                width: "10px",
                height: "10px",
                backgroundColor: "#007acc",
                cursor: "nw-resize",
                borderRadius: "2px",
              }}
            />

            {/* Alignment controls */}
            <div
              className="alignment-controls"
              style={{
                position: "absolute",
                top: "-30px",
                left: "0",
                display: "flex",
                gap: "5px",
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "2px",
              }}
            >
              <button
                onClick={() => handleAlignChange("left")}
                style={{
                  padding: "2px 6px",
                  border: "none",
                  backgroundColor:
                    node.attrs.align === "left" ? "#007acc" : "transparent",
                  color: node.attrs.align === "left" ? "white" : "black",
                  cursor: "pointer",
                  borderRadius: "2px",
                }}
                type="button"
              >
                ←
              </button>
              <button
                onClick={() => handleAlignChange("center")}
                style={{
                  padding: "2px 6px",
                  border: "none",
                  backgroundColor:
                    node.attrs.align === "center" ? "#007acc" : "transparent",
                  color: node.attrs.align === "center" ? "white" : "black",
                  cursor: "pointer",
                  borderRadius: "2px",
                }}
                type="button"
              >
                ⟷
              </button>
              <button
                onClick={() => handleAlignChange("right")}
                style={{
                  padding: "2px 6px",
                  border: "none",
                  backgroundColor:
                    node.attrs.align === "right" ? "#007acc" : "transparent",
                  color: node.attrs.align === "right" ? "white" : "black",
                  cursor: "pointer",
                  borderRadius: "2px",
                }}
                type="button"
              >
                →
              </button>
            </div>
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
};

export default ResizableYoutubeView;
