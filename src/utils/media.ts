import { SUPPORTED_IMAGE_FORMATS, MAX_FILE_SIZE } from "../constants/config";

const IMAGE_EXTENSIONS = /\.(jpe?g|png|gif|webp|svg)$/i;

export function isSupportedImageFile(file: File): boolean {
  if (
    SUPPORTED_IMAGE_FORMATS.includes(
      file.type as (typeof SUPPORTED_IMAGE_FORMATS)[number],
    )
  ) {
    return true;
  }
  // Some OS/browsers leave file.type empty for SVG
  return IMAGE_EXTENSIONS.test(file.name);
}

export function isSvgFile(file: File): boolean {
  return (
    file.type === "image/svg+xml" ||
    file.type === "image/svg" ||
    /\.svg$/i.test(file.name)
  );
}

export function isSvgSource(src: string): boolean {
  if (!src) return false;
  return (
    src.startsWith("data:image/svg+xml") ||
    src.includes("image/svg+xml") ||
    /\.svg(\?|#|$)/i.test(src)
  );
}

export function isLikelySvgMarkup(text: string): boolean {
  const trimmed = text.trim();
  return (
    /^<\?xml[\s\S]*<svg[\s>]/i.test(trimmed) ||
    /^<svg[\s>]/i.test(trimmed)
  );
}

/**
 * Sanitize pasted SVG markup (strip scripts, event handlers, etc.).
 */
export function sanitizeSvgMarkup(raw: string): string {
  let svg = raw.trim();
  if (!isLikelySvgMarkup(svg)) {
    throw new Error("Not valid SVG markup");
  }

  svg = svg.replace(/<\?xml[\s\S]*?\?>/gi, "").trim();
  svg = svg.replace(/<!DOCTYPE[\s\S]*?>/gi, "").trim();
  svg = svg.replace(/<script[\s\S]*?<\/script>/gi, "");
  svg = svg.replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, "");
  svg = svg.replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  svg = svg.replace(
    /(href|xlink:href)\s*=\s*("|')\s*javascript:[^"']*\2/gi,
    '$1=$2#$2',
  );

  if (!/\sxmlns\s*=/.test(svg)) {
    svg = svg.replace(
      /<svg\b/i,
      '<svg xmlns="http://www.w3.org/2000/svg"',
    );
  }

  return svg;
}

/**
 * Encode SVG as a data URL (legacy / URL-based SVG only).
 */
export function svgMarkupToDataUrl(raw: string): string {
  const svg = sanitizeSvgMarkup(raw);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function readSvgFileAsMarkup(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(sanitizeSvgMarkup(String(reader.result)));
      } catch (err) {
        reject(err instanceof Error ? err : new Error("Invalid SVG file"));
      }
    };
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsText(file);
  });
}

/**
 * File picker accept string — MIME types + extensions for broader OS support
 */
export const IMAGE_ACCEPT =
  "image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml,.svg,.jpg,.jpeg,.png,.gif,.webp";

/** SVG-only accept string for the dedicated Upload SVG toolbar button */
export const SVG_ACCEPT = "image/svg+xml,.svg";

export { dataUrlToSvgMarkup } from "./svgDom";

export function assertImageFileSize(file: File): void {
  if (file.size > MAX_FILE_SIZE.image) {
    throw new Error(
      `"${file.name}" is too large (max ${Math.round(MAX_FILE_SIZE.image / (1024 * 1024))}MB)`,
    );
  }
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsDataURL(file);
  });
}

export async function filesToImageSources(files: FileList | File[]): Promise<
  Array<{ src: string; alt: string; isSvg: boolean; svgContent?: string }>
> {
  const list = Array.from(files);
  const results: Array<{
    src: string;
    alt: string;
    isSvg: boolean;
    svgContent?: string;
  }> = [];

  for (const file of list) {
    if (!isSupportedImageFile(file)) {
      throw new Error(`Unsupported format: ${file.name}`);
    }
    assertImageFileSize(file);

    if (isSvgFile(file)) {
      const svgContent = await readSvgFileAsMarkup(file);
      results.push({
        src: "",
        alt: file.name.replace(/\.[^.]+$/, ""),
        isSvg: true,
        svgContent,
      });
      continue;
    }

    const src = await fileToDataUrl(file);
    results.push({
      src,
      alt: file.name.replace(/\.[^.]+$/, ""),
      isSvg: false,
    });
  }

  return results;
}
