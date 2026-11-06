declare module "katex/contrib/auto-render" {
  import type { KatexOptions } from "katex";

  export interface AutoRenderDelimiter {
    left: string;
    right: string;
    display: boolean;
  }

  export interface AutoRenderOptions extends KatexOptions {
    delimiters?: AutoRenderDelimiter[];
    ignoredTags?: string[];
    ignoredClasses?: string[];
    errorCallback?: (msg: string, err: Error) => void;
    preProcess?: (math: string) => string;
  }

  export default function renderMathInElement(
    element: HTMLElement,
    options?: AutoRenderOptions,
  ): void;
}
