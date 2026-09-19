"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Popover } from "@base-ui/react/popover";
import { Check, ChevronDown, SlidersHorizontal } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { ACADEMIC_UNITS, type Department } from "@/lib/domain/departments";
import { RESEARCH_AREAS } from "@/lib/domain/research-areas";
import { TagMultiSelect } from "@/components/layout/tag-multi-select";
import { cn } from "@/lib/utils";
import { useResultUpdate } from "@/components/layout/result-update-context";

const PROGRAM_LABELS: Record<Department, string> = {
  CS: "Computer Science",
  IT: "Information Technology",
  IS: "Information Systems",
};

type FilterBarProps = { className?: string };

function FacetPopover({ label, count = 0, disabled = false, children }: { label: string; count?: number; disabled?: boolean; children: ReactNode }) {
  return (
    <Popover.Root>
      <Popover.Trigger
        disabled={disabled}
        className="relative inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-[var(--color-separator)] bg-[var(--color-surface)] px-3 text-[13px] font-medium text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-separator-mid)] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/40 sm:min-h-9 disabled:pointer-events-none disabled:opacity-50">
        <span>{label}</span>
        {count > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--color-brand)] px-1 text-[9px] font-bold text-white shadow-sm ring-2 ring-[var(--color-surface)]">
            {count}
          </span>
        )}
        <ChevronDown size={14} aria-hidden />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8} collisionAvoidance={{ side: "flip", align: "shift", fallbackAxisSide: "none" }}>
          <Popover.Popup className="z-[60] w-[min(20rem,calc(100vw-2rem))] rounded-md border border-[var(--color-separator-mid)] bg-[var(--color-surface)] p-2 text-[var(--color-text)] shadow-lg outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95">
            {children}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

function CheckboxOption({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded px-2 text-[13px] text-[var(--color-text-muted)] hover:bg-[var(--color-text)]/[0.05] hover:text-[var(--color-text)] sm:min-h-9">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span className={cn("grid size-4 place-items-center rounded border border-[var(--color-separator-mid)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-brand)]/40", checked && "border-[var(--color-brand)] bg-[var(--color-brand)] text-white")} aria-hidden>
        {checked && <Check size={11} strokeWidth={3} />}
      </span>
      {label}
    </label>
  );
}

function YearRangeFilter({ from, to, setValue }: { from: string; to: string; setValue: (key: "from" | "to", value: string) => void }) {
  const [draftFrom, setDraftFrom] = useState(from);
  const [draftTo, setDraftTo] = useState(to);
  const [error, setError] = useState("");
  useEffect(() => { setDraftFrom(from); setDraftTo(to); }, [from, to]);

  const validate = (nextFrom: string, nextTo: string) => {
    const maximumYear = new Date().getFullYear() + 1;
    const isValidYear = (value: string) => value === "" || (/^\d{4}$/.test(value) && Number(value) >= 1900 && Number(value) <= maximumYear);
    if (!isValidYear(nextFrom) || !isValidYear(nextTo)) return `Use a four-digit year from 1900 to ${maximumYear}.`;
    if (nextFrom && nextTo && Number(nextFrom) > Number(nextTo)) return "From year must be before or the same as To year.";
    return "";
  };

  const commit = (key: "from" | "to", value: string) => {
    const nextFrom = key === "from" ? value.trim() : draftFrom.trim();
    const nextTo = key === "to" ? value.trim() : draftTo.trim();
    const nextError = validate(nextFrom, nextTo);
    setError(nextError);
    if (!nextError) setValue(key, value.trim());
  };
  return (
    <div className="p-1">
      <div className="grid grid-cols-2 gap-2">
      <label className="grid gap-1 px-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
        From
        <input type="number" name="from" value={draftFrom} inputMode="numeric" placeholder="Year" aria-invalid={Boolean(error)} aria-describedby={error ? "year-range-error" : undefined} onChange={(event) => { setDraftFrom(event.target.value); setError(""); }} onBlur={() => commit("from", draftFrom)} onKeyDown={(event) => event.key === "Enter" && commit("from", draftFrom)} className="min-h-11 w-full min-w-0 rounded border border-[var(--color-separator)] bg-transparent px-2 text-[13px] text-[var(--color-text)] outline-none focus-visible:border-[var(--color-brand)] focus-visible:ring-1 focus-visible:ring-[var(--color-brand)]/40 sm:min-h-9" />
      </label>
      <label className="grid gap-1 px-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
        To
        <input type="number" name="to" value={draftTo} inputMode="numeric" placeholder="Year" aria-invalid={Boolean(error)} aria-describedby={error ? "year-range-error" : undefined} onChange={(event) => { setDraftTo(event.target.value); setError(""); }} onBlur={() => commit("to", draftTo)} onKeyDown={(event) => event.key === "Enter" && commit("to", draftTo)} className="min-h-11 w-full min-w-0 rounded border border-[var(--color-separator)] bg-transparent px-2 text-[13px] text-[var(--color-text)] outline-none focus-visible:border-[var(--color-brand)] focus-visible:ring-1 focus-visible:ring-[var(--color-brand)]/40 sm:min-h-9" />
      </label>
      </div>
      {error && <p id="year-range-error" role="alert" className="mt-2 px-1 text-[12px] leading-4 text-[var(--color-danger)]">{error}</p>}
    </div>
  );
}

