/// <reference types="vite/client" />

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "math-field": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        ref?: React.Ref<MathfieldElement>;
        readonly?: boolean;
        class?: string;
        value?: string;
      };
    }
  }
}
