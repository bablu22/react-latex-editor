import StarterKit from "@tiptap/starter-kit";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import Strike from "@tiptap/extension-strike";
import Color from "@tiptap/extension-color";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import HardBreak from "@tiptap/extension-hard-break";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import MathNode from "../extensions/MathNode";
import InlineMath from "../extensions/InlineMath";
import ResizableImageExtension from "../extensions/ResizableImageExtension";
import ImageGroup from "../extensions/ImageGroup";
import CustomTextStyle from "../extensions/CustomTextStyle";
import BackgroundColor from "../extensions/BackgroundColor";
import ResizableYoutubeExtension from "../extensions/ResizableYoutubeExtension";
import TextStyle from "@tiptap/extension-text-style";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import { EDITOR_LIMITS } from "../constants/config";
import {
  filesToImageSources,
  isLikelySvgMarkup,
  isSupportedImageFile,
  svgMarkupToDataUrl,
} from "./media";
import type { EditorView } from "@tiptap/pm/view";

const lowlight = createLowlight(common);

export interface EditorExtensionOptions {
  placeholder?: string;
  characterLimit?: number;
}

function insertImageNodes(
  view: EditorView,
  items: Array<{
    src: string;
    alt?: string;
    mediaType?: "image" | "svg";
    width?: string;
  }>,
) {
  const imageType = view.state.schema.nodes.image;
  if (!imageType || items.length === 0) return;

  let tr = view.state.tr;
  if (items.length === 1) {
    const item = items[0];
    const node = imageType.create({
      src: item.src,
      alt: item.alt || "",
      width: item.width || (item.mediaType === "svg" ? "420px" : "500px"),
      height: "auto",
      mediaType: item.mediaType || "image",
    });
    tr = tr.replaceSelectionWith(node);
  } else {
    const groupType = view.state.schema.nodes.imageGroup;
    const imageNodes = items.map((item) =>
      imageType.create({
        src: item.src,
        alt: item.alt || "",
        width: "250px",
        height: "auto",
        mediaType: item.mediaType || "image",
      }),
    );
    if (groupType) {
      tr = tr.replaceSelectionWith(groupType.create(null, imageNodes));
    } else {
      for (const node of imageNodes) {
        tr = tr.replaceSelectionWith(node).scrollIntoView();
      }
    }
  }
  view.dispatch(tr.scrollIntoView());
}

/**
 * Get editor extensions configuration
 */
export function getEditorExtensions(options: EditorExtensionOptions = {}) {
  const {
    placeholder = "Start typing...",
    characterLimit = EDITOR_LIMITS.maxCharacters,
  } = options;

  return [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4, 5, 6],
      },
      codeBlock: false,
      blockquote: false,
      horizontalRule: false,
      hardBreak: false,
      strike: false,
      dropcursor: false,
      gapcursor: false,
    }),
    Dropcursor.configure({
      color: "#3b82f6",
      width: 2,
    }),
    Gapcursor,
    MathNode,
    InlineMath,
    ResizableImageExtension.configure({
      allowBase64: true,
    }),
    ImageGroup,
    TextStyle,
    Color,
    BackgroundColor,
    TaskList.configure({
      HTMLAttributes: {
        class: "editor-task-list",
      },
    }),
    TaskItem.configure({
      nested: true,
      HTMLAttributes: {
        class: "editor-task-item",
      },
    }),
    Table.configure({
      resizable: true,
      HTMLAttributes: {
        class: "editor-table",
      },
    }),
    TableRow,
    TableCell,
    TableHeader,
    Link.configure({
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
      HTMLAttributes: {
        class: "editor-link",
        rel: "noopener noreferrer nofollow",
        target: "_blank",
      },
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
      alignments: ["left", "center", "right", "justify"],
    }),
    Highlight.configure({
      multicolor: false,
    }),
    Underline,
    Subscript,
    Superscript,
    CodeBlockLowlight.configure({
      lowlight,
      HTMLAttributes: {
        class: "editor-code-block",
      },
    }),
    ResizableYoutubeExtension.configure({
      controls: true,
      nocookie: true,
      modestBranding: true,
    }),
    Placeholder.configure({
      placeholder,
      emptyEditorClass: "is-editor-empty",
      emptyNodeClass: "is-empty",
    }),
    CharacterCount.configure({
      limit: characterLimit,
    }),
    Blockquote.configure({
      HTMLAttributes: {
        class: "editor-blockquote",
      },
    }),
    HorizontalRule,
    HardBreak,
    Strike,
    CustomTextStyle.configure({
      HTMLAttributes: {
        class: "editor-text-style",
      },
    }),
  ];
}

export function getEditorProps({
  className = "",
  placeholder = "Start typing...",
}: {
  className?: string;
  placeholder?: string;
}) {
  return {
    attributes: {
      class: `prose focus:outline-none ${className}`.trim(),
      "aria-label": "Rich text editor content",
      "aria-placeholder": placeholder,
      spellcheck: "true",
    },
    handlePaste: (view: EditorView, event: ClipboardEvent) => {
      const clipboard = event.clipboardData;
      if (!clipboard) return false;

      const files = Array.from(clipboard.files || []).filter(isSupportedImageFile);
      if (files.length > 0) {
        event.preventDefault();
        void filesToImageSources(files)
          .then((items) => {
            insertImageNodes(
              view,
              items.map((item) => ({
                src: item.src,
                alt: item.alt,
                mediaType: item.isSvg ? "svg" : "image",
              })),
            );
          })
          .catch((err) => {
            console.error("Paste image/SVG failed:", err);
          });
        return true;
      }

      const text = clipboard.getData("text/plain");
      if (text && isLikelySvgMarkup(text)) {
        event.preventDefault();
        try {
          const src = svgMarkupToDataUrl(text);
          insertImageNodes(view, [
            { src, alt: "SVG figure", mediaType: "svg", width: "420px" },
          ]);
        } catch (err) {
          console.error("Paste SVG markup failed:", err);
          return false;
        }
        return true;
      }

      return false;
    },
    handleDrop: (view: EditorView, event: DragEvent) => {
      const files = Array.from(event.dataTransfer?.files || []).filter(
        isSupportedImageFile,
      );
      if (!files.length) return false;

      event.preventDefault();
      void filesToImageSources(files)
        .then((items) => {
          insertImageNodes(
            view,
            items.map((item) => ({
              src: item.src,
              alt: item.alt,
              mediaType: item.isSvg ? "svg" : "image",
            })),
          );
        })
        .catch((err) => {
          console.error("Drop image/SVG failed:", err);
        });
      return true;
    },
  };
}
