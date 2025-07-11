import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
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
      typesetPromise?: (elements: Element[]) => Promise<void>;
    };
  }
}

interface ViewerProps {
  content: string;
  className?: string;
  enableMath?: boolean;
  mathJaxConfig?: {
    inlineMath?: string[][];
    displayMath?: string[][];
    packages?: string[];
  };
}

export const Viewer = ({
  content,
  className = "",
  enableMath = true,
  mathJaxConfig = {},
}: ViewerProps) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [mathJaxLoaded, setMathJaxLoaded] = useState(false);
  const [mathJaxError, setMathJaxError] = useState<string | null>(null);
  const [contentKey, setContentKey] = useState(0);
  const lastContentRef = useRef<string>("");
  const isProcessingRef = useRef(false);

  // Initialize MathJax
  useEffect(() => {
    if (!enableMath) {
      setMathJaxLoaded(true);
      return;
    }

    if (!window.MathJax) {
      window.MathJax = {
        tex: {
          inlineMath: mathJaxConfig.inlineMath || [
            ["$", "$"],
            ["\\(", "\\)"],
          ],
          displayMath: mathJaxConfig.displayMath || [
            ["$$", "$$"],
            ["\\[", "\\]"],
          ],
          processEscapes: true,
          processEnvironments: true,
          packages: mathJaxConfig.packages || [
            "base",
            "ams",
            "noerrors",
            "noundefined",
          ],
        },
        options: {
          skipHtmlTags: ["script", "noscript", "style", "textarea", "pre"],
          ignoreHtmlClass: "tex2jax_ignore",
          processHtmlClass: "tex2jax_process",
        },
        startup: {
          defaultPageReady: () => Promise.resolve(),
          pageReady: () => {
            return (
              window.MathJax?.startup.defaultPageReady().then(() => {
                setMathJaxLoaded(true);
              }) || Promise.resolve()
            );
          },
        },
      };

      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js";
      script.async = true;
      script.onload = () => {
        const checkMathJax = setInterval(() => {
          if (
            window.MathJax &&
            typeof window.MathJax.typesetPromise === "function"
          ) {
            clearInterval(checkMathJax);
            setMathJaxLoaded(true);
          }
        }, 100);

        setTimeout(() => {
          clearInterval(checkMathJax);
          if (!window.MathJax?.typesetPromise) {
            setMathJaxError("MathJax failed to load");
          }
        }, 5000);
      };

      script.onerror = () => {
        setMathJaxError("Failed to load MathJax script");
      };

      document.head.appendChild(script);
    } else {
      setMathJaxLoaded(true);
    }
  }, [enableMath, mathJaxConfig]);

  // Update content key when content changes
  useEffect(() => {
    if (content !== lastContentRef.current) {
      lastContentRef.current = content;
      setContentKey((prev) => prev + 1);
    }
  }, [content]);

  // Process content synchronously after DOM updates
  useLayoutEffect(() => {
    if (!enableMath || !mathJaxLoaded || !viewerRef.current || !content) {
      return;
    }

    if (isProcessingRef.current) {
      return;
    }

    const processContent = async () => {
      isProcessingRef.current = true;

      try {
        const viewerContentElement =
          viewerRef.current?.querySelector(".viewer-content");
        if (!viewerContentElement) {
          return;
        }

        // Set the HTML content
        viewerContentElement.innerHTML = content;

        // Process math elements
        const mathElements =
          viewerContentElement.querySelectorAll("[data-latex]");

        mathElements.forEach((element: Element) => {
          const latex = element.getAttribute("data-latex");
          const dataType = element.getAttribute("data-type");

          if (!latex) return;

          let newTextContent = "";

          if (dataType === "math") {
            newTextContent = `$${latex}$`;
          } else {
            newTextContent = `$$${latex}$$`;
          }

          element.textContent = newTextContent;
        });

        // Typeset with MathJax
        if (
          window.MathJax &&
          typeof window.MathJax.typesetPromise === "function"
        ) {
          await window.MathJax.typesetPromise([viewerContentElement]);
        }
      } catch (err) {
        console.error("MathJax processing error:", err);
        setMathJaxError(`Failed to render mathematical equations: ${err}`);
      } finally {
        isProcessingRef.current = false;
      }
    };

    processContent();
  }, [contentKey, mathJaxLoaded, enableMath]);

  const handleMathError = useCallback(() => {
    setMathJaxError(null);
  }, []);

  return (
    <div className={`editor-viewer ${className}`} ref={viewerRef}>
      {/* Use key to force re-render when content changes */}
      <div key={contentKey} className="viewer-content prose" />

      {mathJaxError && (
        <div className="error-message" role="alert">
          <p>{mathJaxError}</p>
          <button
            onClick={handleMathError}
            className="error-close"
            aria-label="Close error message"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default Viewer;
