import { Node, mergeAttributes } from "@tiptap/core";

export const ImageGroup = Node.create({
  name: "imageGroup",
  group: "block",
  content: "image+",

  addAttributes() {
    return {
      align: {
        default: "left",
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
        style: `justify-content: ${alignValue}`,
      }),
      0,
    ];
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="image-group"]',
        getAttrs: (dom) => {
          const align = dom.style.justifyContent;
          if (align === "center" || align === "flex-end") {
            return { align: align === "center" ? "center" : "right" };
          }
          return { align: "left" };
        },
      },
    ];
  },
});

export default ImageGroup;
