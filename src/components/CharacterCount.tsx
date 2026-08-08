import type { Editor } from "@tiptap/react";
import { useEditorForceUpdate } from "../hooks/useEditorForceUpdate";
import { EDITOR_LIMITS } from "../constants/config";
import { getEditorContentStats } from "../utils/contentStats";

const CharacterCount = ({ editor }: { editor: Editor | null }) => {
  useEditorForceUpdate(editor);

  if (!editor) return null;

  const { characters, words, equations, images, videos } =
    getEditorContentStats(editor);
  const limit = EDITOR_LIMITS.maxCharacters;
  const nearLimit = characters >= limit * 0.9;
  const overLimit = characters >= limit;

  const extras: string[] = [];
  if (equations) extras.push(`${equations} eq`);
  if (images) extras.push(`${images} img`);
  if (videos) extras.push(`${videos} video`);

  return (
    <div
      className={`character-count${overLimit ? " is-over-limit" : nearLimit ? " is-near-limit" : ""}`}
      aria-live="polite"
    >
      <span className="character-count-primary">
        <span>
          {characters.toLocaleString()}
          {limit ? ` / ${limit.toLocaleString()}` : ""} chars
        </span>
        <span aria-hidden="true"> · </span>
        <span>{words.toLocaleString()} words</span>
      </span>
      {extras.length > 0 && (
        <span className="character-count-extras">{extras.join(" · ")}</span>
      )}
    </div>
  );
};

export default CharacterCount;
