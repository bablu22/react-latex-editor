import React, { Component } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import { MathfieldElement } from "../types/mathlive";
import { Node } from "@tiptap/pm/model";

interface MathNodeAttrs {
  latex: string;
  displayMode: boolean;
}

interface MathNodeViewProps {
  node: Node & {
    attrs: MathNodeAttrs;
  };
  updateAttributes: (attrs: Partial<MathNodeAttrs>) => void;
  selected?: boolean;
}

class MathNodeView extends Component<MathNodeViewProps> {
  private mathFieldRef: React.RefObject<MathfieldElement | null>;
  private cleanup?: () => void;
  private mounted = false;

  constructor(props: MathNodeViewProps) {
    super(props);
    this.mathFieldRef = React.createRef<MathfieldElement>();
  }

  async componentDidMount() {
    this.mounted = true;
    if (typeof window === "undefined") return;

    try {
      const mathlive = await import("mathlive");
      if (!customElements.get("math-field")) {
        customElements.define("math-field", mathlive.MathfieldElement);
      }
      if (mathlive.MathfieldElement) {
        mathlive.MathfieldElement.fontsDirectory = null;
      }
      if (this.mounted) {
        this.setupMathField();
      }
    } catch (error) {
      console.error("Failed to load MathLive:", error);
    }
  }

  componentDidUpdate(prevProps: MathNodeViewProps) {
    if (prevProps.node.attrs.latex !== this.props.node.attrs.latex) {
      this.updateMathField();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    this.cleanupMathField();
  }

  setupMathField() {
    const mathField = this.mathFieldRef.current;
    if (!mathField) return;

    const applyValue = () => {
      if (!mathField.isConnected) return;
      try {
        mathField.value = this.props.node.attrs.latex || "";
        mathField.readOnly = true;
      } catch (error) {
        console.error("Error setting up math field:", error);
      }
    };

    requestAnimationFrame(applyValue);

    this.cleanup = () => {
      try {
        if (mathField.isConnected) {
          mathField.menuItems = [];
        }
      } catch {
        // ignore cleanup errors on unmount
      }
    };
  }

  updateMathField() {
    const mathField = this.mathFieldRef.current;
    if (!mathField || !mathField.isConnected) return;

    try {
      if (mathField.value !== (this.props.node.attrs.latex || "")) {
        mathField.value = this.props.node.attrs.latex || "";
      }
    } catch (error) {
      console.error("Error updating math field:", error);
    }
  }

  cleanupMathField() {
    this.cleanup?.();
  }

  render() {
    const { node, selected } = this.props;
    const { displayMode, latex } = node.attrs;

    // Must stay a <span>: math is an inline atom. Using <div> splits the
    // paragraph and blocks typing text before/after the equation.
    return (
      <NodeViewWrapper
        as="span"
        className={`math-node-wrapper ${
          displayMode ? "math-node-wrapper-block" : "math-node-wrapper-inline"
        } ${selected ? "is-selected" : ""}`}
        data-latex={latex}
        data-display-mode={displayMode ? "true" : undefined}
        data-drag-handle=""
      >
        {React.createElement("math-field", {
          ref: this.mathFieldRef,
          className: "math-field-display",
          readOnly: true,
          contentEditable: false,
        })}
      </NodeViewWrapper>
    );
  }
}

export default MathNodeView;
