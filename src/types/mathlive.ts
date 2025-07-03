// MathLive type definitions for compatibility with Next.js and React
// This handles the import changes in MathLive 0.105.x+

import "mathlive";

// Define the MathfieldElement interface
export interface MathfieldElement extends HTMLElement {
  value: string;
  menuItems: any[];
  virtualKeyboardMode?: string;
  mathMode?: string;
  smartMode?: boolean;
  smartFence?: boolean;
  smartSuperscript?: boolean;
  smartSubscript?: boolean;
  smartOperator?: boolean;
  smartFraction?: boolean;
  smartSqrt?: boolean;
  smartBracket?: boolean;
  smartParen?: boolean;
  smartQuote?: boolean;
  smartSpace?: boolean;
  smartCommand?: boolean;
  menuToggle?: string;
  menuToggleVisible?: boolean;
  fontsDirectory?: string | null;
  [key: string]: any;
}

// For Next.js compatibility - ensure MathLive is loaded only on client side
export const ensureMathLiveLoaded = (): Promise<void> => {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  return import("mathlive").then(() => {
    // MathfieldElement is automatically registered when importing 'mathlive'
    // No need to manually register it in newer versions
  });
};

export default MathfieldElement;
