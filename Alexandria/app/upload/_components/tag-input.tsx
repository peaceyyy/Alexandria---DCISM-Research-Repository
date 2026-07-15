"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  error?: string;
}

const TAG_PALETTE = [
  // blue
  { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-700 dark:text-blue-400", x: "text-blue-700/50 hover:text-blue-700 dark:text-blue-400/50 dark:hover:text-blue-400" },
  // teal
  { bg: "bg-teal-500/10", border: "border-teal-500/20", text: "text-teal-700 dark:text-teal-400", x: "text-teal-700/50 hover:text-teal-700 dark:text-teal-400/50 dark:hover:text-teal-400" },
  // violet
  { bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-700 dark:text-violet-400", x: "text-violet-700/50 hover:text-violet-700 dark:text-violet-400/50 dark:hover:text-violet-400" },
  // rose
  { bg: "bg-rose-500/10", border: "border-rose-500/20", text: "text-rose-700 dark:text-rose-400", x: "text-rose-700/50 hover:text-rose-700 dark:text-rose-400/50 dark:hover:text-rose-400" },
  // amber
  { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-700 dark:text-amber-400", x: "text-amber-700/50 hover:text-amber-700 dark:text-amber-400/50 dark:hover:text-amber-400" },
  // emerald
  { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-700 dark:text-emerald-400", x: "text-emerald-700/50 hover:text-emerald-700 dark:text-emerald-400/50 dark:hover:text-emerald-400" },
];

export function TagInput({
  value,
  onChange,
  placeholder = "Type a keyword and press Enter…",
  error,
}: TagInputProps) {
  const [input, setInput] = useState("");

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
          "flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-lg border bg-[var(--color-surface-alt)] px-3 py-2 transition-colors",
          error
            ? "border-[var(--color-danger)]/50 focus-within:border-[var(--color-danger)]/80"
            : "border-[var(--color-separator)] focus-within:border-[var(--color-brand-bright)]/30",
        )}
      >
        {value.map((tag, idx) => {
          const palette = TAG_PALETTE[idx % TAG_PALETTE.length];
          return (
            <span
              key={tag}
              className={cn(
                "flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                palette.bg,
                palette.border,
                palette.text,
              )}
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove keyword ${tag}`}
                className={cn("ml-0.5 transition-colors", palette.x)}
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
          className="min-w-[140px] flex-1 bg-transparent text-sm text-[var(--color-text)] placeholder-[var(--color-placeholder)] outline-none focus:outline-none"
        />
      </div>

      {error && (
        <p role="alert" className="text-xs text-[var(--color-danger)]">
          {error}
        </p>
      )}
    </div>
  );
}
