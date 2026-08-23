import React, { useCallback, useEffect, useRef, useState } from "react";
import ModalPortal from "./ModalPortal";
import { MAX_FILE_SIZE } from "../constants/config";
import { formatFileSize } from "../utils/helpers";
import {
  IMAGE_ACCEPT,
  filesToImageSources,
  isLikelySvgMarkup,
  isSvgSource,
  sanitizeSvgMarkup,
} from "../utils/media";

interface ImagePickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (
    items: Array<{
      src: string;
      alt?: string;
      mediaType?: "image" | "svg";
      svgContent?: string;
    }>,
  ) => void;
  onUploadClick?: () => void;
}

type Tab = "upload" | "url" | "svg";

function isLikelyImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function loadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Could not load image from URL"));
    img.src = url;
  });
}

const ImagePickerDialog: React.FC<ImagePickerDialogProps> = ({
  isOpen,
  onClose,
  onImageSelect,
  onUploadClick,
}) => {
  const [tab, setTab] = useState<Tab>("upload");
  const [imageUrl, setImageUrl] = useState("");
  const [svgMarkup, setSvgMarkup] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files?.length) return;

      setIsLoading(true);
      setError(null);
      try {
        const items = await filesToImageSources(files);
        onImageSelect(
          items.map((item) => ({
            src: item.src,
            alt: item.alt,
            mediaType: item.isSvg ? "svg" : "image",
            svgContent: item.svgContent,
          })),
        );
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load file");
      } finally {
        setIsLoading(false);
        e.target.value = "";
      }
    },
    [onImageSelect, onClose],
  );

  const handleUrlInsert = useCallback(async () => {
    const url = imageUrl.trim();
    if (!url) return;

    if (!isLikelyImageUrl(url)) {
      setError("Please enter a valid http(s) image or SVG URL");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await loadImage(url);
      onImageSelect([
        {
          src: url,
          mediaType: isSvgSource(url) ? "svg" : "image",
        },
      ]);
      setImageUrl("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load image");
    } finally {
      setIsLoading(false);
    }
  }, [imageUrl, onImageSelect, onClose]);

  const handleSvgInsert = useCallback(() => {
    const markup = svgMarkup.trim();
    if (!markup) return;

    setError(null);
    try {
      if (!isLikelySvgMarkup(markup)) {
        throw new Error("Paste valid SVG markup starting with <svg>");
      }
      const svgContent = sanitizeSvgMarkup(markup);
      onImageSelect([{ src: "", alt: "SVG figure", mediaType: "svg", svgContent }]);
      setSvgMarkup("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid SVG");
    }
  }, [svgMarkup, onImageSelect, onClose]);

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div className="image-dialog-overlay" onClick={onClose} role="presentation">
        <div
          className="image-dialog"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="image-dialog-title"
        >
        <h3 id="image-dialog-title">Insert Image / SVG</h3>

        <div className="image-dialog-tabs" role="tablist">
          {(
            [
              ["upload", "Upload"],
              ["url", "URL"],
              ["svg", "Paste SVG"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              className={`image-dialog-tab${tab === id ? " is-active" : ""}`}
              onClick={() => {
                setTab(id);
                setError(null);
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <p className="image-dialog-error" role="alert">
            {error}
          </p>
        )}

        {tab === "upload" && (
          <div className="image-dialog-upload">
            <button
              type="button"
              className="image-dialog-upload-btn"
              disabled={isLoading}
              onClick={() => {
                if (onUploadClick) {
                  onClose();
                  onUploadClick();
                } else {
                  fileInputRef.current?.click();
                }
              }}
            >
              {isLoading ? "Loading..." : "Choose image or SVG file"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept={IMAGE_ACCEPT}
              multiple
              onChange={handleFileUpload}
              hidden
            />
            <p className="image-dialog-hint">
              JPG, PNG, GIF, WebP, <strong>SVG</strong> · max{" "}
              {formatFileSize(MAX_FILE_SIZE.image)}
            </p>
            <p className="image-dialog-hint">
              Ideal for math figures, graphs, and diagrams exported as SVG.
            </p>
          </div>
        )}

        {tab === "url" && (
          <div>
            <label htmlFor="image-url-input" className="sr-only">
              Image or SVG URL
            </label>
            <input
              id="image-url-input"
              type="url"
              placeholder="https://example.com/figure.svg"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  void handleUrlInsert();
                }
              }}
              disabled={isLoading}
              autoComplete="off"
            />
            <div className="image-dialog-buttons">
              <button
                type="button"
                disabled={!imageUrl.trim() || isLoading}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  void handleUrlInsert();
                }}
              >
                {isLoading ? "Loading..." : "Insert URL"}
              </button>
              <button type="button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {tab === "svg" && (
          <div>
            <label htmlFor="svg-markup-input" className="sr-only">
              SVG markup
            </label>
            <textarea
              id="svg-markup-input"
              className="image-dialog-svg-input"
              placeholder={'<svg xmlns="http://www.w3.org/2000/svg" ...>...</svg>'}
              value={svgMarkup}
              onChange={(e) => {
                setSvgMarkup(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSvgInsert();
                }
              }}
              rows={8}
            />
            <div className="image-dialog-buttons">
              <button
                type="button"
                disabled={!svgMarkup.trim()}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSvgInsert();
                }}
              >
                Insert SVG
              </button>
              <button type="button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </ModalPortal>
  );
};

export default ImagePickerDialog;
