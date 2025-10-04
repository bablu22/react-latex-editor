/**
 * Advanced utility functions for editor management
 */

/**
 * Validate LaTeX syntax
 */
export function validateLatex(latex: string): {
  isValid: boolean;
  error?: string;
} {
  if (!latex || latex.trim() === "") {
    return { isValid: false, error: "LaTeX expression cannot be empty" };
  }

  // Check for balanced braces
  let braceCount = 0;
  for (const char of latex) {
    if (char === "{") braceCount++;
    if (char === "}") braceCount--;
    if (braceCount < 0) {
      return { isValid: false, error: "Unbalanced braces" };
    }
  }

  if (braceCount !== 0) {
    return { isValid: false, error: "Unbalanced braces" };
  }

  return { isValid: true };
}

/**
 * Sanitize HTML content
 */
export function sanitizeHtml(html: string): string {
  // Basic sanitization - in production, use a library like DOMPurify
  const div = document.createElement("div");
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Extract plain text from HTML
 */
export function extractTextFromHtml(html: string): string {
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
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
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

  if (!window.localStorage) {
    missingFeatures.push("Local Storage");
  }

  return {
    supported: missingFeatures.length === 0,
    missingFeatures,
  };
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if content is empty
 */
export function isContentEmpty(html: string): boolean {
  const text = extractTextFromHtml(html);
  return text.trim().length === 0;
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
