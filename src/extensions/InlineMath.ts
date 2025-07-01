import { Extension } from "@tiptap/core";
import { InputRule } from "@tiptap/react";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    inlineMath: {
      insertInlineMath: (latex: string) => ReturnType;
    };
  }
}

const InlineMath = Extension.create({
  name: "inlineMath",

  addOptions() {
    return {
      inlineDelimiter: "$",
      blockDelimiter: "$$",
    };
  },

  addProseMirrorPlugins() {
    return [];
  },

  addCommands() {
    return {
      insertInlineMath:
        (latex: string) =>
        ({ commands }) => {
          return commands.insertContent({ type: "math", attrs: { latex } });
        },
    };
  },

  addInputRules() {
    const inlineDelimiterEscaped = this.options.inlineDelimiter.replace(
      /[-\/\\^$*+?.()|\[\]{}]/g,
      "\\$&",
    );
    const blockDelimiterEscaped = this.options.blockDelimiter.replace(
      /[-\/\\^$*+?.()|\[\]{}]/g,
      "\\$&",
    );

    return [
      // Inline math: $latex$
      new InputRule({
        find: new RegExp(
          `${inlineDelimiterEscaped}(.*?)${inlineDelimiterEscaped}$`,
        ),
        handler: ({ state, range, match }) => {
          const [, latexContent] = match;
          const { from, to } = range;

          state.tr.replaceWith(
            from,
            to,
            state.schema.nodes.math.create({ latex: latexContent }),
          );
        },
      }),

      // Block math: $$latex$$
      new InputRule({
        find: new RegExp(
          `${blockDelimiterEscaped}(.*?)${blockDelimiterEscaped}$`,
        ),
        handler: ({ state, range, match }) => {
          const [, latexContent] = match;
          const { from, to } = range;

          state.tr.replaceWith(
            from,
            to,
            state.schema.nodes.math.create({
              latex: latexContent,
              displayMode: true,
            }),
          );
        },
      }),
    ];
  },
});

export default InlineMath;
