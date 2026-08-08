import type { Editor } from "@tiptap/core";

export interface EditorContentStats {
  characters: number;
  words: number;
  equations: number;
  images: number;
  videos: number;
}

/**
 * Content stats that include atom nodes TipTap's CharacterCount skips (math, media).
 */
export function getEditorContentStats(editor: Editor | null): EditorContentStats {
  const empty: EditorContentStats = {
    characters: 0,
    words: 0,
    equations: 0,
    images: 0,
    videos: 0,
  };

  if (!editor) return empty;

  let characters = 0;
  let words = 0;
  let equations = 0;
  let images = 0;
  let videos = 0;

  editor.state.doc.descendants((node) => {
    if (node.isText && node.text) {
      characters += node.text.length;
      words += node.text.trim().split(/\s+/).filter(Boolean).length;
      return;
    }

    if (node.type.name === "math") {
      const latex = String(node.attrs.latex || "");
      equations += 1;
      characters += Math.max(latex.length, 1);
      words += 1;
      return;
    }

    if (node.type.name === "image") {
      images += 1;
      characters += 1;
      return;
    }

    if (node.type.name === "youtube") {
      videos += 1;
      characters += 1;
    }
  });

  return { characters, words, equations, images, videos };
}
