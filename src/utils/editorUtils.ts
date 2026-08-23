import { validateLatex } from "./helpers";
import type { Editor } from "@tiptap/core";
import type { ImageInsertInput, ImageInsertItem } from "../types/editor";
import { filesToImageSources, isSvgSource, sanitizeSvgMarkup } from "./media";

function normalizeFontSize(size: number | string): string {
  if (typeof size === "number") return `${size}px`;
  if (/^\d+$/.test(size)) return `${size}px`;
  return size;
}

export function setFontSize(editor: Editor | null, size: number | string) {
  if (!editor) return;
  editor
    .chain()
    .focus()
    .setMark("customTextStyle", { fontSize: normalizeFontSize(size) })
    .run();
}

export function setBackgroundColor(editor: Editor | null, color: string) {
  if (!editor) return;
  editor.chain().focus().setBackgroundColor(color).run();
}

export function setFontFamily(editor: Editor | null, family: string) {
  if (!editor) return;

  if (!family) {
    editor.chain().focus().unsetMark("customTextStyle").run();
    return;
  }

  editor.chain().focus().setMark("customTextStyle", { fontFamily: family }).run();
}

export function insertTable(
  editor: Editor | null,
  rows = 3,
  cols = 3,
  withHeaderRow = true,
) {
  if (!editor) return;
  editor.chain().focus().insertTable({ rows, cols, withHeaderRow }).run();
}

function normalizeImageItem(
  item: string | ImageInsertItem,
): ImageInsertItem & { mediaType: "image" | "svg" } {
  if (typeof item === "string") {
    const isSvg = isSvgSource(item);
    return {
      src: item,
      alt: "",
      width: isSvg ? "420px" : "500px",
      height: "auto",
      mediaType: isSvg ? "svg" : "image",
    };
  }

  const isSvg = item.mediaType === "svg" || isSvgSource(item.src) || Boolean(item.svgContent);
  return {
    src: item.src,
    alt: item.alt || "",
    width: item.width || (isSvg ? "420px" : "500px"),
    height: item.height || "auto",
    mediaType: item.mediaType || (isSvg ? "svg" : "image"),
    svgContent: item.svgContent,
    align: item.align,
  };
}

export function addImage(editor: Editor | null, urls: ImageInsertInput) {
  if (!editor) return;

  const list = (Array.isArray(urls) ? urls : [urls])
    .map(normalizeImageItem)
    .filter((item) => Boolean(item.src || item.svgContent));

  if (list.length === 0) return;

  if (list.length > 1) {
    const imageNodes = list.map((item) => ({
      type: "image",
      attrs: {
        src: item.src,
        alt: item.alt,
        width: "250px",
        height: item.height,
        mediaType: item.mediaType,
        svgContent: item.svgContent,
        align: item.align || "left",
      },
    }));
    editor
      .chain()
      .focus()
      .insertContent([{ type: "imageGroup", content: imageNodes }])
      .run();
    return;
  }

  editor
    .chain()
    .focus()
    .insertContent({
      type: "image",
      attrs: {
        ...list[0],
        align: list[0].align || "left",
      },
    })
    .run();
}

/**
 * Insert an SVG figure from markup, a data/http URL, or a File.
 * Intended for npm consumers using a custom file picker.
 */
export function insertSvg(
  editor: Editor | null,
  source: string | File,
  options?: { alt?: string; width?: string },
): Promise<void> {
  if (!editor) {
    return Promise.reject(new Error("Editor instance is not available"));
  }

  const insert = (attrs: ImageInsertItem) => {
    addImage(editor, {
      ...attrs,
      alt: attrs.alt || options?.alt || "SVG figure",
      width: attrs.width || options?.width || "420px",
      mediaType: "svg",
    });
  };

  if (typeof source !== "string") {
    return filesToImageSources([source]).then((items) => {
      const item = items[0];
      if (!item) throw new Error("No SVG file provided");
      insert({
        src: item.src,
        svgContent: item.svgContent,
        alt: item.alt,
      });
    });
  }

  const trimmed = source.trim();
  if (trimmed.startsWith("<") || trimmed.includes("<svg")) {
    insert({
      src: "",
      svgContent: sanitizeSvgMarkup(trimmed),
    });
    return Promise.resolve();
  }

  insert({ src: trimmed });
  return Promise.resolve();
}

/**
 * Convert FileList / File[] (from your own <input type="file">) and insert.
 * Handles SVG + raster images. Prefer this over blob URLs for persistence.
 */
export async function addImagesFromFiles(
  editor: Editor | null,
  files: FileList | File[],
): Promise<void> {
  if (!editor) {
    throw new Error("Editor instance is not available");
  }
  const items = await filesToImageSources(files);
  addImage(
    editor,
    items.map((item) => ({
      src: item.src,
      alt: item.alt,
      mediaType: item.isSvg ? ("svg" as const) : ("image" as const),
      svgContent: item.svgContent,
    })),
  );
}

export function insertMath(
  editor: Editor | null,
  latex: string,
  displayMode = false,
) {
  if (!editor) {
    throw new Error("Editor instance is not available");
  }

  const trimmedLatex = latex.trim();
  const validation = validateLatex(trimmedLatex);

  if (!validation.isValid) {
    throw new Error(validation.error || "Invalid LaTeX expression");
  }

  editor
    .chain()
    .focus()
    .insertContent({
      type: "math",
      attrs: { latex: trimmedLatex, displayMode },
    })
    .run();
}

export function validateAndInsertImage(editor: Editor | null, url: string) {
  return new Promise<void>((resolve, reject) => {
    if (!editor || !url) {
      reject(new Error("Editor or URL is missing"));
      return;
    }

    const img = new Image();
    img.onload = () => {
      try {
        addImage(editor, {
          src: url,
          mediaType: isSvgSource(url) ? "svg" : "image",
        });
        resolve();
      } catch (err) {
        reject(err instanceof Error ? err : new Error("Failed to insert image"));
      }
    };
    img.onerror = () => {
      reject(new Error("Invalid image URL or image not accessible"));
    };
    img.src = url;
  });
}
