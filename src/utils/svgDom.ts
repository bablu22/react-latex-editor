import type { DOMOutputSpec } from "@tiptap/pm/model";

/**
 * Convert a DOM element tree into a ProseMirror DOMOutputSpec (for getHTML()).
 */
export function elementToDOMOutputSpec(element: Element): DOMOutputSpec {
  const attrs: Record<string, string> = {};
  for (const attr of Array.from(element.attributes)) {
    attrs[attr.name] = attr.value;
  }

  const children: DOMOutputSpec[] = [];
  element.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent;
      if (text) children.push(text);
      return;
    }
    if (child.nodeType === Node.ELEMENT_NODE) {
      children.push(elementToDOMOutputSpec(child as Element));
    }
  });

  if (children.length === 0) {
    return [element.tagName, attrs];
  }

  return [element.tagName, attrs, ...children];
}

/** Preserve intrinsic SVG width/height/viewBox from the source markup. */
export function svgMarkupToDOMOutputSpec(svgMarkup: string): DOMOutputSpec {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgMarkup, "image/svg+xml");
  const svg = doc.documentElement;

  if (svg.tagName.toLowerCase() !== "svg") {
    throw new Error("Not valid SVG markup");
  }

  if (!svg.getAttribute("xmlns")) {
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  }

  return elementToDOMOutputSpec(svg);
}

export function extractSvgMarkupFromElement(element: Element): string | null {
  if (element.tagName.toLowerCase() === "svg") {
    return element.outerHTML;
  }

  const nested = element.querySelector("svg");
  return nested?.outerHTML ?? null;
}

/**
 * Decode legacy data:image/svg+xml sources back to markup when possible.
 */
export function dataUrlToSvgMarkup(src: string): string | null {
  if (!src.startsWith("data:image/svg+xml")) return null;

  const comma = src.indexOf(",");
  if (comma === -1) return null;

  const meta = src.slice(0, comma);
  const payload = src.slice(comma + 1);

  try {
    if (meta.includes(";base64")) {
      return atob(payload);
    }
    return decodeURIComponent(payload);
  } catch {
    return null;
  }
}