/** URL-backed public discovery facets. The same controls work in the desktop bar and mobile sheet. */
export function FilterBar({ className }: FilterBarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isPending, navigate } = useResultUpdate();
  const departments = searchParams.getAll("department");
  const areas = searchParams.getAll("area");
  const types = searchParams.getAll("type");
  const tags = searchParams.getAll("tag");
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  const filterCount = departments.length + areas.length + types.length + tags.length + Number(Boolean(from)) + Number(Boolean(to));

  const update = (key: string, values: string[] | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    if (Array.isArray(values)) values.forEach((value) => params.append(key, value));
    else if (values) params.set(key, values);
    params.delete("page");
    navigate(`${pathname}?${params.toString()}`);
  };

  const toggle = (key: string, value: string, selected: string[]) =>
    update(key, selected.includes(value) ? selected.filter((entry) => entry !== value) : [...selected, value]);

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    ["department", "area", "type", "tag", "from", "to", "page"].forEach((key) => params.delete(key));
    navigate(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)} aria-label="Search filters">
      <span className="mr-1 inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-[var(--color-text-muted)]"><SlidersHorizontal size={14} aria-hidden /> Filters</span>
      <FacetPopover label="Research area" count={areas.length} disabled={isPending}>
        <div className="max-h-72 overflow-y-auto py-1">
          {RESEARCH_AREAS.map((area) => <CheckboxOption key={area.id} label={area.label} checked={areas.includes(area.id)} onChange={() => toggle("area", area.id, areas)} />)}
        </div>
      </FacetPopover>
      <FacetPopover label="Program" count={departments.length} disabled={isPending}>
        <div className="py-1">
          {ACADEMIC_UNITS[0].programs.map((program) => <CheckboxOption key={program} label={PROGRAM_LABELS[program]} checked={departments.includes(program)} onChange={() => toggle("department", program, departments)} />)}
        </div>
      </FacetPopover>
      <FacetPopover label="Study type" count={types.length} disabled={isPending}>
        <div className="py-1">
          <CheckboxOption label="Thesis" checked={types.includes("thesis")} onChange={() => toggle("type", "thesis", types)} />
          <CheckboxOption label="Capstone" checked={types.includes("capstone")} onChange={() => toggle("type", "capstone", types)} />
        </div>
      </FacetPopover>
      <FacetPopover label="Year" count={Number(Boolean(from)) + Number(Boolean(to))} disabled={isPending}>
        <YearRangeFilter from={from} to={to} setValue={update} />
      </FacetPopover>
      <FacetPopover label="Tags" count={tags.length} disabled={isPending}>
        <div className="p-1">
          <TagMultiSelect
            selectedTags={tags}
            onAddTag={(tag) => update("tag", [...tags, tag])}
            onRemoveTag={(tag) => update("tag", tags.filter((selectedTag) => selectedTag !== tag))}
          />
        </div>
      </FacetPopover>
      {filterCount > 0 && (
        <button
          type="button"
          onClick={clearAll}
          disabled={isPending}
          className="min-h-11 cursor-pointer px-1 text-[12px] font-semibold text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/40 sm:min-h-9 disabled:pointer-events-none disabled:opacity-50"
        >
          Clear all
        </button>
      )}
      {/* Screen-reader-only announcement; the result-region overlay is the visible signal */}
      <span aria-live="polite" className="sr-only">{isPending ? "Updating results…" : ""}</span>
    </div>
  );
}
