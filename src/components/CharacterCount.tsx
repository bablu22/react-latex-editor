const CharacterCount = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  return (
    <div
      className="character-count"
      style={{
        textAlign: "right",
        fontSize: 12,
        color: "#888",
        marginTop: 4,
      }}
    >
      {editor.storage.characterCount.characters()} characters,{" "}
      {editor.storage.characterCount.words()} words
    </div>
  );
};

export default CharacterCount;
