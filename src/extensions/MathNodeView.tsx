import React, { Component } from "react";
import { NodeViewWrapper, ReactNodeViewProps } from "@tiptap/react";
import { Node } from "@tiptap/pm/model";
import { MathfieldElement, ensureMathLiveLoaded } from "../types/mathlive";

// Ensure MathLive is loaded (especially important for Next.js)
ensureMathLiveLoaded();

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

// The MathfieldElement is automatically registered when importing 'mathlive'
// No need to manually register it

class MathNodeView extends Component<MathNodeViewProps> {
  private mathFieldRef: React.RefObject<MathfieldElement | null>;
  private cleanup?: () => void;

  constructor(props: MathNodeViewProps) {
    super(props);
    this.mathFieldRef = React.createRef<MathfieldElement>();
  }

  componentDidMount() {
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
