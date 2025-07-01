import { Mark, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    backgroundColor: {
      setBackgroundColor: (color: string) => ReturnType;
      unsetBackgroundColor: () => ReturnType;
    };
  }
}

// Custom BackgroundColor extension
const BackgroundColor = Mark.create({
  name: "backgroundColor",
  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },
  addAttributes() {
    return {
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.style.backgroundColor || null,
        renderHTML: (attributes) => {
          if (!attributes.backgroundColor) return {};
          return { style: `background-color: ${attributes.backgroundColor}` };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        style: "background-color",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
  addCommands() {
    return {
      setBackgroundColor:
        (color: string) =>
        ({ commands }) => {
          return commands.setMark(this.name, { backgroundColor: color });
        },
      unsetBackgroundColor:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});

export default BackgroundColor;
