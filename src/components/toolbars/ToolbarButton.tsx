import {
  memo,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
  MouseEventHandler,
} from "react";

interface ToolbarButtonProps {
  /**
   * Click event handler
   */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /**
   * Whether the button is active
   */
  isActive?: boolean;
  /**
   * Button title (used as tooltip)
   */
  title: string;
  /**
   * Button content
   */
  children: ReactNode;
  /**
   * Keyboard shortcut for the button
   */
  shortcut?: string;
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
}

const ToolbarButton = memo(
  forwardRef<HTMLButtonElement, ToolbarButtonProps>(
    ({ onClick, isActive, title, children, shortcut, disabled }, ref) => {
      const tooltipRef = useRef<HTMLDivElement>(null);
      const buttonRef = useRef<HTMLButtonElement>(null);

      const updateTooltipPosition = useCallback(() => {
        if (!tooltipRef.current || !buttonRef.current) return;
        const button = buttonRef.current.getBoundingClientRect();
        const tooltip = tooltipRef.current;

        // Position tooltip above the button
        tooltip.style.left = `${button.left + button.width / 2}px`;
        tooltip.style.top = `${button.top - 8}px`; // 8px gap

        // Check if tooltip goes off screen to the left
        const tooltipRect = tooltip.getBoundingClientRect();
        if (tooltipRect.left < 0) {
          tooltip.style.left = "0px";
          tooltip.style.transform = "none";
        }

        // Check if tooltip goes off screen to the right
        if (tooltipRect.right > window.innerWidth) {
          tooltip.style.left = `${window.innerWidth}px`;
          tooltip.style.transform = "translateX(-100%)";
        }
      }, []);

      useEffect(() => {
        const handleScroll = () => {
          updateTooltipPosition();
        };

        const handleResize = () => {
          updateTooltipPosition();
        };

        window.addEventListener("scroll", handleScroll, true);
        window.addEventListener("resize", handleResize);

        return () => {
          window.removeEventListener("scroll", handleScroll, true);
          window.removeEventListener("resize", handleResize);
        };
      }, [updateTooltipPosition]);

      return (
        <div className="tooltip-container" onMouseEnter={updateTooltipPosition}>
          <button
            ref={(el) => {
              buttonRef.current = el;
              if (typeof ref === "function") ref(el);
              else if (ref) ref.current = el;
            }}
            onClick={onClick}
            className={`toolbar-button ${isActive ? "is-active" : ""} ${
              disabled ? "is-disabled" : ""
            }`}
            aria-label={title}
            aria-pressed={isActive}
            disabled={disabled}
            type="button"
          >
            {children}
          </button>
          <div ref={tooltipRef} className="tooltip">
            {title}
            {shortcut && <span className="tooltip-shortcut">{shortcut}</span>}
          </div>
        </div>
      );
    },
  ),
);

ToolbarButton.displayName = "ToolbarButton";

export default ToolbarButton;
