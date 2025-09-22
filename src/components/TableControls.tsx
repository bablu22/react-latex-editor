interface TableControlsProps {
  /**
   * The Tiptap editor instance
   */
  editor: any;
  /**
   * Whether the editor is in read-only mode
   */
  readOnly?: boolean;
}

const TableControls = ({ editor, readOnly }: TableControlsProps) => {
  if (!editor?.isActive("table")) return null;

  const tableCommands = {
    addColumnBefore: () => editor?.chain().focus().addColumnBefore().run(),
    addColumnAfter: () => editor?.chain().focus().addColumnAfter().run(),
    deleteColumn: () => editor?.chain().focus().deleteColumn().run(),
    addRowBefore: () => editor?.chain().focus().addRowBefore().run(),
    addRowAfter: () => editor?.chain().focus().addRowAfter().run(),
    deleteRow: () => editor?.chain().focus().deleteRow().run(),
    deleteTable: () => editor?.chain().focus().deleteTable().run(),
  };

  return (
    <div className="table-controls">
      <div className="table-controls-group">
        <button
          onClick={tableCommands.addColumnBefore}
          title="Add column before"
          disabled={readOnly}
          type="button"
        >
          ←+
        </button>
        <button
          onClick={tableCommands.addColumnAfter}
          title="Add column after"
          disabled={readOnly}
          type="button"
        >
          +→
        </button>
        <button
          onClick={tableCommands.deleteColumn}
          title="Delete column"
          disabled={readOnly}
          type="button"
        >
          -
        </button>
      </div>
      <div className="table-controls-group">
        <button
          onClick={tableCommands.addRowBefore}
          title="Add row before"
          disabled={readOnly}
          type="button"
        >
          ↑+
        </button>
        <button
          onClick={tableCommands.addRowAfter}
          title="Add row after"
          disabled={readOnly}
          type="button"
        >
          +↓
        </button>
        <button
          onClick={tableCommands.deleteRow}
          title="Delete row"
          disabled={readOnly}
          type="button"
        >
          -
        </button>
      </div>
      <button
        onClick={tableCommands.deleteTable}
        title="Delete table"
        disabled={readOnly}
        className="delete-table-button"
        type="button"
      >
        ×
      </button>
    </div>
  );
};

export default TableControls;
