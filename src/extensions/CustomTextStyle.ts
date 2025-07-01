import { Mark, mergeAttributes } from "@tiptap/core";

// Custom TextStyle extension with !important for font-size
const CustomTextStyle = Mark.create({
  name: "customTextStyle",
  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: (element) =>
          element.style.fontSize?.replace(" !important", "") || null,
        renderHTML: (attributes) => {
          if (!attributes.fontSize) return {};
          return { style: `font-size: ${attributes.fontSize} !important;` };
        },
      },
      color: {
        default: null,
        parseHTML: (element) => element.style.color || null,
        renderHTML: (attributes) => {
          if (!attributes.color) return {};
          return { style: `color: ${attributes.color}` };
        },
      },
      fontFamily: {
        default: null,
        parseHTML: (element) => element.style.fontFamily || null,
        renderHTML: (attributes) => {
          if (!attributes.fontFamily) return {};
          return { style: `font-family: ${attributes.fontFamily} !important;` };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "span",
        getAttrs: (element) => {
          const hasFontSize = element.style.fontSize;
          const hasColor = element.style.color;
          const hasFontFamily = element.style.fontFamily;

          if (hasFontSize || hasColor || hasFontFamily) {
            return {
              fontSize: hasFontSize
                ? hasFontSize.replace(" !important", "")
                : null,
              color: hasColor || null,
              fontFamily: hasFontFamily
                ? hasFontFamily.replace(" !important", "")
                : null,
            };
          }
          return false;
        },
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0];
  },
});

export default CustomTextStyle;
