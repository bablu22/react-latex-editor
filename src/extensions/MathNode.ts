import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import MathNodeView from "./MathNodeView";

const MathNode = Node.create({
  name: "math",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      latex: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-latex") || "",
        renderHTML: (attributes) => ({
          "data-latex": attributes.latex || "",
        }),
      },
      displayMode: {
        default: false,
        parseHTML: (element) =>
          element.hasAttribute("data-display-mode") &&
          element.getAttribute("data-display-mode") !== "false",
        renderHTML: (attributes) => {
          if (!attributes.displayMode) return {};
          return { "data-display-mode": "true" };
        },
      },
    };
  },

  parseHTML() {
    return [
      { tag: 'span[data-type="math"]' },
      { tag: 'div[data-type="math"]' },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const displayMode = Boolean(node?.attrs?.displayMode);
    const latex = node?.attrs?.latex || "";

    // Always emit <span> so HTML stays valid inside paragraphs and text
    // can sit before/after the equation.
    return [
      "span",
      {
        ...HTMLAttributes,
        "data-type": "math",
        "data-latex": latex,
        ...(displayMode ? { "data-display-mode": "true" } : {}),
        class: displayMode
          ? "math-node-wrapper math-node-wrapper-block"
          : "math-node-wrapper math-node-wrapper-inline",
      },
      latex,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathNodeView as never);
  },
});

export default MathNode;
