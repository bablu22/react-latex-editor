/**
 * Utility helpers for the React LaTeX Editor
 */

/**
 * Validate LaTeX syntax (brace balance + basic sanity checks)
 */
export function validateLatex(latex: string): {
  isValid: boolean;
  error?: string;
} {
  if (!latex || latex.trim() === "") {
    return { isValid: false, error: "LaTeX expression cannot be empty" };
  }

  let braceCount = 0;
  let bracketCount = 0;

  for (let i = 0; i < latex.length; i++) {
    const char = latex[i];
    const prev = latex[i - 1];

    // Skip escaped braces/brackets
    if (prev === "\\") continue;

    if (char === "{") braceCount++;
    if (char === "}") braceCount--;
    if (char === "[") bracketCount++;
    if (char === "]") bracketCount--;

    if (braceCount < 0) {
      return { isValid: false, error: "Unbalanced braces" };
    }
    if (bracketCount < 0) {
      return { isValid: false, error: "Unbalanced brackets" };
    }
  }

  if (braceCount !== 0) {
    return { isValid: false, error: "Unbalanced braces" };
  }
  if (bracketCount !== 0) {
    return { isValid: false, error: "Unbalanced brackets" };
  }

  return { isValid: true };
}

/**
 * Escape HTML special characters (safe for inserting untrusted text into HTML)
 */
export function sanitizeHtml(html: string): string {
  if (typeof document === "undefined") {
    return html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  const div = document.createElement("div");
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Extract plain text from HTML
 */
export function extractTextFromHtml(html: string): string {
  if (typeof document === "undefined") {
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }

  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

/**
 * Count words in text
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 Bytes";
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(k)),
    sizes.length - 1,
  );

  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: never[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: never[]) => void>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastArgs: Parameters<T> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          const pending = lastArgs;
          lastArgs = null;
          func(...pending);
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  };
}

/**
 * Check if browser supports features needed by the editor
 */
export function checkBrowserSupport(): {
  supported: boolean;
  missingFeatures: string[];
} {
  const missingFeatures: string[] = [];

  if (typeof window === "undefined") {
    return { supported: false, missingFeatures: ["window object"] };
  }

  if (!window.customElements) {
    missingFeatures.push("Custom Elements");
  }

  try {
    const test = "__rle_test__";
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
  } catch {
    missingFeatures.push("Local Storage");
  }

  return {
    supported: missingFeatures.length === 0,
    missingFeatures,
  };
}

/**
 * Deep clone a JSON-serializable value
 */
export function deepClone<T>(obj: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(obj);
  }
  return JSON.parse(JSON.stringify(obj)) as T;
}

/**
 * Check if HTML content is empty (ignoring empty paragraphs / whitespace)
 */
export function isContentEmpty(html: string): boolean {
  if (!html || !html.trim()) return true;
  const text = extractTextFromHtml(html);
  return text.trim().length === 0;
}

/**
 * Generate unique ID
 */
export function generateId(prefix = "rle"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Normalize a user-entered URL (adds https:// when missing a scheme)
 */
export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}
