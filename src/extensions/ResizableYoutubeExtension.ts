import Youtube from "@tiptap/extension-youtube";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ResizableYoutubeView from "../components/ResizableYoutubeView";

const ResizableYoutubeExtension = Youtube.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "640px",
        renderHTML: (attributes) => ({ width: attributes.width }),
      },
      height: {
        default: "360px",
        renderHTML: (attributes) => ({ height: attributes.height }),
      },
      align: {
        default: "center",
        renderHTML: (attributes) => ({ "data-align": attributes.align }),
        parseHTML: (element) => element.getAttribute("data-align") || "center",
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableYoutubeView as any);
  },
});

export default ResizableYoutubeExtension;
