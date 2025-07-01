import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import MathNodeView from "./MathNodeView";

const MathNode = Node.create({
  name: "math",
  group: "inline",
  inline: true,
  atom: true,

  addAttributes() {
    return {
      latex: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-latex"),
        renderHTML: (attributes) => {
          return {
            "data-latex": attributes.latex,
          };
        },
      },
      displayMode: {
        default: false,
        parseHTML: (element) => element.hasAttribute("data-display-mode"),
        renderHTML: (attributes) => {
          if (attributes.displayMode) {
            return {
              "data-display-mode": "",
            };
          }
          return {};
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="math"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      "span",
      {
        ...HTMLAttributes,
        "data-type": "math",
        "data-latex": node?.attrs?.latex || "",
      },
      node?.attrs?.latex || "",
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathNodeView as any);
  },
});

export default MathNode;
