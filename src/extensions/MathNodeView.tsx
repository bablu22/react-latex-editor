import React, { Component } from "react";
import { NodeViewWrapper, ReactNodeViewProps } from "@tiptap/react";
import { MathfieldElement } from "../types/mathlive";
import { Node } from "@tiptap/pm/model";

// Define the math node attributes interface
interface MathNodeAttrs {
  latex: string;
  displayMode: boolean;
}

// Define the props interface for MathNodeView - extending ReactNodeViewProps
interface MathNodeViewProps extends ReactNodeViewProps {
  node: Node & {
    attrs: MathNodeAttrs;
  };
}

class MathNodeView extends Component<MathNodeViewProps> {
  private mathFieldRef: React.RefObject<MathfieldElement | null>;
  private cleanup?: () => void;

  constructor(props: MathNodeViewProps) {
    super(props);
    this.mathFieldRef = React.createRef<MathfieldElement>();
  }

  async componentDidMount() {
    // Dynamically import mathlive and register the custom element if needed
    if (typeof window !== "undefined") {
      const mathlive = await import("mathlive");
      if (!customElements.get("math-field")) {
        customElements.define("math-field", mathlive.MathfieldElement);
      }
      // Optionally configure fontsDirectory if needed
      if (mathlive.MathfieldElement) {
        mathlive.MathfieldElement.fontsDirectory = null;
      }
    }
    this.setupMathField();
  }

  componentDidUpdate(prevProps: MathNodeViewProps) {
    if (prevProps.node.attrs.latex !== this.props.node.attrs.latex) {
      this.updateMathField();
    }
  }

  componentWillUnmount() {
    this.cleanupMathField();
  }

  setupMathField() {
    const mathField = this.mathFieldRef.current;
    if (!mathField) return;

    const handleInput = () => {
      const newLatex = mathField.value;
      if (newLatex !== this.props.node.attrs.latex) {
        this.props.updateAttributes({ latex: newLatex });
      }
    };

    // Wait for the next tick to ensure the field is mounted
    setTimeout(() => {
      if (mathField && mathField.isConnected) {
        mathField.addEventListener("input", handleInput);
        mathField.value = this.props.node.attrs.latex || "";
      }
    }, 0);

    this.cleanup = () => {
      if (mathField && mathField.isConnected) {
        mathField.removeEventListener("input", handleInput);
        mathField.menuItems = [];
      }
    };
  }

  updateMathField() {
    if (this.mathFieldRef.current) {
      this.mathFieldRef.current.value = this.props.node.attrs.latex || "";
    }
  }

  cleanupMathField() {
    if (this.cleanup) {
      this.cleanup();
    }
  }

  render() {
    const { node } = this.props;
    const { displayMode } = node.attrs;

    return (
      <NodeViewWrapper
        className={
          displayMode ? "math-node-wrapper-block" : "math-node-wrapper-inline"
        }
      >
        {React.createElement("math-field", {
          ref: this.mathFieldRef,
          className: "test-math-background",
          readonly: true,
        })}
      </NodeViewWrapper>
    );
  }
}

export default MathNodeView;
