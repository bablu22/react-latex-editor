import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";

import "../styles/viewer.css";

declare global {
  interface Window {
    MathJax?: {
      tex: {
        inlineMath: string[][];
        displayMath: string[][];
        processEscapes: boolean;
        processEnvironments: boolean;
        packages: string[];
      };
      options: {
        skipHtmlTags: string[];
        ignoreHtmlClass: string;
        processHtmlClass: string;
      };
      startup: {
        pageReady?: () => Promise<void>;
        defaultPageReady: () => Promise<void>;
      };
      typesetClear?: (elements?: Element[]) => void;
      typesetPromise?: (elements: Element[]) => Promise<void>;
    };
  }
}

interface ViewerProps {
  content: string;
  className?: string;
  contentClassName?: string;
  enableMath?: boolean;
  mathJaxConfig?: {
    inlineMath?: string[][];
    displayMath?: string[][];
    packages?: string[];
  };
}

const MATHJAX_CDN = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js";
const MATHJAX_SCRIPT_ID = "react-latex-editor-mathjax";

function ensureMathJax(
  config: ViewerProps["mathJaxConfig"],
): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.MathJax?.typesetPromise) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    if (!window.MathJax) {
      window.MathJax = {
        tex: {
          inlineMath: config?.inlineMath || [
            ["$", "$"],
            ["\\(", "\\)"],
          ],
          displayMath: config?.displayMath || [
            ["$$", "$$"],
            ["\\[", "\\]"],
          ],
          processEscapes: true,
          processEnvironments: true,
          packages: config?.packages || ["base", "ams", "noerrors", "noundefined"],
        },
        options: {
          skipHtmlTags: ["script", "noscript", "style", "textarea", "pre", "code"],
          ignoreHtmlClass: "tex2jax_ignore",
          processHtmlClass: "tex2jax_process",
        },
        startup: {
          defaultPageReady: () => Promise.resolve(),
        },
      };
    }

    const existing = document.getElementById(MATHJAX_SCRIPT_ID);
    if (existing) {
      const check = setInterval(() => {
        if (window.MathJax?.typesetPromise) {
          clearInterval(check);
          resolve();
        }
      }, 50);
      setTimeout(() => {
        clearInterval(check);
        if (!window.MathJax?.typesetPromise) {
          reject(new Error("MathJax failed to load"));
        }
      }, 8000);
      return;
    }

    const script = document.createElement("script");
    script.id = MATHJAX_SCRIPT_ID;
    script.src = MATHJAX_CDN;
    script.async = true;
    script.onload = () => {
      const check = setInterval(() => {
        if (window.MathJax?.typesetPromise) {
          clearInterval(check);
          resolve();
        }
      }, 50);
      setTimeout(() => {
        clearInterval(check);
        if (!window.MathJax?.typesetPromise) {
          reject(new Error("MathJax failed to initialize"));
        }
      }, 8000);
    };
    script.onerror = () => reject(new Error("Failed to load MathJax script"));
    document.head.appendChild(script);
  });
}

export const Viewer = ({
  content,
  className = "",
  contentClassName = "",
  enableMath = true,
  mathJaxConfig,
}: ViewerProps) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [mathJaxReady, setMathJaxReady] = useState(!enableMath);
  const [mathJaxError, setMathJaxError] = useState<string | null>(null);
  const isProcessingRef = useRef(false);
  const requestIdRef = useRef(0);

  const configKey = useMemo(
    () => JSON.stringify(mathJaxConfig ?? {}),
    [mathJaxConfig],
  );

  useEffect(() => {
    if (!enableMath) {
      setMathJaxReady(true);
      return;
    }

    let cancelled = false;
    ensureMathJax(mathJaxConfig)
      .then(() => {
        if (!cancelled) {
          setMathJaxReady(true);
          setMathJaxError(null);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setMathJaxError(err.message);
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- configKey captures mathJaxConfig
  }, [enableMath, configKey]);

  useLayoutEffect(() => {
    const contentEl = viewerRef.current?.querySelector(".viewer-content");
    if (!contentEl) return;

    const requestId = ++requestIdRef.current;

    if (!enableMath || !mathJaxReady) {
      contentEl.innerHTML = content || "";
      return;
    }

    if (isProcessingRef.current) {
      contentEl.innerHTML = content || "";
    }

    const processContent = async () => {
      isProcessingRef.current = true;

      try {
        if (window.MathJax?.typesetClear) {
          window.MathJax.typesetClear([contentEl]);
        }

        contentEl.innerHTML = content || "";

        const mathElements = contentEl.querySelectorAll("[data-latex]");
        mathElements.forEach((element: Element) => {
          const latex = element.getAttribute("data-latex");
          if (!latex) return;

          const displayMode =
            element.getAttribute("data-display-mode") === "true" ||
            element.hasAttribute("data-display-mode") ||
            element.classList.contains("math-node-wrapper-block");

          if (displayMode) {
            const block = document.createElement("div");
            block.className = "viewer-math-block";
            block.textContent = `\\[${latex}\\]`;
            element.replaceWith(block);
          } else {
            const inline = document.createElement("span");
            inline.className = "viewer-math-inline";
            inline.textContent = `\\(${latex}\\)`;
            element.replaceWith(inline);
          }
        });

        if (
          window.MathJax &&
          typeof window.MathJax.typesetPromise === "function" &&
          requestId === requestIdRef.current
        ) {
          await window.MathJax.typesetPromise([contentEl]);
        }
      } catch (err) {
        console.error("MathJax processing error:", err);
        if (requestId === requestIdRef.current) {
          setMathJaxError(`Failed to render mathematical equations: ${err}`);
        }
      } finally {
        isProcessingRef.current = false;
      }
    };

    void processContent();
  }, [content, mathJaxReady, enableMath]);

  const handleMathError = useCallback(() => {
    setMathJaxError(null);
  }, []);

  return (
    <div className={`editor-viewer ${className}`.trim()} ref={viewerRef}>
      <div
        className={`viewer-content prose ${contentClassName}`.trim()}
      />

      {mathJaxError && (
        <div className="error-message" role="alert">
          <p>{mathJaxError}</p>
          <button
            onClick={handleMathError}
            className="error-close"
            aria-label="Close error message"
            type="button"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default Viewer;
