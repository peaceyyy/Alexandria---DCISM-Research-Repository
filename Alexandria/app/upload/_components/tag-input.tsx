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

// Distinct palette — all fit the dark Alexandria color scheme
const TAG_PALETTE = [
  // blue
  { bg: "bg-[#1752F0]/12", border: "border-[#1752F0]/25", text: "text-[#368BFE]", x: "text-[#368BFE]/50 hover:text-[#368BFE]" },
  // teal
  { bg: "bg-[#0e7490]/12", border: "border-[#0e7490]/30", text: "text-[#22d3ee]", x: "text-[#22d3ee]/50 hover:text-[#22d3ee]" },
  // violet
  { bg: "bg-[#6d28d9]/12", border: "border-[#6d28d9]/30", text: "text-[#a78bfa]", x: "text-[#a78bfa]/50 hover:text-[#a78bfa]" },
  // rose
  { bg: "bg-[#be123c]/12", border: "border-[#be123c]/30", text: "text-[#fb7185]", x: "text-[#fb7185]/50 hover:text-[#fb7185]" },
  // amber
  { bg: "bg-[#b45309]/12", border: "border-[#b45309]/30", text: "text-[#fbbf24]", x: "text-[#fbbf24]/50 hover:text-[#fbbf24]" },
  // emerald
  { bg: "bg-[#065f46]/12", border: "border-[#065f46]/30", text: "text-[#34d399]", x: "text-[#34d399]/50 hover:text-[#34d399]" },
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
          "flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-lg border bg-[#0D1117] px-3 py-2 transition-colors",
          error
            ? "border-[#ff6b6b]/50 focus-within:border-[#ff6b6b]/80"
            : "border-white/8 focus-within:border-[#368BFE]/60",
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
          className="min-w-[140px] flex-1 bg-transparent text-sm text-white placeholder-white/20 outline-none focus:outline-none"
        />
      </div>

      {error && (
        <p role="alert" className="text-xs text-[#ff6b6b]">
          {error}
        </p>
      )}
    </div>
  );
}
