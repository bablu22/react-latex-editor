import type { Editor } from "@tiptap/react";
import { useEditorForceUpdate } from "../hooks/useEditorForceUpdate";

interface TableControlsProps {
  editor: Editor | null;
  readOnly?: boolean;
}

const TableControls = ({ editor, readOnly }: TableControlsProps) => {
  useEditorForceUpdate(editor);

  if (!editor?.isActive("table")) return null;

  const run = (command: () => boolean) => {
    if (!readOnly) command();
  };

  return (
    <div className="table-controls" role="toolbar" aria-label="Table controls">
      <div className="table-controls-group">
        <button
          onClick={() => run(() => editor.chain().focus().addColumnBefore().run())}
          title="Add column before"
          disabled={readOnly}
          type="button"
        >
          ←+
        </button>
        <button
          onClick={() => run(() => editor.chain().focus().addColumnAfter().run())}
          title="Add column after"
          disabled={readOnly}
          type="button"
        >
          +→
        </button>
        <button
          onClick={() => run(() => editor.chain().focus().deleteColumn().run())}
          title="Delete column"
          disabled={readOnly}
          type="button"
        >
          − Col
        </button>
      </div>
      <div className="table-controls-group">
        <button
          onClick={() => run(() => editor.chain().focus().addRowBefore().run())}
          title="Add row before"
          disabled={readOnly}
          type="button"
        >
          ↑+
        </button>
        <button
          onClick={() => run(() => editor.chain().focus().addRowAfter().run())}
          title="Add row after"
          disabled={readOnly}
          type="button"
        >
          +↓
        </button>
        <button
          onClick={() => run(() => editor.chain().focus().deleteRow().run())}
          title="Delete row"
          disabled={readOnly}
          type="button"
        >
          − Row
        </button>
      </div>
      <button
        onClick={() => run(() => editor.chain().focus().deleteTable().run())}
        title="Delete table"
        disabled={readOnly}
        className="delete-table-button"
        type="button"
      >
        Delete table
      </button>
    </div>
  );
};

export default TableControls;
