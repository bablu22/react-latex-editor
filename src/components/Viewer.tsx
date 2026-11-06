import { useLayoutEffect, useRef, createElement } from "react";
import katex from "katex";
import renderMathInElement from "katex/contrib/auto-render";

import "../styles/viewer.css";
import { prepareFigureSvgs } from "../utils/svgDom";

interface ViewerProps {
  content: string;
  className?: string;
  contentClassName?: string;
  enableMath?: boolean;
  /**
   * Render the wrapper and content as inline `<span>`s instead of `<div>`s,
   * so a short question body or answer choice can sit inside a flex row or a
   * shrink-to-fit block.
   */
  inline?: boolean;
  /**
   * Typeset a math node in display style when it is the only content of its
   * paragraph (e.g. the expressions in a quantitative-comparison column).
   */
  displayStandaloneMath?: boolean;
  /**
   * @deprecated Math is now rendered with KaTeX. Only the delimiters are read:
   * `inlineMath` / `displayMath` pairs are passed to KaTeX auto-render.
   */
  mathJaxConfig?: {
    inlineMath?: string[][];
    displayMath?: string[][];
    packages?: string[];
  };
}

const KATEX_VERSION = "0.16.47";
const KATEX_CSS_URL = `https://cdn.jsdelivr.net/npm/katex@${KATEX_VERSION}/dist/katex.min.css`;
const KATEX_CSS_ID = "react-latex-editor-katex-css";

/**
 * KaTeX needs its stylesheet and fonts. Load them once from the CDN unless the
 * page already ships KaTeX CSS (for example `import "katex/dist/katex.min.css"`).
 */
function ensureKatexCss(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById(KATEX_CSS_ID)) return;
  const link = document.createElement("link");
  link.id = KATEX_CSS_ID;
  link.rel = "stylesheet";
  link.href = KATEX_CSS_URL;
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
}

const KATEX_OPTIONS = {
  throwOnError: false,
  strict: "ignore" as const,
  trust: false,
  output: "htmlAndMathml" as const,
};

/**
 * `$…$` is deliberately not an inline delimiter: question text often contains
 * prices such as "$5 and $10" that must stay plain text. Editor math nodes
 * (`data-latex`) and `\(…\)` / `\[…\]` / `$$…$$` are typeset.
 */
const DEFAULT_DELIMITERS = [
  { left: "$$", right: "$$", display: true },
  { left: "\\[", right: "\\]", display: true },
  { left: "\\(", right: "\\)", display: false },
];

function delimitersFrom(config: ViewerProps["mathJaxConfig"]) {
  if (!config?.inlineMath && !config?.displayMath) return DEFAULT_DELIMITERS;
  return [
    ...(config.displayMath || []).map(([left, right]) => ({ left, right, display: true })),
    ...(config.inlineMath || []).map(([left, right]) => ({ left, right, display: false })),
  ];
}

/** Typeset editor math nodes (`<span data-type="math" data-latex="…">`) in place. */
function isAloneInBlock(element: Element): boolean {
  const block = element.closest("p, div, li, td, th");
  if (!block) return false;
  const others = (block.textContent || "")
    .replace(element.textContent || "", "")
    .replace(/\s+/g, "");
  return others === "" && block.querySelectorAll("[data-latex]").length === 1;
}

function renderMathNodes(contentEl: Element, displayStandalone: boolean): void {
  contentEl.querySelectorAll("[data-latex]").forEach((element) => {
    const latex = element.getAttribute("data-latex");
    if (!latex) return;

    const displayMode =
      element.getAttribute("data-display-mode") === "true" ||
      (element.hasAttribute("data-display-mode") &&
        element.getAttribute("data-display-mode") !== "false") ||
      element.classList.contains("math-node-wrapper-block") ||
      (displayStandalone && isAloneInBlock(element));

    const node = document.createElement("span");
    node.className = displayMode ? "viewer-math-block" : "viewer-math-inline";
    try {
      katex.render(latex, node, { ...KATEX_OPTIONS, displayMode });
    } catch {
      node.textContent = latex;
    }
    element.replaceWith(node);
  });
}

function renderMath(
  contentEl: HTMLElement,
  config: ViewerProps["mathJaxConfig"],
  displayStandalone: boolean,
): void {
  renderMathNodes(contentEl, displayStandalone);
  renderMathInElement(contentEl, {
    ...KATEX_OPTIONS,
    delimiters: delimitersFrom(config),
    ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "option"],
    ignoredClasses: ["tex2jax_ignore", "katex"],
  });
}

export const Viewer = ({
  content,
  className = "",
  contentClassName = "",
  enableMath = true,
  inline = false,
  displayStandaloneMath = false,
  mathJaxConfig,
}: ViewerProps) => {
  const contentRef = useRef<HTMLElement>(null);
  const configKey = JSON.stringify(mathJaxConfig ?? null);

  useLayoutEffect(() => {
    const contentEl = contentRef.current;
    if (!contentEl) return;

    // KaTeX renders synchronously, so the new HTML and its math appear in the
    // same frame: no flash of raw TeX and no race between viewers.
    contentEl.innerHTML = content || "";
    if (enableMath) {
      ensureKatexCss();
      try {
        renderMath(contentEl, mathJaxConfig, displayStandaloneMath);
      } catch (err) {
        console.error("Math rendering error:", err);
      }
    }
    prepareFigureSvgs(contentEl);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- configKey captures mathJaxConfig
  }, [content, enableMath, configKey, displayStandaloneMath]);

  const tag = inline ? "span" : "div";
  return createElement(
    tag,
    { className: `editor-viewer ${inline ? "editor-viewer-inline " : ""}${className}`.trim() },
    createElement(tag, {
      ref: contentRef,
      className: `viewer-content prose ${contentClassName}`.trim(),
    }),
  );
};

export default Viewer;
