"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function TagMultiSelect({
  selectedTags,
  onAddTag,
  onRemoveTag,
}: {
  selectedTags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const normalizedDraft = draft.trim();
  const isDuplicate = selectedTags.some((tag) => tag.toLocaleLowerCase() === normalizedDraft.toLocaleLowerCase());

  const addTag = () => {
    if (!normalizedDraft || isDuplicate) return;
    onAddTag(normalizedDraft);
    setDraft("");
  };

  return (
    <div className="w-full">
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          addTag();
        }}
      >
        <label className="sr-only" htmlFor="tag-filter-input">Add a tag</label>
        <input
          id="tag-filter-input"
          type="text"
          name="tag"
          autoComplete="off"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Type a tag"
          className="min-h-11 min-w-0 flex-1 rounded-md border border-[var(--color-separator)] bg-[var(--color-surface)] px-3 py-1.5 text-[13px] text-[var(--color-text)] outline-none focus-visible:border-[var(--color-brand)] focus-visible:ring-1 focus-visible:ring-[var(--color-brand)]/40 sm:min-h-9"
        />
        <button
          type="submit"
          disabled={!normalizedDraft || isDuplicate}
          className="min-h-11 cursor-pointer rounded-md border border-[var(--color-separator-mid)] px-3 text-[12px] font-semibold text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-text-muted)] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/40 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-9"
        >
          Add
        </button>
      </form>
      <p className="mt-2 text-[12px] text-[var(--color-text-muted)]">Press Enter to add an exact tag filter.</p>
      {selectedTags.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Applied tag filters">
          {selectedTags.map((tag) => (
            <li
              key={tag}
              className="inline-flex items-center gap-1 rounded-md border border-[var(--color-separator-mid)] bg-[var(--color-text)]/[0.04] px-2 py-0.5 text-[12px] font-medium text-[var(--color-text-muted)]"
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="cursor-pointer rounded-full p-0.5 text-[var(--color-text-muted)] hover:bg-[var(--color-text)]/10 hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/40"
                aria-label={`Remove tag ${tag}`}
              >
                <X size={12} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
