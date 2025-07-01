import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
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
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView as any);
  },
});

export default ResizableImageExtension;
