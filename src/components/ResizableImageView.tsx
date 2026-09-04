import { Node } from "@tiptap/pm/model";
import { NodeViewWrapper } from "@tiptap/react";
import React, { useCallback, useMemo, useRef } from "react";
import { dataUrlToSvgMarkup } from "../utils/media";
import { normalizeSvgForResponsive } from "../utils/svgDom";
import "./ResizableImageView.css";

interface ImageNodeAttrs {
  src: string;
  alt?: string;
  title?: string;
  width?: string;
  height?: string;
  align?: string;
  mediaType?: "image" | "svg";
  svgContent?: string | null;
}

interface ResizableImageViewProps {
  node: Node & {
    attrs: ImageNodeAttrs;
  };
  updateAttributes: (attrs: Partial<ImageNodeAttrs>) => void;
  selected?: boolean;
}

const MIN_SIZE = 80;

const ResizableImageView: React.FC<ResizableImageViewProps> = ({
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
    aspectRatio: number;
  } | null>(null);

  const align = useMemo(() => node.attrs.align || "left", [node.attrs.align]);
  const isSvg = useMemo(() => {
    if (node.attrs.mediaType === "svg") return true;
    if (node.attrs.svgContent) return true;
    const src = node.attrs.src || "";
    return (
      src.startsWith("data:image/svg+xml") ||
      src.includes("image/svg+xml") ||
      /\.svg(\?|#|$)/i.test(src)
    );
  }, [node.attrs.mediaType, node.attrs.src, node.attrs.svgContent]);

  const inlineSvgMarkup = useMemo(() => {
    let markup: string | null = null;
    if (node.attrs.svgContent) markup = node.attrs.svgContent;
    else if (isSvg && node.attrs.src) {
      markup = dataUrlToSvgMarkup(node.attrs.src);
    }
    if (!markup) return null;
    try {
      return normalizeSvgForResponsive(markup);
    } catch {
      return markup;
    }
  }, [node.attrs.svgContent, node.attrs.src, isSvg]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, direction: string) => {
      e.preventDefault();
      e.stopPropagation();

      const startWidth = parseInt(String(node.attrs.width || "300"), 10) || 300;
      const startHeight =
        parseInt(String(node.attrs.height || "200"), 10) || 200;

      resizeRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startWidth,
        startHeight,
        direction,
        aspectRatio: startWidth / Math.max(startHeight, 1),
      };

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const state = resizeRef.current;
        if (!state) return;

        const deltaX = moveEvent.clientX - state.startX;
        const deltaY = moveEvent.clientY - state.startY;
        let newWidth = state.startWidth;
        let newHeight = state.startHeight;

        if (state.direction.includes("right")) {
          newWidth = Math.max(MIN_SIZE, state.startWidth + deltaX);
        }
        if (state.direction.includes("left")) {
          newWidth = Math.max(MIN_SIZE, state.startWidth - deltaX);
        }
        if (state.direction.includes("bottom")) {
          newHeight = Math.max(MIN_SIZE, state.startHeight + deltaY);
        }
        if (state.direction.includes("top")) {
          newHeight = Math.max(MIN_SIZE, state.startHeight - deltaY);
        }

        // Keep aspect ratio when using corner handles without Shift
        if (
          !moveEvent.shiftKey &&
          (state.direction === "bottom-right" ||
            state.direction === "bottom-left" ||
            state.direction === "top-right" ||
            state.direction === "top-left")
        ) {
          newHeight = Math.max(MIN_SIZE, Math.round(newWidth / state.aspectRatio));
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

  const handleAlignChange = (nextAlign: string) => {
    updateAttributes({ align: nextAlign });
  };

  const wrapperStyle = useMemo(
    () => ({
      textAlign: (align === "center" || align === "right" ? align : "left") as
        | "left"
        | "center"
        | "right",
      width: "100%",
      display: "block" as const,
      margin: "0",
      padding: "0",
      boxSizing: "border-box" as const,
    }),
    [align],
  );

  return (
    <NodeViewWrapper
      className={`resizable-image-wrapper resizable-image-wrapper-align-${align}${
        isSvg ? " is-svg" : ""
      } ${selected ? "ProseMirror-selectednode" : ""}`}
      style={wrapperStyle}
      data-align={align}
      data-media-type={isSvg ? "svg" : "image"}
    >
      <div
        className={`resizable-image-container align-${align}${isSvg ? " is-svg" : ""}`}
        style={{
          width: isSvg ? "100%" : node.attrs.width || "auto",
          maxWidth: "100%",
          height: isSvg ? "auto" : node.attrs.height || "auto",
          display: isSvg ? "block" : "inline-block",
          position: "relative",
        }}
      >
        {isSvg && <span className="svg-badge">SVG</span>}
        {inlineSvgMarkup ? (
          <div
            className="inline-svg-host"
            style={{
              display: "block",
              width: "100%",
              maxWidth: "100%",
              height: "auto",
              userSelect: "none",
            }}
            dangerouslySetInnerHTML={{ __html: inlineSvgMarkup }}
            aria-label={node.attrs.alt || "SVG figure"}
          />
        ) : (
          <img
            src={node.attrs.src}
            alt={node.attrs.alt || (isSvg ? "SVG figure" : "")}
            title={node.attrs.title || ""}
            width={isSvg ? undefined : node.attrs.width}
            height={isSvg ? undefined : node.attrs.height}
            draggable={false}
            style={{
              display: "block",
              maxWidth: "100%",
              width: isSvg ? "100%" : undefined,
              height: "auto",
              userSelect: "none",
            }}
          />
        )}

        {selected && !isSvg && (
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
          </>
        )}

        {selected && (
          <div className="alignment-controls" role="group" aria-label="Image alignment">
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
        )}
      </div>
    </NodeViewWrapper>
  );
};

export default ResizableImageView;
