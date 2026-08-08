import { Mark, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customTextStyle: {
      setCustomTextStyle: (attributes: {
        fontSize?: string | null;
        fontFamily?: string | null;
        color?: string | null;
      }) => ReturnType;
      unsetCustomTextStyle: () => ReturnType;
    };
  }
}

function mergeInlineStyles(
  ...parts: Array<string | undefined | false | null>
): string | undefined {
  const style = parts.filter(Boolean).join(" ");
  return style || undefined;
}

const CustomTextStyle = Mark.create({
  name: "customTextStyle",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: (element: HTMLElement) =>
          element.style.fontSize?.replace(/\s*!important/gi, "") || null,
        renderHTML: (attributes: { fontSize?: string | null }) => {
          if (!attributes.fontSize) return {};
          return {
            style: `font-size: ${attributes.fontSize}`,
          };
        },
      },
      color: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style.color || null,
        renderHTML: (attributes: { color?: string | null }) => {
          if (!attributes.color) return {};
          return { style: `color: ${attributes.color}` };
        },
      },
      fontFamily: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style.fontFamily || null,
        renderHTML: (attributes: { fontFamily?: string | null }) => {
          if (!attributes.fontFamily) return {};
          return { style: `font-family: ${attributes.fontFamily}` };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[style]",
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          const el = element as HTMLElement;
          const fontSize = el.style.fontSize || null;
          const color = el.style.color || null;
          const fontFamily = el.style.fontFamily || null;

          if (!fontSize && !color && !fontFamily) return false;

          return {
            fontSize: fontSize?.replace(/\s*!important/gi, "") || null,
            color,
            fontFamily,
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { style: existingStyle, ...rest } = HTMLAttributes as Record<
      string,
      string
    >;
    const style = mergeInlineStyles(existingStyle);

    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, rest, style ? { style } : {}),
      0,
    ];
  },

  addCommands() {
    return {
      setCustomTextStyle:
        (attributes) =>
        ({ commands }) =>
          commands.setMark(this.name, attributes),
      unsetCustomTextStyle:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});

export default CustomTextStyle;
