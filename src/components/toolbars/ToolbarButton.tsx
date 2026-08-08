import { memo, forwardRef, ReactNode, MouseEventHandler } from "react";

interface ToolbarButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isActive?: boolean;
  title: string;
  children: ReactNode;
  shortcut?: string;
  disabled?: boolean;
}

const ToolbarButton = memo(
  forwardRef<HTMLButtonElement, ToolbarButtonProps>(
    ({ onClick, isActive, title, children, shortcut, disabled }, ref) => {
      const label = shortcut ? `${title} (${shortcut})` : title;

      return (
        <button
          ref={ref}
          onClick={onClick}
          className={`toolbar-button${isActive ? " is-active" : ""}${
            disabled ? " is-disabled" : ""
          }`}
          aria-label={label}
          aria-pressed={isActive}
          disabled={disabled}
          type="button"
          title={label}
        >
          {children}
        </button>
      );
    },
  ),
);

ToolbarButton.displayName = "ToolbarButton";

export default ToolbarButton;
