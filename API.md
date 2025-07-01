# API Reference

This document provides detailed information about the React Rich Text with Math
API.

## Table of Contents

- [Components](#components)
  - [Editor](#editor)
  - [Viewer](#viewer)
- [Types](#types)
  - [EditorRef](#editorref)
  - [EditorProps](#editorprops)
  - [ViewerProps](#viewerprops)
- [Hooks](#hooks)
- [Utilities](#utilities)
- [Extensions](#extensions)

## Components

### Editor

The main rich text editor component with mathematical equation support.

```tsx
import { Editor, type EditorRef } from "react-latex-editor";

const editorRef = useRef<EditorRef>(null);

<Editor
  ref={editorRef}
  initialContent="<p>Start typing...</p>"
  onChange={(content) => console.log(content)}
  placeholder="Type your content..."
  autoFocus={true}
  readOnly={false}
  className="my-editor"
  onImageSelectionRequest={() => {
    // Handle image selection
  }}
  minHeight="300px"
  maxHeight="600px"
  showCharacterCount={true}
  showTableControls={true}
/>;
```

#### Props

| Prop                      | Type                        | Default                              | Required | Description                                        |
| ------------------------- | --------------------------- | ------------------------------------ | -------- | -------------------------------------------------- |
| `initialContent`          | `string`                    | `"<p>Start typing something...</p>"` | No       | Initial HTML content for the editor                |
| `onChange`                | `(content: string) => void` | -                                    | No       | Callback function called when content changes      |
| `placeholder`             | `string`                    | `"Start typing..."`                  | No       | Placeholder text shown when editor is empty        |
| `readOnly`                | `boolean`                   | `false`                              | No       | Whether the editor is in read-only mode            |
| `autoFocus`               | `boolean`                   | `false`                              | No       | Whether to automatically focus the editor on mount |
| `className`               | `string`                    | `""`                                 | No       | Additional CSS classes for the editor container    |
| `onImageSelectionRequest` | `() => void`                | -                                    | No       | Callback when user requests to insert an image     |
| `minHeight`               | `string`                    | `"300px"`                            | No       | Minimum height of the editor                       |
| `maxHeight`               | `string`                    | -                                    | No       | Maximum height before scrolling is enabled         |
| `showCharacterCount`      | `boolean`                   | `true`                               | No       | Whether to show character count                    |
| `showTableControls`       | `boolean`                   | `true`                               | No       | Whether to show table controls                     |

#### Methods (via ref)

| Method                | Parameters        | Return Type | Description                  |
| --------------------- | ----------------- | ----------- | ---------------------------- |
| `getHTML()`           | -                 | `string`    | Get the current HTML content |
| `setContent(content)` | `content: string` | `void`      | Set the editor content       |
| `addImage(urls)`      | `urls: string[]`  | `void`      | Add images programmatically  |

### Viewer

A read-only component for displaying content with math rendering.

```tsx
import { Viewer } from "react-latex-editor";

<Viewer
  content="<p>Content with math: $x^2 + y^2 = z^2$</p>"
  className="my-viewer"
  enableMath={true}
  mathJaxConfig={{
    inlineMath: [["$", "$"]],
    displayMath: [["$$", "$$"]],
    packages: ["base", "ams"],
  }}
/>;
```

#### Props

| Prop            | Type            | Default | Required | Description                         |
| --------------- | --------------- | ------- | -------- | ----------------------------------- |
| `content`       | `string`        | -       | Yes      | HTML content to display             |
| `className`     | `string`        | `""`    | No       | Additional CSS classes              |
| `enableMath`    | `boolean`       | `true`  | No       | Whether to enable MathJax rendering |
| `mathJaxConfig` | `MathJaxConfig` | `{}`    | No       | Custom MathJax configuration        |

## Types

### EditorRef

```tsx
interface EditorRef {
  getHTML(): string;
  setContent(content: string): void;
  addImage(urls: string[]): void;
}
```

### EditorProps

```tsx
interface EditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
  className?: string;
  onImageSelectionRequest?: () => void;
  minHeight?: string;
  maxHeight?: string;
  showCharacterCount?: boolean;
  showTableControls?: boolean;
}
```

### ViewerProps

```tsx
interface ViewerProps {
  content: string;
  className?: string;
  enableMath?: boolean;
  mathJaxConfig?: MathJaxConfig;
}
```

### MathJaxConfig

```tsx
interface MathJaxConfig {
  inlineMath?: [string, string][];
  displayMath?: [string, string][];
  packages?: string[];
  [key: string]: any;
}
```

## Hooks

### useEditor

A custom hook for managing editor state.

```tsx
import { useEditor } from "react-latex-editor";

const { content, setContent, editorRef } = useEditor({
  initialContent: "<p>Initial content</p>",
  onChange: (content) => console.log(content),
});
```

#### Parameters

| Parameter | Type               | Description                          |
| --------- | ------------------ | ------------------------------------ |
| `options` | `UseEditorOptions` | Configuration options for the editor |

#### Returns

| Property     | Type                        | Description             |
| ------------ | --------------------------- | ----------------------- |
| `content`    | `string`                    | Current editor content  |
| `setContent` | `(content: string) => void` | Function to set content |
| `editorRef`  | `RefObject<EditorRef>`      | Reference to the editor |

### UseEditorOptions

```tsx
interface UseEditorOptions {
  initialContent?: string;
  onChange?: (content: string) => void;
}
```

## Utilities

### Content Utilities

```tsx
import {
  sanitizeHTML,
  extractMathExpressions,
  validateContent,
} from "react-latex-editor/utils";

// Sanitize HTML content
const cleanHTML = sanitizeHTML(dirtyHTML);

// Extract math expressions from content
const mathExpressions = extractMathExpressions(content);

// Validate content structure
const isValid = validateContent(content);
```

### Math Utilities

```tsx
import {
  parseLatex,
  renderMath,
  validateMathExpression,
} from "react-latex-editor/utils/math";

// Parse LaTeX expression
const parsed = parseLatex("x^2 + y^2 = z^2");

// Render math expression
const rendered = renderMath("x^2 + y^2 = z^2", { display: true });

// Validate math expression
const isValid = validateMathExpression("x^2 + y^2 = z^2");
```

## Extensions

### Custom Extensions

You can create custom TipTap extensions to extend the editor functionality:

```tsx
import { Extension } from "@tiptap/core";

const CustomExtension = Extension.create({
  name: "customExtension",

  addCommands() {
    return {
      customCommand:
        () =>
        ({ commands }) => {
          // Custom command implementation
          return true;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Custom": () => this.editor.commands.customCommand(),
    };
  },
});
```

### Built-in Extensions

The editor includes the following TipTap extensions:

- **Basic**: Document, Text, Paragraph, Heading
- **Formatting**: Bold, Italic, Underline, Strike, Subscript, Superscript
- **Lists**: BulletList, OrderedList, TaskList
- **Tables**: Table, TableRow, TableCell, TableHeader
- **Media**: Image, YouTube
- **Math**: MathEquation (custom extension)
- **Code**: CodeBlock, CodeBlockLowlight
- **Misc**: Blockquote, HorizontalRule, Link, HardBreak, Placeholder

## Styling

### CSS Custom Properties

The editor uses CSS custom properties for theming:

```css
:root {
  /* Editor Colors */
  --editor-border-color: #e2e8f0;
  --editor-background: #ffffff;
  --editor-text-color: #213547;
  --editor-focus-color: #3b82f6;
  --editor-hover-color: #f1f5f9;

  /* Toolbar Colors */
  --toolbar-background: #f8fafc;
  --toolbar-border-color: #e2e8f0;
  --toolbar-button-hover: #e2e8f0;
  --toolbar-button-active: #dbeafe;

  /* Typography */
  --editor-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  --editor-font-size: 14px;
  --editor-line-height: 1.6;

  /* Spacing */
  --editor-padding: 1rem;
  --toolbar-padding: 0.5rem;
  --border-radius: 0.5rem;

  /* Transitions */
  --transition-duration: 0.2s;
}
```

### Dark Theme

```css
.dark-theme {
  --editor-border-color: #404040;
  --editor-background: #2d2d2d;
  --editor-text-color: #e2e8f0;
  --editor-focus-color: #60a5fa;
  --editor-hover-color: #374151;

  --toolbar-background: #1f2937;
  --toolbar-border-color: #404040;
  --toolbar-button-hover: #374151;
  --toolbar-button-active: #1e40af;
}
```

## Examples

### Basic Editor with State Management

```tsx
import React, { useState } from "react";
import { Editor, type EditorRef } from "react-latex-editor";
import "react-latex-editor/styles";

const MyEditor = () => {
  const [content, setContent] = useState("<p>Initial content</p>");
  const editorRef = useRef<EditorRef>(null);

  const handleSave = () => {
    const html = editorRef.current?.getHTML();
    console.log("Saving:", html);
  };

  return (
    <div>
      <Editor
        ref={editorRef}
        initialContent={content}
        onChange={setContent}
        placeholder="Start writing..."
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};
```

### Custom Image Handler

```tsx
const EditorWithImageHandler = () => {
  const handleImageRequest = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target.result;
          // Handle image upload to your server
          console.log("Image URL:", imageUrl);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <Editor
      onImageSelectionRequest={handleImageRequest}
      placeholder="Editor with custom image handling..."
    />
  );
};
```

### Math-Focused Editor

```tsx
const MathEditor = () => {
  return (
    <Editor
      initialContent={`
        <p>Solve the following equation:</p>
        <p>$$x^2 + 5x + 6 = 0$$</p>
        <p>Solution: $x = -2$ or $x = -3$</p>
      `}
      placeholder="Write mathematical content..."
      onChange={(content) => console.log(content)}
    />
  );
};
```

### Read-only Viewer with Custom Math Config

```tsx
const MathViewer = ({ content }: { content: string }) => {
  return (
    <Viewer
      content={content}
      enableMath={true}
      mathJaxConfig={{
        inlineMath: [
          ["$", "$"],
          ["\\(", "\\)"],
        ],
        displayMath: [
          ["$$", "$$"],
          ["\\[", "\\]"],
        ],
        packages: ["base", "ams", "noerrors"],
        errorSettings: {
          message: ["[Math Error]"],
        },
      }}
    />
  );
};
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Considerations

- The editor uses React.memo for performance optimization
- MathJax is loaded lazily to reduce initial bundle size
- CSS is optimized and tree-shakable
- Large content is handled efficiently with virtualization

## Accessibility

The editor includes comprehensive accessibility features:

- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Reduced motion support
- Focus management

## Troubleshooting

### Common Issues

1. **Math not rendering**: Ensure MathJax is properly configured
2. **Styles not loading**: Import the styles file
3. **TypeScript errors**: Check React version compatibility
4. **Performance issues**: Consider content virtualization for large documents

### Debug Mode

Enable debug mode for development:

```tsx
<Editor
  debug={true}
  // ... other props
/>
```

This will log additional information to the console for debugging purposes.

---

For more information, see the [README.md](README.md) file or visit the
[GitHub repository](https://github.com/bablu22/react-latex-editor).
