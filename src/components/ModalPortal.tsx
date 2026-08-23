import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalPortalProps {
  children: ReactNode;
}

/**
 * Render modals on document.body so host app layout (transform, overflow,
 * nested forms) cannot break fixed positioning or sizing.
 */
export default function ModalPortal({ children }: ModalPortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="react-latex-editor-portal" data-rle-portal="">
      {children}
    </div>,
    document.body,
  );
}
