import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { mergeAttributes } from "@tiptap/core";
import ResizableImageView from "../components/ResizableImageView";
import { dataUrlToSvgMarkup } from "../utils/media";
import {
  extractSvgMarkupFromElement,
  normalizeSvgForResponsive,
  svgMarkupToDOMOutputSpec,
} from "../utils/svgDom";

function resolveSvgContent(attrs: {
  svgContent?: string | null;
  src?: string | null;
  mediaType?: string | null;
}): string | null {
  let markup: string | null = null;
  if (attrs.svgContent) markup = attrs.svgContent;
  else if (attrs.mediaType === "svg" && attrs.src) {
    markup = dataUrlToSvgMarkup(attrs.src);
  }
  if (!markup) return null;
  try {
    return normalizeSvgForResponsive(markup);
  } catch {
    return markup;
  }
}

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
      svgContent: {
        default: null,
        parseHTML: (element) => {
          if (typeof element === "string") return null;
          const el = element as HTMLElement;
          const wrapper = el.closest(".resizable-image-wrapper") || el;
          return extractSvgMarkupFromElement(wrapper);
        },
        renderHTML: () => ({}),
      },
      mediaType: {
        default: "image",
        parseHTML: (element) => {
          const explicit = element.getAttribute("data-media-type");
          if (explicit === "svg" || explicit === "image") return explicit;
          const src = element.getAttribute("src") || "";
          if (
            element.closest(".resizable-image-wrapper.is-svg") ||
            element.querySelector("svg") ||
            element.tagName.toLowerCase() === "svg"
          ) {
            return "svg";
          }
          if (
            src.startsWith("data:image/svg+xml") ||
            src.includes("image/svg+xml") ||
            /\.svg(\?|#|$)/i.test(src)
          ) {
            return "svg";
          }
          return "image";
        },
        renderHTML: (attributes) => ({
          "data-media-type": attributes.mediaType || "image",
        }),
      },
    };
  },
  renderHTML({ node, HTMLAttributes }) {
    const align = node.attrs.align || "left";
    const mediaType = node.attrs.mediaType || "image";
    const svgContent = resolveSvgContent(node.attrs);
    const textAlignMap: Record<string, string> = {
      left: "left",
      center: "center",
      right: "right",
    };
    const textAlign = textAlignMap[align] || "left";

    if (mediaType === "svg" && svgContent) {
      const svgSpec = svgMarkupToDOMOutputSpec(svgContent);

      return [
        "div",
        {
          class: `resizable-image-wrapper resizable-image-wrapper-align-${align} is-svg`,
          style: `text-align: ${textAlign}; width: 100%; display: block;`,
          "data-align": align,
          "data-media-type": "svg",
        },
        [
          "div",
          {
            class: `resizable-image-container align-${align} is-svg`,
            style: "display: block; width: 100%; max-width: 100%; height: auto;",
          },
          svgSpec,
        ],
      ];
    }

    return [
      "div",
      {
        class: `resizable-image-wrapper resizable-image-wrapper-align-${align}${
          mediaType === "svg" ? " is-svg" : ""
        }`,
        style: `text-align: ${textAlign}; width: 100%; display: block;`,
        "data-align": align,
        "data-media-type": mediaType,
      },
      [
        "div",
        {
          class: `resizable-image-container align-${align}${
            mediaType === "svg" ? " is-svg" : ""
          }`,
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
            "data-media-type": mediaType,
          }),
        ],
      ],
    ];
  },
  parseHTML() {
    const parseImageAttrs = (
      img: HTMLImageElement,
      wrapper: Element | null,
    ) => {
      let align = "left";

      if (wrapper) {
        const dataAlign =
          wrapper.getAttribute("data-align") ||
          img.getAttribute("data-align");
        if (dataAlign) {
          align = dataAlign;
        } else if (typeof window !== "undefined") {
          const style = window.getComputedStyle(wrapper);
          const textAlign = style.textAlign;
          if (textAlign === "center") align = "center";
          else if (textAlign === "right") align = "right";
        }
      } else {
        const dataAlign = img.getAttribute("data-align");
        if (dataAlign) align = dataAlign;
      }

      const src = img.getAttribute("src") || "";
      const mediaTypeAttr =
        img.getAttribute("data-media-type") ||
        wrapper?.getAttribute("data-media-type");
      const mediaType =
        mediaTypeAttr === "svg" || mediaTypeAttr === "image"
          ? mediaTypeAttr
          : src.startsWith("data:image/svg+xml") ||
              /\.svg(\?|#|$)/i.test(src)
            ? "svg"
            : "image";

      return {
        src,
        alt: img.getAttribute("alt"),
        title: img.getAttribute("title"),
        width: img.getAttribute("width") || "500px",
        height: img.getAttribute("height") || "auto",
        align,
        mediaType,
        svgContent: null as string | null,
      };
    };

    const parseInlineSvgAttrs = (wrapper: Element) => {
      const svg = wrapper.querySelector("svg");
      if (!svg) return false;

      const align = wrapper.getAttribute("data-align") || "left";
      const width = svg.getAttribute("width") || "auto";
      const height = svg.getAttribute("height") || "auto";

      return {
        src: "",
        alt: svg.getAttribute("aria-label") || "SVG figure",
        title: svg.getAttribute("title"),
        width,
        height,
        align,
        mediaType: "svg" as const,
        svgContent: svg.outerHTML,
      };
    };

    return [
      {
        tag: "div.resizable-image-wrapper.is-svg",
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          const wrapper = element as HTMLElement;
          const inline = parseInlineSvgAttrs(wrapper);
          if (inline) return inline;
          const img = wrapper.querySelector("img");
          if (!img) return false;
          const attrs = parseImageAttrs(img, wrapper);
          if (attrs.mediaType === "svg" && attrs.src) {
            attrs.svgContent = dataUrlToSvgMarkup(attrs.src);
          }
          return attrs;
        },
      },
      {
        tag: "img[src]",
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          const img = element as HTMLImageElement;
          const wrapper =
            img.closest(".resizable-image-wrapper") || img.parentElement;
          const attrs = parseImageAttrs(img, wrapper);
          if (attrs.mediaType === "svg" && attrs.src) {
            attrs.svgContent = dataUrlToSvgMarkup(attrs.src);
          }
          return attrs;
        },
      },
      {
        tag: "div.resizable-image-wrapper img",
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          const img = element as HTMLImageElement;
          const wrapper = img.closest(".resizable-image-wrapper");
          const attrs = parseImageAttrs(img, wrapper);
          if (attrs.mediaType === "svg" && attrs.src) {
            attrs.svgContent = dataUrlToSvgMarkup(attrs.src);
          }
          return attrs;
        },
      },
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView as never);
  },
});

export default ResizableImageExtension;