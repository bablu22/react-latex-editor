import { useEffect, useRef, useState, useCallback } from "react";

import "../styles/viewer.css";

// Extend Window interface to include MathJax
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
  /**
   * Whether to enable MathJax rendering
   */
  enableMath?: boolean;
  /**
   * Custom MathJax configuration
   */
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
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize MathJax
  useEffect(() => {
    if (!enableMath) {
      setMathJaxLoaded(true);
      return;
    }

    // Only configure MathJax if it hasn't been configured yet
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
        // Wait for MathJax to be fully initialized
        const checkMathJax = setInterval(() => {
          if (
            window.MathJax &&
            typeof window.MathJax.typesetPromise === "function"
          ) {
            clearInterval(checkMathJax);
            setMathJaxLoaded(true);
          }
        }, 100);

        // Clear interval after 5 seconds if MathJax doesn't load
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
      // If MathJax is already loaded, just set the loaded state
      setMathJaxLoaded(true);
    }

    return () => {
      // Don't remove the script if MathJax is already loaded
      if (!window.MathJax) {
        const script = document.querySelector('script[src*="mathjax"]');
        if (script && script.parentNode) {
          document.head.removeChild(script);
        }
      }
    };
  }, [enableMath, mathJaxConfig]);

  // Function to process math elements and render with MathJax
  const processMathElements = useCallback(async () => {
    if (
      !enableMath ||
      !mathJaxLoaded ||
      !viewerRef.current ||
      !content ||
      isProcessing
    )
      return;

    setIsProcessing(true);

    try {
      const viewerContentElement =
        viewerRef.current.querySelector(".viewer-content");
      if (!viewerContentElement) return;

      // Find all elements with data-latex attribute within the viewer-content
      const mathElements =
        viewerContentElement.querySelectorAll("[data-latex]");

      // Process each math element
      mathElements.forEach((element: Element) => {
        const latex = element.getAttribute("data-latex");
        const dataType = element.getAttribute("data-type");

        if (!latex) return;

        let newTextContent = "";

        // Determine the correct delimiters based on data-type
        if (dataType === "math") {
          newTextContent = `$${latex}$`; // Use $ $ for inline math
        } else {
          newTextContent = `$$${latex}$$`; // Use $$ $$ for display math
        }

        // Update the text content of the existing span element
        element.textContent = newTextContent;
      });

      // Use requestAnimationFrame to ensure DOM updates are complete
      await new Promise((resolve) => requestAnimationFrame(resolve));

      // Typeset the math
      if (
        window.MathJax &&
        typeof window.MathJax.typesetPromise === "function"
      ) {
        await window.MathJax.typesetPromise([viewerContentElement]);
      }
    } catch (err) {
      console.error("MathJax typesetting failed:", err);
      setMathJaxError("Failed to render mathematical equations");
    } finally {
      setIsProcessing(false);
    }
  }, [content, mathJaxLoaded, enableMath, isProcessing]);

  // Effect to render math when content or MathJax readiness changes
  useEffect(() => {
    // Use a longer delay to ensure DOM is fully updated
    const timeoutId = setTimeout(() => {
      processMathElements();
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [processMathElements]);

  const handleMathError = useCallback(() => {
    setMathJaxError(null);
  }, []);

  return (
    <div className={`editor-viewer ${className}`} ref={viewerRef}>
      <div
        className="viewer-content prose"
        dangerouslySetInnerHTML={{ __html: content }}
      />

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
