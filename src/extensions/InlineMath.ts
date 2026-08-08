import { Extension } from "@tiptap/core";
import { InputRule } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    inlineMath: {
      insertInlineMath: (latex: string, displayMode?: boolean) => ReturnType;
    };
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[-\/\\^$*+?.()|\[\]{}]/g, "\\$&");
}

const InlineMath = Extension.create({
  name: "inlineMath",

  addOptions() {
    return {
      inlineDelimiter: "$",
      blockDelimiter: "$$",
    };
  },

  addCommands() {
    return {
      insertInlineMath:
        (latex: string, displayMode = false) =>
        ({ commands }) => {
          return commands.insertContent({
            type: "math",
            attrs: { latex, displayMode },
          });
        },
    };
  },

  addInputRules() {
    const inlineDelimiter = escapeRegExp(this.options.inlineDelimiter);
    const blockDelimiter = escapeRegExp(this.options.blockDelimiter);

    return [
      // Block math first: $$latex$$ (must precede single-dollar rule)
      new InputRule({
        find: new RegExp(`${blockDelimiter}([^$]+)${blockDelimiter}$`),
        handler: ({ state, range, match }) => {
          const latexContent = match[1]?.trim();
          if (!latexContent) return;

          const { from, to } = range;
          const mathNode = state.schema.nodes.math;
          if (!mathNode) return;

          state.tr.replaceWith(
            from,
            to,
            mathNode.create({
              latex: latexContent,
              displayMode: true,
            }),
          );
        },
      }),

      // Inline math: $latex$ (reject empty / nested dollars)
      new InputRule({
        find: new RegExp(`(?<!\\$)${inlineDelimiter}([^$\\n]+)${inlineDelimiter}(?!\\$)$`),
        handler: ({ state, range, match }) => {
          const latexContent = match[1]?.trim();
          if (!latexContent) return;

          const { from, to } = range;
          const mathNode = state.schema.nodes.math;
          if (!mathNode) return;

          state.tr.replaceWith(
            from,
            to,
            mathNode.create({ latex: latexContent, displayMode: false }),
          );
        },
      }),
    ];
  },
});

export default InlineMath;
