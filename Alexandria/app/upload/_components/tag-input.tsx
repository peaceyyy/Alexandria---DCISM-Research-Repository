"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  error?: string;
}

export function TagInput({
  value,
  onChange,
  placeholder = "Type a keyword and press Enter…",
  error,
}: TagInputProps) {
  const [input, setInput] = useState("");
  const errorId = useId();

  function addTag(raw: string) {
    const tag = raw.trim().toLowerCase().replace(/\s+/g, "-");
    if (!tag || value.includes(tag)) return;
    onChange([...value, tag]);
    setInput("");
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && input === "" && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text");
    // Only intercept if the pasted text looks like a list (has commas or newlines)
    if (!pasted.includes(",") && !pasted.includes("\n")) return;

    e.preventDefault();
    const tokens = pasted
      .split(/[,\n]+/)
      .map((t) => t.trim().toLowerCase().replace(/\s+/g, "-"))
      .filter((t) => t.length > 0 && !value.includes(t));

    if (tokens.length > 0) {
      onChange([...value, ...tokens]);
      setInput("");
    }
  }

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-lg border bg-[var(--color-surface-alt)] px-3 py-2 transition-[border-color,box-shadow,background-color] duration-150 motion-reduce:transition-none",
          error
            ? "border-[var(--color-danger)]/50 focus-within:border-[var(--color-danger)]/80 focus-within:ring-2 focus-within:ring-[var(--color-danger)]/15"
            : "border-[var(--color-separator)] focus-within:border-[var(--color-brand)]/60 focus-within:bg-[var(--color-surface)] focus-within:ring-2 focus-within:ring-[var(--color-brand-bright)]/20",
        )}
        role="group"
        aria-label="Keywords"
      >
        {value.map((tag) => {
          return (
            <span
              key={tag}
              className="flex items-center gap-1 rounded-full border border-[var(--color-separator-mid)] bg-[var(--color-text)]/5 px-2.5 py-0.5 text-xs font-medium text-[var(--color-text-muted)]"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove keyword ${tag}`}
                className="ml-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-text)]/10 hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-bright)]/30"
              >
                <X size={10} strokeWidth={2.5} aria-hidden />
              </button>
            </span>
          );
        })}

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={value.length === 0 ? placeholder : ""}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="min-w-[140px] flex-1 bg-transparent text-sm text-[var(--color-text)] placeholder-[var(--color-placeholder)] outline-none focus:outline-none"
        />
      </div>

      {error && (
        <p id={errorId} role="alert" className="text-xs text-[var(--color-danger)]">
          {error}
        </p>
      )}
    </div>
  );
}
