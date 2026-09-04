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

function parseLength(value: string | null): number | null {
  if (!value) return null;
  // Reject percentages — they are not usable for viewBox derivation
  if (/%\s*$/.test(value.trim())) return null;
  const match = value.trim().match(/^([\d.]+)(px|pt)?$/i);
  if (!match) return null;
  const n = Number(match[1]);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/**
 * Make a root SVG fluid: ensure viewBox + preserveAspectRatio, strip fixed
 * root width/height so CSS can size it. Nested child <svg> layers are untouched.
 */
export function normalizeSvgForResponsive(svgMarkup: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgMarkup, "image/svg+xml");
  const svg = doc.documentElement;

  if (svg.tagName.toLowerCase() !== "svg") {
    throw new Error("Not valid SVG markup");
  }

  if (!svg.getAttribute("xmlns")) {
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  }

  const hasViewBox =
    svg.hasAttribute("viewBox") || svg.hasAttribute("viewbox");
  if (!hasViewBox) {
    let w = parseLength(svg.getAttribute("width"));
    let h = parseLength(svg.getAttribute("height"));

    // Nested diagram layers often hold the real canvas size
    if (!w || !h) {
      const nested = svg.querySelector(":scope > svg");
      if (nested) {
        const vb =
          nested.getAttribute("viewBox") || nested.getAttribute("viewbox");
        if (vb) {
          const p = vb.trim().split(/[\s,]+/).map(Number);
          if (p.length === 4 && p[2] > 0 && p[3] > 0) {
            w = w || p[2];
            h = h || p[3];
          }
        }
        if (!w || !h) {
          w = w || parseLength(nested.getAttribute("width"));
          h = h || parseLength(nested.getAttribute("height"));
        }
      }
    }

    if (w && h) {
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    }
  }

  if (!svg.getAttribute("preserveAspectRatio")) {
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  }

  // CSS owns presentation size; keep geometry via viewBox only.
  svg.removeAttribute("width");
  svg.removeAttribute("height");

  return new XMLSerializer().serializeToString(svg);
}

/** Parse SVG markup into a ProseMirror DOMOutputSpec (responsive-normalized). */
export function svgMarkupToDOMOutputSpec(svgMarkup: string): DOMOutputSpec {
  const normalized = normalizeSvgForResponsive(svgMarkup);
  const parser = new DOMParser();
  const doc = parser.parseFromString(normalized, "image/svg+xml");
  const svg = doc.documentElement;

  if (svg.tagName.toLowerCase() !== "svg") {
    throw new Error("Not valid SVG markup");
  }

  return elementToDOMOutputSpec(svg);
}

export function extractSvgMarkupFromElement(element: Element): string | null {
  let markup: string | null = null;
  if (element.tagName.toLowerCase() === "svg") {
    markup = element.outerHTML;
  } else {
    markup = element.querySelector("svg")?.outerHTML ?? null;
  }
  if (!markup) return null;
  try {
    return normalizeSvgForResponsive(markup);
  } catch {
    return markup;
  }
}

/**
 * Decode legacy data:image/svg+xml sources back to markup when possible.
 * Returns responsive-normalized markup when decoding succeeds.
 */
export function dataUrlToSvgMarkup(src: string): string | null {
  if (!src.startsWith("data:image/svg+xml")) return null;

  const comma = src.indexOf(",");
  if (comma === -1) return null;

  const meta = src.slice(0, comma);
  const payload = src.slice(comma + 1);

  try {
    const raw = meta.includes(";base64")
      ? atob(payload)
      : decodeURIComponent(payload);
    try {
      return normalizeSvgForResponsive(raw);
    } catch {
      return raw;
    }
  } catch {
    return null;
  }
}
