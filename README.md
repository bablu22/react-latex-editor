# React Rich Text with Math

<div align="center">

![npm version](https://img.shields.io/npm/v/react-latex-editor)
![npm downloads](https://img.shields.io/npm/dm/react-latex-editor)
![license](https://img.shields.io/npm/l/react-latex-editor)
![typescript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![react](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)

A powerful React rich text editor with mathematical equation support, built on
TipTap with MathLive integration. This package provides a comprehensive WYSIWYG
editor that supports mathematical equations, tables, images, and more.

[📖 Documentation](#documentation) • [🚀 Quick Start](#quick-start) •
[🎯 Examples](#examples) • [🔧 API Reference](#api-reference) •
[🎨 Customization](#customization)

</div>

## ✨ Features

- 🎨 **Rich Text Editing**: Full-featured WYSIWYG editor based on TipTap
- 🧮 **Mathematical Equations**: Inline and block math support with MathLive
- 📊 **Tables**: Create and edit tables with resizable columns
- 🖼️ **Images**: Insert and resize images with alignment options
- 🎥 **YouTube Videos**: Embed and resize YouTube videos
- 🎨 **Text Formatting**: Bold, italic, underline, strikethrough, colors, and
  more
- 📝 **Code Blocks**: Syntax highlighting with lowlight
- 📋 **Lists**: Bullet points, numbered lists, and task lists
- 🔗 **Links**: Insert and edit hyperlinks
- 📏 **Text Alignment**: Left, center, right alignment
- 🎯 **Character Count**: Track content length
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔧 **TypeScript Support**: Full TypeScript definitions included
- ♿ **Accessibility**: ARIA labels and keyboard navigation support
- 🎨 **Customizable**: CSS custom properties for easy theming
- ⚡ **Performance**: Optimized bundle size (~90KB gzipped)

## 📦 Installation

```bash
npm install react-latex-editor
```

### Peer Dependencies

This package requires React 18+ and React DOM 18+ as peer dependencies:

```bash
npm install react react-dom
```

### Next.js Compatibility

This package is fully compatible with Next.js (both App Router and Pages
Router).

**⚠️ Important for Next.js users:** Due to server-side rendering (SSR), you need
to use client-side only imports. See our
[comprehensive Next.js guide](./NEXTJS.md) for:

- ✅ Quick start examples for App Router and Pages Router
- ✅ Solutions for common SSR errors (ReactCurrentDispatcher, window/document
  undefined)
- ✅ Complete working examples (blog editor, quiz system, etc.)
- ✅ Performance optimization tips
- ✅ TypeScript configuration

**Quick Solution:**

For **App Router** (Next.js 13+), use the `'use client'` directive:

```tsx
"use client";

import { Editor, Viewer } from "react-latex-editor";
import "react-latex-editor/styles";

export default function MyEditor() {
  const [content, setContent] = useState("<p>Start typing...</p>");

  return <Editor initialContent={content} onChange={setContent} />;
}
```

For **Pages Router**, use dynamic imports:

```tsx
import dynamic from "next/dynamic";

const Editor = dynamic(
  () => import("react-latex-editor").then((mod) => mod.Editor),
  { ssr: false },
);
```

For detailed instructions and complete examples, see [NEXTJS.md](./NEXTJS.md).

## 🚀 Quick Start

```tsx
import React, { useRef, useState } from "react";
import { Editor, Viewer, type EditorRef } from "react-latex-editor";
import "react-latex-editor/styles";

const App = () => {
  const [content, setContent] = useState(
    "<p>Start typing your content here...</p>",
  );
  const editorRef = useRef<EditorRef>(null);

  return (
    <div style={{ width: "60%", height: "100vh", margin: "0 auto" }}>
      <Editor
        ref={editorRef}
        initialContent={content}
        onChange={setContent}
        placeholder="Type your content..."
        autoFocus={true}
      />
      <Viewer content={content} />
    </div>
  );
};

export default App;
```

## 📖 Documentation

### Basic Usage

#### Editor Component

The main `Editor` component provides a full-featured rich text editor:

```tsx
import { Editor, EditorRef } from "react-latex-editor";

interface EditorProps {
  initialContent?: string; // Initial HTML content
  onChange?: (content: string) => void; // Content change callback
  placeholder?: string; // Placeholder text
  readOnly?: boolean; // Read-only mode
  autoFocus?: boolean; // Auto-focus on mount
  className?: string; // Additional CSS classes
  onImageSelectionRequest?: () => void; // Image selection callback
  minHeight?: string; // Minimum height (default: "300px")
  maxHeight?: string; // Maximum height for scrolling
  showCharacterCount?: boolean; // Show character count (default: true)
  showTableControls?: boolean; // Show table controls (default: true)
}
```

#### Editor Reference

Access editor methods through the ref:

```tsx
const editorRef = useRef<EditorRef>(null);

// Get current HTML content
const html = editorRef.current?.getHTML();

// Set content programmatically
editorRef.current?.setContent("<p>New content</p>");

// Add images programmatically
editorRef.current?.addImage(["https://example.com/image.jpg"]);
```

#### Viewer Component

Display content in read-only mode with math rendering:

```tsx
import { Viewer } from "react-latex-editor";

function ContentViewer({ content }: { content: string }) {
  return (
    <Viewer
      content={content}
      className="my-viewer"
      enableMath={true}
      mathJaxConfig={{
        inlineMath: [["$", "$"]],
        displayMath: [["$$", "$$"]],
        packages: ["base", "ams"],
      }}
    />
  );
}
```

### Advanced Usage

#### Custom Toolbar

The editor includes a comprehensive toolbar with:

- **Text Formatting**: Bold, italic, underline, strikethrough
- **Headings**: H1-H6
- **Text Alignment**: Left, center, right
- **Text Color**: Text color and background color
- **Lists**: Bullet, numbered, task lists
- **Tables**: Create and edit tables
- **Media**: Images, YouTube videos
- **Mathematical Equations**: Inline and block math
- **Code Blocks**: Syntax highlighting
- **Other**: Links, blockquotes, horizontal rules

#### Mathematical Equations

Insert mathematical equations using the math button in the toolbar:

```tsx
// Inline math: $x^2 + y^2 = z^2$
// Block math: $$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$
```

The editor supports both inline and block math equations with a comprehensive
symbol palette powered by MathLive.

#### Tables

Create tables with the table button:

- Add/remove rows and columns
- Merge/split cells
- Resize columns
- Align content

#### Images

Insert images with:

- Drag and drop support
- URL input
- Resize handles
- Alignment options (left, center, right)
- Alt text support

#### YouTube Videos

Embed YouTube videos with:

- URL input
- Resize handles
- Responsive design

## 🎯 Examples

### Basic Editor

```tsx
import { Editor } from "react-latex-editor";

function BasicEditor() {
  return (
    <Editor
      placeholder="Start writing your content..."
      onChange={(content) => console.log(content)}
    />
  );
}
```

### Read-only Viewer

```tsx
import { Viewer } from "react-latex-editor";

function ContentViewer({ content }: { content: string }) {
  return <Viewer content={content} />;
}
```

### Custom Height Editor

```tsx
import { Editor } from "react-latex-editor";

function CustomHeightEditor() {
  return (
    <Editor
      minHeight="400px"
      maxHeight="600px"
      placeholder="Content with custom height..."
    />
  );
}
```

### Editor with Image Handler

```tsx
import { Editor } from "react-latex-editor";

function EditorWithImageHandler() {
  const handleImageRequest = () => {
    // Open your image picker/modal here
    const imageUrl = prompt("Enter image URL:");
    if (imageUrl) {
      // Handle image insertion
    }
  };

  return (
    <Editor
      onImageSelectionRequest={handleImageRequest}
      placeholder="Editor with custom image handling..."
    />
  );
}
```

### Minimal Editor

```tsx
import { Editor } from "react-latex-editor";

function MinimalEditor() {
  return (
    <Editor
      showCharacterCount={false}
      showTableControls={false}
      placeholder="Minimal editor..."
    />
  );
}
```

### Dark Mode Editor

```tsx
import { Editor } from "react-latex-editor";

function DarkModeEditor() {
  return (
    <div className="dark-theme">
      <Editor
        placeholder="Dark mode editor..."
        onChange={(content) => console.log(content)}
      />
    </div>
  );
}
```

### Math-Focused Editor

```tsx
import { Editor } from "react-latex-editor";

function MathEditor() {
  return (
    <Editor
      initialContent="<p>Solve the equation: $x^2 + 5x + 6 = 0$</p>"
      placeholder="Write mathematical content..."
      onChange={(content) => console.log(content)}
    />
  );
}
```

## 🎨 Customization

### Import Styles

Import the default styles:

```tsx
import "react-latex-editor/styles";
```

## 🔧 API Reference

### Editor Props

| Prop                      | Type                        | Default                              | Description                  |
| ------------------------- | --------------------------- | ------------------------------------ | ---------------------------- |
| `initialContent`          | `string`                    | `"<p>Start typing something...</p>"` | Initial HTML content         |
| `onChange`                | `(content: string) => void` | -                                    | Content change callback      |
| `placeholder`             | `string`                    | `"Start typing..."`                  | Placeholder text             |
| `readOnly`                | `boolean`                   | `false`                              | Read-only mode               |
| `autoFocus`               | `boolean`                   | `false`                              | Auto-focus on mount          |
| `className`               | `string`                    | `""`                                 | Additional CSS classes       |
| `onImageSelectionRequest` | `() => void`                | -                                    | Image selection callback     |
| `minHeight`               | `string`                    | `"300px"`                            | Minimum height               |
| `maxHeight`               | `string`                    | -                                    | Maximum height for scrolling |
| `showCharacterCount`      | `boolean`                   | `true`                               | Show character count         |
| `showTableControls`       | `boolean`                   | `true`                               | Show table controls          |

### EditorRef Methods

| Method       | Parameters        | Description                 |
| ------------ | ----------------- | --------------------------- |
| `getHTML`    | -                 | Get current HTML content    |
| `setContent` | `content: string` | Set editor content          |
| `addImage`   | `urls: string[]`  | Add images programmatically |

### Viewer Props

| Prop            | Type      | Default | Description                  |
| --------------- | --------- | ------- | ---------------------------- |
| `content`       | `string`  | -       | HTML content to display      |
| `className`     | `string`  | `""`    | Additional CSS classes       |
| `enableMath`    | `boolean` | `true`  | Enable MathJax rendering     |
| `mathJaxConfig` | `object`  | `{}`    | Custom MathJax configuration |

## 🔍 Troubleshooting

### Common Issues

1. **Styles not loading**: Make sure to import the styles:

   ```tsx
   import "react-latex-editor/styles";
   ```

2. **Math equations not rendering**: Ensure MathJax is properly configured in
   the Viewer component.

3. **TypeScript errors**: Make sure you're using React 18+ and have the latest
   TypeScript definitions.

4. **Images not uploading**: Implement the `onImageSelectionRequest` callback
   for custom image handling.

### Getting Help

If you encounter any issues:

1. Check the [examples](#examples) section
2. Review the [API reference](#api-reference)
3. Open an issue on GitHub with a minimal reproduction

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before
submitting pull requests.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 [Documentation](https://github.com/bablu22/react-latex-editor#readme)
- 🐛 [Report Issues](https://github.com/bablu22/react-latex-editor/issues)
- 💬 [Discussions](https://github.com/bablu22/react-latex-editor/discussions)
- ⭐ [Star on GitHub](https://github.com/bablu22/react-latex-editor)

---

<div align="center">

Made with ❤️ by [Bablu Mia](https://github.com/bablu22)

</div>
