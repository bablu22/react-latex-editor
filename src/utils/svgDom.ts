import type { DOMOutputSpec } from "@tiptap/pm/model";

type SvgRect = { x: number; y: number; w: number; h: number };

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

function parseViewBox(el: Element): SvgRect | null {
  const raw = el.getAttribute("viewBox") || el.getAttribute("viewbox");
  if (!raw) return null;
  const p = raw.trim().split(/[\s,]+/).map(Number);
  if (p.length === 4 && p.every(Number.isFinite) && p[2] > 0 && p[3] > 0) {
    return { x: p[0], y: p[1], w: p[2], h: p[3] };
  }
  return null;
}

function unionRect(a: SvgRect, b: SvgRect): SvgRect {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  const right = Math.max(a.x + a.w, b.x + b.w);
  const bottom = Math.max(a.y + a.h, b.y + b.h);
  return { x, y, w: right - x, h: bottom - y };
}

/** Geometry of a nested <svg> in the parent's user space. */
function nestedSvgExtent(el: Element): SvgRect | null {
  const x = parseLength(el.getAttribute("x")) ?? 0;
  const y = parseLength(el.getAttribute("y")) ?? 0;
  const vb = parseViewBox(el);
  const w = parseLength(el.getAttribute("width")) ?? vb?.w ?? null;
  const h = parseLength(el.getAttribute("height")) ?? vb?.h ?? null;
  if (w && h) return { x, y, w, h };
  if (vb) return { x: x + vb.x, y: y + vb.y, w: vb.w, h: vb.h };
  return null;
}

/**
 * Covering rectangle for a root SVG: own viewBox/size unioned with every
 * direct child <svg> layer. Nested diagrams (plot + labels) often have a
 * tiny/missing root viewBox while inner layers are hundreds of px wide.
 */
export function coveringSvgRect(svg: Element): SvgRect | null {
  const ownVb = parseViewBox(svg);
  const ownW = parseLength(svg.getAttribute("width"));
  const ownH = parseLength(svg.getAttribute("height"));

  let acc: SvgRect | null = null;
  if (ownVb) acc = ownVb;
  else if (ownW && ownH) acc = { x: 0, y: 0, w: ownW, h: ownH };

  svg.querySelectorAll("svg").forEach((child) => {
    const extent = nestedSvgExtent(child);
    if (extent) acc = acc ? unionRect(acc, extent) : extent;
  });

  return acc && acc.w > 0 && acc.h > 0 ? acc : null;
}

function liveBBox(el: SVGGraphicsElement): SvgRect | null {
  try {
    const box = el.getBBox();
    if (box.width > 0 && box.height > 0) {
      return { x: box.x, y: box.y, w: box.width, h: box.height };
    }
  } catch {
    // getBBox throws if the SVG is not rendered
  }
  return null;
}

function applyCoveringViewBox(svg: Element, live?: SVGSVGElement): SvgRect | null {
  let extent = coveringSvgRect(svg);

  if (live) {
    const rootBox = liveBBox(live);
    if (rootBox) extent = extent ? unionRect(extent, rootBox) : rootBox;
    live.querySelectorAll("svg").forEach((node) => {
      const nested = node as SVGSVGElement;
      const box = liveBBox(nested);
      if (!box) return;
      const x = parseLength(nested.getAttribute("x")) ?? 0;
      const y = parseLength(nested.getAttribute("y")) ?? 0;
      const mapped = { x: box.x + x, y: box.y + y, w: box.w, h: box.h };
      extent = extent ? unionRect(extent, mapped) : mapped;
    });
  }

  if (extent) {
    svg.setAttribute(
      "viewBox",
      `${extent.x} ${extent.y} ${extent.w} ${extent.h}`,
    );
  }

  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

  svg.removeAttribute("width");
  svg.removeAttribute("height");
  return extent;
}

