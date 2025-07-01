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
import FloatingMenu from "@tiptap/extension-floating-menu";
import MathNode from "../extensions/MathNode";
import InlineMath from "../extensions/InlineMath";
import ResizableImageExtension from "../extensions/ResizableImageExtension";
import ImageGroup from "../extensions/ImageGroup";
import CustomTextStyle from "../extensions/CustomTextStyle";
import BackgroundColor from "../extensions/BackgroundColor";
import ResizableYoutubeExtension from "../extensions/ResizableYoutubeExtension";
import TextStyle from "@tiptap/extension-text-style";

// Custom extensions
// import MathNode from "../components/MathNode";
// import InlineMath from "../extensions/InlineMath";
// import { ImageGroup } from "../extensions/ImageGroup";
// import ResizableImageExtension from "../extensions/ResizableImageExtension";
// import ResizableYoutubeExtension from "../extensions/ResizableYoutubeExtension";
// import BackgroundColor from "../extensions/BackgroundColor";
// import CustomTextStyle from "../extensions/CustomTextStyle";

// Create lowlight instance with common languages
const lowlight = createLowlight(common);

/**
 * Get editor extensions configuration
 * @returns {Array} Array of editor extensions
 */
export function getEditorExtensions() {
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
    }),
    MathNode,
    InlineMath,
    ResizableImageExtension.configure({
      allowBase64: true,
    }),
    ImageGroup,
    TextStyle,
    Color,
    BackgroundColor,
    TaskList,
    TaskItem,
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
      HTMLAttributes: {
        class: "editor-link",
        rel: "noopener noreferrer",
      },
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    Highlight,
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
      nocookie: false,
    }),
    Placeholder.configure({
      placeholder: "Start typing...",
    }),
    CharacterCount,
    FloatingMenu,
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
}) {
  return {
    attributes: {
      class: `prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none ${className} ${
        placeholder ? "has-placeholder" : ""
      }`,
      "aria-label": "Rich text editor",
      "aria-placeholder": placeholder,
    },
  };
}
