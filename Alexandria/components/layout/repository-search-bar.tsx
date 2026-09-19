"use client";

import { Search, X } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useResultUpdate } from "@/components/layout/result-update-context";

export function RepositorySearchBar({
  initialQuery = "",
  placeholder = "Search by title, abstract, or author…",
}: {
  initialQuery?: string;
  placeholder?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const { isPending, navigate } = useResultUpdate();

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }
    params.delete("page");
    navigate(`${pathname}?${params.toString()}`);
  };

  const clearSearch = () => {
    if (isPending) return;
    setQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.delete("page");
    const nextQuery = params.toString();
    navigate(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-2 rounded-lg border border-[var(--color-separator)] bg-[var(--color-surface)] px-3 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)] focus-within:border-[var(--color-brand)] focus-within:ring-1 focus-within:ring-[var(--color-brand)]">
      <Search size={18} className="text-[var(--color-text-muted)]" aria-hidden />
      <input
        type="search"
        name="q"
        aria-label="Search research"
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent px-2 py-1 text-[15px] text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]"
      />
      {query && (
        <button
          type="button"
          onClick={clearSearch}
          disabled={isPending}
          aria-label="Clear search"
          title="Clear search"
          className="grid size-7 shrink-0 cursor-pointer place-items-center rounded text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-text)]/[0.06] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/40 disabled:pointer-events-none disabled:opacity-50"
        >
          <X size={14} aria-hidden />
        </button>
      )}
      {/* Screen-reader-only announcement; the result-region overlay is the visible signal */}
      <span aria-live="polite" className="sr-only">
        {isPending ? "Searching…" : ""}
      </span>
    </form>
  );
}