/**
 * Make a root SVG fluid: covering viewBox + preserveAspectRatio, strip fixed
 * root width/height so CSS can size it. Nested child <svg> layers stay in
 * user units — they must NOT be stretched to 100%.
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

  applyCoveringViewBox(svg);

  return new XMLSerializer().serializeToString(svg);
}

function isNestedSvg(el: Element): boolean {
  const parent = el.parentElement;
  if (!parent) return false;
  return parent.tagName.toLowerCase() === "svg";
}

function isMathSvg(el: Element): boolean {
  return Boolean(el.closest(".katex, .math, math, .mjx-container, .MathJax"));
}

function isUiIconSvg(el: Element): boolean {
  if (el.closest("button, a, header, nav, [data-slot='button']")) return true;
  const cls =
    el.getAttribute("class") ||
    (el instanceof SVGElement ? el.className.baseVal : "") ||
    "";
  return /\blucide\b/.test(cls);
}

function isFigureSvg(el: Element): boolean {
  if (isUiIconSvg(el) || isMathSvg(el) || isNestedSvg(el)) return false;
  return Boolean(
    el.closest(
      ".viewer-content, .resizable-image-container, .inline-svg-host, .is-svg",
    ),
  );
}

function resetOverlayedInnerSvgs(root: SVGSVGElement) {
  Array.from(root.children)
    .filter((child) => child.tagName.toLowerCase() === "svg")
    .forEach((node) => {
      const inner = node as SVGSVGElement;
      inner.style.removeProperty("position");
      inner.style.removeProperty("left");
      inner.style.removeProperty("top");
      inner.style.removeProperty("right");
      inner.style.removeProperty("bottom");
      inner.style.removeProperty("width");
      inner.style.removeProperty("height");
      inner.style.removeProperty("max-width");
      inner.style.removeProperty("max-height");
      inner.style.removeProperty("margin");
      inner.style.removeProperty("display");
      inner.style.setProperty("overflow", "visible");
      if (inner.getAttribute("width") === "100%") inner.removeAttribute("width");
      if (inner.getAttribute("height") === "100%") inner.removeAttribute("height");
    });
}

function markFluidHost(host: HTMLElement) {
  host.classList.add("rle-svg-host");
  host.classList.remove("rle-svg-host--aspect");
  host.style.removeProperty("--svg-aspect-ratio");
  host.style.removeProperty("aspect-ratio");
  host.style.setProperty("width", "100%");
  host.style.setProperty("max-width", "100%");
  host.style.setProperty("min-width", "0");
  host.style.setProperty("display", "block");
  host.style.setProperty("position", "relative");
  host.style.setProperty("box-sizing", "border-box");
  host.style.setProperty("overflow", "visible");
  host.style.setProperty("height", "auto");
}

function ensureFigureHost(svg: SVGSVGElement): HTMLElement | null {
  const parent = svg.parentElement;
  if (!(parent instanceof HTMLElement)) return null;

  if (
    parent.classList.contains("rle-svg-host") ||
    parent.classList.contains("inline-svg-host") ||
    parent.classList.contains("resizable-image-container")
  ) {
    return parent;
  }

  const host = document.createElement("div");
  host.className = "rle-svg-host";
  parent.insertBefore(host, svg);
  host.appendChild(svg);
  return host;
}

/**
 * Prepare already-serialized figure SVGs in a live DOM (Viewer / quiz).
 * Existing saved HTML often has no covering viewBox and leftover overlay styles.
 */
export function prepareFigureSvgs(root: ParentNode): void {
  const svgs = root.querySelectorAll("svg");
  svgs.forEach((node) => {
    const svg = node as SVGSVGElement;
    if (!isFigureSvg(svg)) return;

    resetOverlayedInnerSvgs(svg);

    applyCoveringViewBox(svg, svg);
    svg.classList.add("rle-svg-root");
    svg.style.removeProperty("position");
    svg.style.removeProperty("inset");
    svg.style.removeProperty("left");
    svg.style.removeProperty("top");
    svg.style.setProperty("width", "100%");
    svg.style.setProperty("height", "auto");
    svg.style.setProperty("max-width", "100%");
    svg.style.setProperty("display", "block");
    svg.style.setProperty("overflow", "visible");

    const host = ensureFigureHost(svg);
    if (host) {
      markFluidHost(host);
      const wrapper = host.closest(".resizable-image-wrapper");
      if (wrapper instanceof HTMLElement) {
        wrapper.style.setProperty("width", "100%");
        wrapper.style.setProperty("max-width", "100%");
        wrapper.style.setProperty("display", "block");
      }
    }
  });
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
