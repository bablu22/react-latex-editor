# react-latex-editor

[![npm version](https://img.shields.io/npm/v/react-latex-editor)](https://www.npmjs.com/package/react-latex-editor)
[![npm downloads](https://img.shields.io/npm/dm/react-latex-editor)](https://www.npmjs.com/package/react-latex-editor)
[![license](https://img.shields.io/npm/l/react-latex-editor)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A React WYSIWYG editor with first-class LaTeX math support. Built on [TipTap](https://tiptap.dev/) with [MathLive](https://cortexjs.io/mathlive/) for equation authoring and MathJax for read-only rendering.

**[npm](https://www.npmjs.com/package/react-latex-editor)** · **[Issues](https://github.com/bablu22/react-latex-editor/issues)** · **[Changelog](https://github.com/bablu22/react-latex-editor/releases)**

---

## Features

- **Rich text** — bold, italic, underline, strike, colors, fonts, headings, lists, links, code blocks, blockquotes
- **Mathematics** — inline and display equations via MathLive; persists as HTML for round-trip editing
- **Tables** — insert, resize, and edit with row/column controls
- **Images** — upload, URL, drag-and-drop, resize, and alignment
- **SVG** — paste SVG markup from the toolbar, or insert programmatically
- **YouTube** — embed and resize videos
- **Viewer** — read-only rendering with MathJax
- **TypeScript** — full type definitions included
- **Accessible toolbar** — keyboard shortcuts and ARIA labels

---

## Installation

```bash
npm install react-latex-editor
```

**Peer dependencies:** React 18+ or 19+

```bash
npm install react react-dom
```

Import styles once in your app entry (or layout):

```tsx
import "react-latex-editor/styles";
```

---

## Quick start

```tsx
import { useRef, useState } from "react";
import { Editor, Viewer, type EditorRef } from "react-latex-editor";
import "react-latex-editor/styles";

export default function App() {
  const [content, setContent] = useState("<p></p>");
  const editorRef = useRef<EditorRef>(null);

  return (
    <>
      <Editor
        ref={editorRef}
        initialContent={content}
        onChange={setContent}
        placeholder="Start writing…"
        minHeight="320px"
      />
      <Viewer content={content} />
    </>
  );
}
```

---

## Next.js

This package uses browser APIs (DOM, MathLive). Load it on the client only.

**App Router** — mark the module as a client component:

```tsx
"use client";

import { useState } from "react";
import { Editor } from "react-latex-editor";
import "react-latex-editor/styles";

export default function MyEditor() {
  const [content, setContent] = useState("<p></p>");
  return <Editor initialContent={content} onChange={setContent} />;
}
```

**Pages Router** — disable SSR for the editor:

```tsx
import dynamic from "next/dynamic";

const Editor = dynamic(
  () => import("react-latex-editor").then((m) => m.Editor),
  { ssr: false },
);
```

---

## Usage

### Editor ref

```tsx
const editorRef = useRef<EditorRef>(null);

editorRef.current?.getHTML();
editorRef.current?.getJSON();
editorRef.current?.getText();
editorRef.current?.setContent("<p>Hello</p>");
editorRef.current?.clearContent();
editorRef.current?.focus();

// Images
editorRef.current?.addImage("https://example.com/photo.png");
editorRef.current?.addImage({
  src: "https://example.com/diagram.svg",
  mediaType: "svg",
  alt: "Diagram",
});

// SVG markup (same path as the toolbar “Paste SVG code” button)
await editorRef.current?.addSvg(`<svg xmlns="http://www.w3.org/2000/svg">…</svg>`);

// Files from your own <input type="file">
await editorRef.current?.addImagesFromFiles(fileList);
```

### Mathematics

Use the equation button in the toolbar (or `Ctrl`/`Cmd`+`M`). Equations can be inline or display mode. Content is stored in the document HTML so `getHTML()` / `setContent()` round-trip correctly.

### Images and SVG

| Action | Behavior |
| --- | --- |
| **Insert image** (toolbar) | Built-in picker (file / URL) unless you pass `onImageSelectionRequest` |
| **Paste SVG code** (toolbar) | Opens a dialog to paste `<svg>…</svg>` markup — no extra setup |
| Paste / drop | Image and SVG files, plus SVG markup, work in the editor surface |
| Custom upload UI | Provide `onImageSelectionRequest`, then call `addImage` / `addImagesFromFiles` / `addSvg` on the ref |

```tsx
import { useRef } from "react";
import { Editor, IMAGE_ACCEPT, type EditorRef } from "react-latex-editor";

function EditorWithCustomUpload() {
  const editorRef = useRef<EditorRef>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        multiple
        hidden
        onChange={async (e) => {
          if (e.target.files?.length) {
            await editorRef.current?.addImagesFromFiles(e.target.files);
          }
          e.target.value = "";
        }}
      />
      <Editor
        ref={editorRef}
        onImageSelectionRequest={() => inputRef.current?.click()}
      />
    </>
  );
}
```

### Viewer

```tsx
import { Viewer } from "react-latex-editor";

<Viewer
  content={html}
  className="viewer-shell"
  contentClassName="prose max-w-none"
  enableMath
/>
```

- `className` — wrapper element
- `contentClassName` — content root (prefer this for typography)

---

## API

### `Editor` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `initialContent` | `string` | `"<p></p>"` | Initial HTML |
| `onChange` | `(html: string) => void` | — | Fires on every update |
| `placeholder` | `string` | `"Start typing..."` | Empty-state placeholder |
| `readOnly` | `boolean` | `false` | Disable editing |
| `autoFocus` | `boolean` | `false` | Focus on mount |
| `className` | `string` | `""` | Extra class on the editor |
| `minHeight` | `string` | `"300px"` | Minimum editor height |
| `maxHeight` | `string` | — | Max height (scrollable) |
| `showCharacterCount` | `boolean` | `true` | Footer character / word stats |
| `showTableControls` | `boolean` | `true` | Table editing chrome |
| `onImageSelectionRequest` | `() => void` | — | Custom image picker; omit for built-in |
| `onError` | `(error: Error) => void` | — | Error callback |

### `EditorRef` methods

| Method | Signature | Description |
| --- | --- | --- |
| `getHTML` | `() => string` | Serialized HTML |
| `getJSON` | `() => Record<string, unknown>` | TipTap JSON document |
| `getText` | `() => string` | Plain text |
| `setContent` | `(content: string) => void` | Replace document |
| `clearContent` | `() => void` | Empty the editor |
| `focus` / `blur` | `() => void` | Focus management |
| `isEmpty` | `() => boolean` | Whether the doc is empty |
| `getEditor` | `() => Editor \| null` | Underlying TipTap instance |
| `addImage` | `(input: ImageInsertInput) => void` | Insert image(s) or SVG figures |
| `addSvg` | `(source: string \| File, options?) => Promise<void>` | Insert SVG from markup, URL, or file |
| `addImagesFromFiles` | `(files: FileList \| File[]) => Promise<void>` | Insert from a file list (data URLs) |

### `Viewer` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `string` | — | HTML to display |
| `className` | `string` | `""` | Wrapper class |
| `contentClassName` | `string` | `""` | Content class |
| `enableMath` | `boolean` | `true` | Enable MathJax |
| `mathJaxConfig` | `object` | `{}` | MathJax overrides |

### Notable exports

```tsx
import {
  Editor,
  Viewer,
  IMAGE_ACCEPT,
  insertMath,
  insertSvg,
  addImagesFromFiles,
  type EditorProps,
  type EditorRef,
  type ImageInsertItem,
  type ImageInsertInput,
} from "react-latex-editor";
```

---

## Examples

**Minimal**

```tsx
<Editor onChange={setContent} showCharacterCount={false} showTableControls={false} />
```

**Fixed height**

```tsx
<Editor minHeight="400px" maxHeight="640px" onChange={setContent} />
```

**Math-heavy content**

```tsx
<Editor
  initialContent="<p>Quadratic formula: </p>"
  placeholder="Write with equations…"
  onChange={setContent}
/>
```

**Styled viewer**

```tsx
<Viewer
  content={content}
  className="rounded-lg bg-neutral-50 p-6"
  contentClassName="text-lg leading-relaxed"
/>
```

---

## Troubleshooting

| Issue | Fix |
| --- | --- |
| Unstyled editor | Import `react-latex-editor/styles` |
| Next.js `window is not defined` | Use `"use client"` or `dynamic(..., { ssr: false })` |
| Math missing in Viewer | Keep `enableMath` enabled (default); check that content includes math nodes from the Editor |
| Custom image button does nothing | Call `addImagesFromFiles` / `addImage` / `addSvg` inside your `onImageSelectionRequest` handler |
| SVG not inserting | Use the **Paste SVG code** toolbar button, or `addSvg` with full `<svg>…</svg>` markup |

---

## Requirements

- Node.js 16+
- React 18 or 19
- Modern evergreen browsers

---

## Contributing

1. Fork and create a feature branch
2. Install dependencies and run `npm run dev`
3. Keep changes focused; run `npm run type-check` before opening a PR
4. Open a pull request with a clear description

---

## License

[MIT](./LICENSE) © [Bablu Mia](https://github.com/bablu22)
