import "./ResizableYoutubeView.css";
import React, { useCallback, useRef } from "react";
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

const MIN_WIDTH = 200;
const MIN_HEIGHT = 150;

const ResizableYoutubeView: React.FC<ResizableYoutubeViewProps> = ({
  node,
  updateAttributes,
  selected,
}) => {
  const resizeRef = useRef<{
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    direction: string;
  } | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, direction: string) => {
      e.preventDefault();
      e.stopPropagation();

      resizeRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startWidth: parseInt(String(node.attrs.width), 10) || 640,
        startHeight: parseInt(String(node.attrs.height), 10) || 360,
        direction,
      };

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const state = resizeRef.current;
        if (!state) return;

        const deltaX = moveEvent.clientX - state.startX;
        const deltaY = moveEvent.clientY - state.startY;

        let newWidth = state.startWidth;
        let newHeight = state.startHeight;

        if (state.direction.includes("right")) {
          newWidth = Math.max(MIN_WIDTH, state.startWidth + deltaX);
        }
        if (state.direction.includes("left")) {
          newWidth = Math.max(MIN_WIDTH, state.startWidth - deltaX);
        }
        if (state.direction.includes("bottom")) {
          newHeight = Math.max(MIN_HEIGHT, state.startHeight + deltaY);
        }
        if (state.direction.includes("top")) {
          newHeight = Math.max(MIN_HEIGHT, state.startHeight - deltaY);
        }

        updateAttributes({
          width: `${Math.round(newWidth)}px`,
          height: `${Math.round(newHeight)}px`,
        });
      };

      const handleMouseUp = () => {
        resizeRef.current = null;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [node.attrs.width, node.attrs.height, updateAttributes],
  );

  const handleAlignChange = (align: string) => {
    updateAttributes({ align });
  };

  const align = node.attrs.align || "center";

  return (
    <NodeViewWrapper
      className={`resizable-youtube-wrapper ${
        selected ? "ProseMirror-selectednode" : ""
      }`}
      style={{
        textAlign: align as "left" | "center" | "right",
        position: "relative",
        display: "block",
        width: "100%",
      }}
      data-align={align}
    >
      <div
        className="resizable-youtube-container"
        style={{
          position: "relative",
          display: "inline-block",
          width: node.attrs.width,
          height: node.attrs.height,
          maxWidth: "100%",
        }}
      >
        <iframe
          src={node.attrs.src}
          width={node.attrs.width}
          height={node.attrs.height}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            border: 0,
          }}
        />

        {selected && (
          <>
            <div
              className="resize-handle resize-handle-bottom-right"
              onMouseDown={(e) => handleMouseDown(e, "bottom-right")}
              aria-hidden="true"
            />
            <div
              className="resize-handle resize-handle-bottom-left"
              onMouseDown={(e) => handleMouseDown(e, "bottom-left")}
              aria-hidden="true"
            />
            <div
              className="resize-handle resize-handle-top-right"
              onMouseDown={(e) => handleMouseDown(e, "top-right")}
              aria-hidden="true"
            />
            <div
              className="resize-handle resize-handle-top-left"
              onMouseDown={(e) => handleMouseDown(e, "top-left")}
              aria-hidden="true"
            />

            <div className="alignment-controls" role="group" aria-label="Video alignment">
              <button
                onClick={() => handleAlignChange("left")}
                className={align === "left" ? "is-active" : ""}
                type="button"
                aria-label="Align left"
                aria-pressed={align === "left"}
              >
                ←
              </button>
              <button
                onClick={() => handleAlignChange("center")}
                className={align === "center" ? "is-active" : ""}
                type="button"
                aria-label="Align center"
                aria-pressed={align === "center"}
              >
                ⟷
              </button>
              <button
                onClick={() => handleAlignChange("right")}
                className={align === "right" ? "is-active" : ""}
                type="button"
                aria-label="Align right"
                aria-pressed={align === "right"}
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
