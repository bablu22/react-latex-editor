import AlignmentControls from "./toolbars/AlignmentControls";
import BlockControls from "./toolbars/BlockControls";
import FontControls from "./toolbars/FontControls";
import HeadingControls from "./toolbars/HeadingControls";
import ImageAlignmentControls from "./toolbars/ImageAlignmentControls";
import ImageGroupAlignmentControls from "./toolbars/ImageGroupAlignmentControls";
import ListControls from "./toolbars/ListControls";
import SpecialFeaturesControls from "./toolbars/SpecialFeaturesControls";
import TextFormattingControls from "./toolbars/TextFormattingControls";
import YouTubeControls from "./toolbars/YouTubeControls";

export interface EditorToolbarProps {
  /**
   * The Tiptap editor instance
   */
  editor: any;
  /**
   * Whether the editor is in read-only mode
   */
  readOnly?: boolean;
  /**
   * Callback function to open the math dialog
   *  */
  onMathDialogOpen?: () => void;
  /**
   * Callback function for image selection
   */
  onImagePicker?: () => void;
}

const EditorToolbar = (props: EditorToolbarProps) => {
  const { editor, readOnly, onMathDialogOpen, onImagePicker } = props;

  return (
    <div className={`toolbar`} role="toolbar" aria-label="Editor toolbar">
      {/* Main Toolbar Content */}
      <div className="toolbar-content">
        <FontControls editor={editor} readOnly={readOnly} />
        <div className="toolbar-divider"></div>

        <TextFormattingControls editor={editor} readOnly={readOnly} />
        <div className="toolbar-divider"></div>

        <HeadingControls editor={editor} readOnly={readOnly} />
        <div className="toolbar-divider"></div>

        <ListControls editor={editor} readOnly={readOnly} />
        <div className="toolbar-divider"></div>

        <AlignmentControls editor={editor} readOnly={readOnly} />
        <div className="toolbar-divider"></div>

        <BlockControls editor={editor} readOnly={readOnly} />
        <div className="toolbar-divider"></div>

        <div
          className="toolbar-media-group"
          style={{ alignItems: "center", display: "flex" }}
        >
          <ImageAlignmentControls editor={editor} readOnly={readOnly} />
          <ImageGroupAlignmentControls editor={editor} readOnly={readOnly} />
          <YouTubeControls editor={editor} readOnly={readOnly} />
        </div>
        <SpecialFeaturesControls
          editor={editor}
          readOnly={readOnly}
          onMathDialogOpen={onMathDialogOpen ? onMathDialogOpen : () => {}}
          onImagePicker={onImagePicker ? onImagePicker : () => {}}
        />
      </div>
    </div>
  );
};

export default EditorToolbar;
