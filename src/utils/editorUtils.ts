import { validateLatex } from "./helpers";

export function setFontSize(editor: any, size: number | string) {
  editor.chain().focus().setMark("customTextStyle", { fontSize: size }).run();
}

export function setBackgroundColor(editor: any, color: string) {
  editor.chain().focus().setBackgroundColor(color).run();
}

export function setFontFamily(editor: any, family: string) {
  if (!family || family === "") {
    editor
      .chain()
      .focus()
      .unsetMark("customTextStyle", { fontFamily: null })
      .run();
  } else {
    editor
      .chain()
      .focus()
      .setMark("customTextStyle", { fontFamily: family })
      .run();
  }
}

export function insertTable(editor: any) {
  if (editor) {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }
}

export function addImage(editor: any, urls: string | string[]) {
  if (Array.isArray(urls)) {
    if (urls.length > 1) {
      const imageNodes = urls.map((url) => ({
        type: "image",
        attrs: { src: url, width: "250px" },
      }));
      const content = [{ type: "imageGroup", content: imageNodes }];
      editor.chain().focus().insertContent(content).run();
    } else if (urls.length === 1) {
      editor.chain().focus().setImage({ src: urls[0], width: "500px" }).run();
    }
  } else if (typeof urls === "string") {
    editor.chain().focus().setImage({ src: urls, width: "500px" }).run();
  }
}

export function insertMath(editor: any, latex: string) {
  try {
    if (!editor) {
      throw new Error("Editor instance is not available");
    }

    const trimmedLatex = latex.trim();
    const validation = validateLatex(trimmedLatex);

    if (!validation.isValid) {
      throw new Error(validation.error || "Invalid LaTeX expression");
    }

    editor
      .chain()
      .focus()
      .insertContent({ type: "math", attrs: { latex: trimmedLatex } })
      .run();
  } catch (err) {
    console.error("Math insertion error:", err);
    if (err instanceof Error) {
      throw err;
    }
    throw new Error("Error inserting math equation");
  }
}

export async function validateAndInsertImage(editor: any, url: string) {
  if (editor && url) {
    try {
      const response = await fetch(url, { method: "HEAD" });
      if (!response.ok) throw new Error("Invalid image URL");

      editor.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      console.error("Image insertion error:", err);
      throw new Error(
        "Error inserting image: Invalid URL or image not accessible",
      );
    }
  }
}
