import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { mergeAttributes } from "@tiptap/core";
import ResizableImageView from "../components/ResizableImageView";

const ResizableImageExtension = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "500px",
        renderHTML: (attributes) => ({
          width: attributes.width,
        }),
      },
      height: {
        default: "auto",
        renderHTML: (attributes) => ({
          height: attributes.height,
        }),
      },
      align: {
        default: "left",
        renderHTML: (attributes) => ({
          "data-align": attributes.align,
        }),
        parseHTML: (element) => element.getAttribute("data-align") || "left",
      },
    };
  },
  renderHTML({ node, HTMLAttributes }) {
    const align = node.attrs.align || "left";
    const textAlignMap: Record<string, string> = {
      left: "left",
      center: "center",
      right: "right",
    };
    const textAlign = textAlignMap[align] || "left";

    return [
      "div",
      {
        class: "resizable-image-wrapper resizable-image-wrapper-align-" + align,
        style: `text-align: ${textAlign}; width: 100%; display: block;`,
        "data-align": align,
      },
      [
        "div",
        {
          class: "resizable-image-container align-" + align,
          style: `display: inline-block; width: ${node.attrs.width || "500px"}; height: ${node.attrs.height || "auto"};`,
        },
        [
          "img",
          mergeAttributes(HTMLAttributes, {
            src: node.attrs.src,
            alt: node.attrs.alt || "",
            title: node.attrs.title || "",
            width: node.attrs.width,
            height: node.attrs.height,
            "data-align": align,
          }),
        ],
      ],
    ];
  },
  parseHTML() {
    return [
      {
        tag: "img[src]",
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          const img = element as HTMLImageElement;
          const wrapper = img.closest(".resizable-image-wrapper") || img.parentElement;
          let align = "left";
          
          if (wrapper) {
            const dataAlign = wrapper.getAttribute("data-align") || img.getAttribute("data-align");
            if (dataAlign) {
              align = dataAlign;
            } else {
              const style = window.getComputedStyle(wrapper);
              const textAlign = style.textAlign;
              if (textAlign === "center") align = "center";
              else if (textAlign === "right") align = "right";
            }
          } else {
            const dataAlign = img.getAttribute("data-align");
            if (dataAlign) align = dataAlign;
          }
          
          return {
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt"),
            title: img.getAttribute("title"),
            width: img.getAttribute("width") || "500px",
            height: img.getAttribute("height") || "auto",
            align: align,
          };
        },
      },
      {
        tag: "div.resizable-image-wrapper img",
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          const img = element as HTMLImageElement;
          const wrapper = img.closest(".resizable-image-wrapper");
          let align = "left";
          
          if (wrapper) {
            const dataAlign = wrapper.getAttribute("data-align");
            if (dataAlign) align = dataAlign;
          }
          
          return {
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt"),
            title: img.getAttribute("title"),
            width: img.getAttribute("width") || "500px",
            height: img.getAttribute("height") || "auto",
            align: align,
          };
        },
      },
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView as any);
  },
});

export default ResizableImageExtension;
