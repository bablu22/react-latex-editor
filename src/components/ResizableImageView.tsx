import { Node } from "@tiptap/pm/model";
import { NodeViewWrapper, ReactNodeViewProps } from "@tiptap/react";
import React, { useCallback, useMemo, useState } from "react";
import "./ResizableImageView.css";

interface ImageNodeAttrs {
  src: string;
  alt?: string;
  title?: string;
  width?: string;
  height?: string;
  align?: string;
}

interface ResizableImageViewProps extends ReactNodeViewProps {
  node: Node & {
    attrs: ImageNodeAttrs;
  };
}

const ResizableImageView: React.FC<ResizableImageViewProps> = ({
  node,
  updateAttributes,
  selected,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [startHeight, setStartHeight] = useState(0);

  // Force re-render when align changes
  const align = useMemo(() => node.attrs.align || "left", [node.attrs.align]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, direction: string) => {
      e.preventDefault();
      setIsResizing(true);
      setStartX(e.clientX);
      setStartY(e.clientY);
      setStartWidth(parseInt(node.attrs.width || "300"));
      setStartHeight(parseInt(node.attrs.height || "200"));

      const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        let newWidth = startWidth;
        let newHeight = startHeight;

        if (direction.includes("right")) {
          newWidth = Math.max(100, startWidth + deltaX);
        }
        if (direction.includes("left")) {
          newWidth = Math.max(100, startWidth - deltaX);
        }
        if (direction.includes("bottom")) {
          newHeight = Math.max(100, startHeight + deltaY);
        }
        if (direction.includes("top")) {
          newHeight = Math.max(100, startHeight - deltaY);
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

  // Calculate alignment styles
  const wrapperStyle = useMemo(() => {
    const textAlignMap: Record<string, string> = {
      left: "left",
      center: "center",
      right: "right",
    };
    return {
      textAlign: (textAlignMap[align] || "left") as any,
      width: "100%",
      display: "block",
      margin: "0",
      padding: "0",
      boxSizing: "border-box" as any,
    };
  }, [align]);

  return (
    <NodeViewWrapper
      className={`resizable-image-wrapper resizable-image-wrapper-align-${align} ${
        selected ? "ProseMirror-selectednode" : ""
      }`}
      style={wrapperStyle}
      data-align={align}
    >
      <div
        className={`resizable-image-container align-${align}`}
        style={{
          width: node.attrs.width || "auto",
          height: node.attrs.height || "auto",
          display: "inline-block",
          position: "relative",
        }}
      >
        <img
          src={node.attrs.src}
          alt={node.attrs.alt || ""}
          title={node.attrs.title || ""}
          width={node.attrs.width}
          height={node.attrs.height}
          style={{
            display: "block",
            maxWidth: "100%",
            height: "auto",
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

export default ResizableImageView;
