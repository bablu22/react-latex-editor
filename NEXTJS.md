# Next.js Integration Guide

This guide explains how to properly use the React Rich Text Editor with Math
support in Next.js applications.

## MathLive Import Issue Fix

The `MathfieldElement` import error in MathLive 0.105.x+ has been resolved. The
package now properly handles the import changes and is compatible with Next.js.

### Changes Made:

1. **Removed direct MathfieldElement imports**: The package no longer directly
   imports `MathfieldElement` from 'mathlive'
2. **Added centralized type definitions**: All MathLive types are now defined in
   `src/types/mathlive.ts`
3. **Improved Next.js compatibility**: Added client-side loading checks for
   server-side rendering

### Usage in Next.js:

```jsx
"use client"; // Add this for Next.js 13+ app directory

import dynamic from "next/dynamic";
import { Editor } from "react-latex-editor";
import "react-latex-editor/styles";

// For Next.js, you might want to load the editor dynamically to avoid SSR issues
const DynamicEditor = dynamic(
  () => import("react-latex-editor").then((mod) => ({ default: mod.Editor })),
  {
    ssr: false,
    loading: () => <div>Loading editor...</div>,
  },
);

export default function MyPage() {
  const [content, setContent] = useState("");

  return (
    <div>
      <DynamicEditor
        value={content}
        onChange={setContent}
        placeholder="Start typing..."
      />
    </div>
  );
}
```

### Alternative Usage (if dynamic import is not needed):

```jsx
"use client";

import { Editor } from "react-latex-editor";
import "react-latex-editor/styles";
import { useEffect, useState } from "react";

export default function MyPage() {
  const [content, setContent] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Editor
        value={content}
        onChange={setContent}
        placeholder="Start typing..."
      />
    </div>
  );
}
```

### Key Points:

- Always use `'use client'` directive in Next.js 13+ app directory
- Consider using dynamic imports or client-side mounting for better SSR
  compatibility
- The MathLive dependency is now properly handled and won't cause import errors
- All math-related functionality works as expected in Next.js environments
