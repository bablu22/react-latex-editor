import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";

/**
 * TipTap is bundled into the library so consumers can't resolve a mismatched
 * @tiptap/* major (e.g. v3 extensions against v2 core → missing getStyleProperty).
 * Only React and heavy optional runtime peers stay external.
 */
const external = [
  "react",
  "react-dom",
  "react/jsx-runtime",
  "lowlight",
  "mathlive",
  /^mathlive\//,
];

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      exclude: ["**/*.test.tsx", "**/*.test.ts", "**/dev.tsx"],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "ReactRichTextWithMath",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "esm" : format}.js`,
    },
    rollupOptions: {
      external,
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          lowlight: "Lowlight",
          mathlive: "MathLive",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") {
            return "react-latex-editor.css";
          }
          return assetInfo.name || "asset";
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
    cssCodeSplit: false,
  },
});
