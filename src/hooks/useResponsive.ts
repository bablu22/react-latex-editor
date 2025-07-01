import { useState, useEffect } from "react";
import { MOBILE_BREAKPOINT } from "../constants/editorConstants";

export function useResponsive() {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= MOBILE_BREAKPOINT,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}
