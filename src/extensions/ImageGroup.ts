import { Node, mergeAttributes } from "@tiptap/core";

export const ImageGroup = Node.create({
  name: "imageGroup",
  group: "block",
  content: "image+",

  addAttributes() {
    return {
      align: {
        default: "left",
        parseHTML: (element) => element.getAttribute("data-align") || "left",
        renderHTML: (attributes) => ({
          "data-align": attributes.align || "left",
        }),
      },
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    const align = node.attrs.align || "left";
    const justifyContent: Record<string, string> = {
      left: "flex-start",
      center: "center",
      right: "flex-end",
    };
    const alignValue = justifyContent[align] || "flex-start";

    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "image-group",
        "data-align": align,
        class: "image-group",
        style: `display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: ${alignValue}`,
      }),
      0,
    ];
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="image-group"]',
        getAttrs: (dom) => {
          if (typeof dom === "string") return false;
          const el = dom as HTMLElement;
          const dataAlign = el.getAttribute("data-align");
          if (dataAlign === "center" || dataAlign === "right" || dataAlign === "left") {
            return { align: dataAlign };
          }
          const justify = el.style.justifyContent;
          if (justify === "center") return { align: "center" };
          if (justify === "flex-end" || justify === "right") return { align: "right" };
          return { align: "left" };
        },
      },
    ];
  },
});

export default ImageGroup;
