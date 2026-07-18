"use client";

import { X, Plus, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Person {
  user_id: string | null;
  display_name: string;
  contribution_role: "author" | "adviser";
  sort_order: number;
}

const MAX_ADVISERS = 2;

// ─── Single person row ────────────────────────────────────────────────────────

function PersonRow({
  person,
  onChangeName,
  onRemove,
  canRemove,
  error,
}: {
  person: Person;
  onChangeName: (name: string) => void;
  onRemove: () => void;
  canRemove: boolean;
  error?: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="flex-1 space-y-1">
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg border bg-[var(--color-surface-alt)] px-3 outline-none transition-colors",
            error
              ? "border-[var(--color-danger)]/50 focus-within:border-[var(--color-danger)]/80"
              : "border-[var(--color-separator)] focus-within:border-[var(--color-brand-bright)]/40",
          )}
        >
          <UserCircle size={13} className="flex-shrink-0 text-[var(--color-text-muted)] opacity-50" aria-hidden />
          <input
            type="text"
            aria-label="Person's full name"
            value={person.display_name}
            onChange={(e) => onChangeName(e.target.value)}
            placeholder="Full name (e.g. Juan A. Dela Cruz)"
            className="h-[40px] flex-1 bg-transparent text-sm text-[var(--color-text)] placeholder-[var(--color-placeholder)] outline-none"
          />
        </div>
        {error && (
          <p role="alert" className="text-xs text-[var(--color-danger)]">
            {error}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onRemove}
        disabled={!canRemove}
        aria-label="Remove person"
        className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-[var(--color-separator)] text-[var(--color-text-muted)] transition-all hover:border-[var(--color-danger)] hover:text-[var(--color-danger)] disabled:cursor-not-allowed disabled:opacity-25"
      >
        <X size={13} aria-hidden />
      </button>
    </div>
  );
}

// ─── People builder ────────────────────────────────────────────────────────────

interface PeopleBuilderProps {
  value: Person[];
  onChange: (people: Person[]) => void;
  errors?: Record<number, string>;
}

export function PeopleBuilder({ value, onChange, errors = {} }: PeopleBuilderProps) {
  const authors = value.filter((p) => p.contribution_role === "author");
  const advisers = value.filter((p) => p.contribution_role === "adviser");

  /** Get the index in the global `value` array for the n-th person of a given role. */
  function globalIndex(role: Person["contribution_role"], roleIndex: number): number {
    let count = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i].contribution_role === role) {
        if (count === roleIndex) return i;
        count++;
      }
    }
    return -1;
  }

  function updateName(gIdx: number, name: string) {
    const next = [...value];
    next[gIdx] = { ...next[gIdx], display_name: name };
    onChange(next);
  }

  function removePerson(gIdx: number) {
    const next = value.filter((_, i) => i !== gIdx);
    // Recalculate sort_order per role
    let authOrder = 1;
    let advOrder = 1;
    onChange(
      next.map((p) => ({
        ...p,
        sort_order:
          p.contribution_role === "author" ? authOrder++ : advOrder++,
      })),
    );
  }

  function addPerson(role: Person["contribution_role"]) {
    const sameRole = value.filter((p) => p.contribution_role === role);
    onChange([
      ...value,
      {
        user_id: null,
        display_name: "",
        contribution_role: role,
        sort_order: sameRole.length + 1,
      },
    ]);
  }

  return (
    <div className="space-y-6">
      {/* ── Authors ─────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
              Authors
            </p>
            <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)] opacity-50">
              Ordered list · first entry = primary author
            </p>
          </div>
          <button
            type="button"
            onClick={() => addPerson("author")}
            className="flex items-center gap-1.5 rounded-md border border-[var(--color-separator)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] transition-all hover:border-[var(--color-separator-mid)] hover:text-[var(--color-text)]"
          >
            <Plus size={11} aria-hidden />
            Add Author
          </button>
        </div>

        <div className="space-y-2">
          {authors.map((author, roleIdx) => {
            const gIdx = globalIndex("author", roleIdx);
            return (
              <PersonRow
                key={gIdx}
                person={author}
                onChangeName={(name) => updateName(gIdx, name)}
                onRemove={() => removePerson(gIdx)}
                canRemove={authors.length > 1}
                error={errors[gIdx]}
              />
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[var(--color-separator)]" />

      {/* ── Advisers ─────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
              Advisers
            </p>
            <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)] opacity-50">
              Include title if applicable (e.g. Dr., PhD)
            </p>
          </div>
          <button
            type="button"
            onClick={() => addPerson("adviser")}
            disabled={advisers.length >= MAX_ADVISERS}
            className="flex items-center gap-1.5 rounded-md border border-[var(--color-separator)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] transition-all hover:border-[var(--color-separator-mid)] hover:text-[var(--color-text)] disabled:cursor-not-allowed disabled:opacity-25"
          >
            <Plus size={11} aria-hidden />
            Add Adviser
          </button>
        </div>

        <div className="space-y-2">
          {advisers.length === 0 ? (
            <p className="text-xs italic text-[var(--color-text-muted)] opacity-50">No adviser added yet.</p>
          ) : (
            advisers.map((adviser, roleIdx) => {
              const gIdx = globalIndex("adviser", roleIdx);
              return (
                <PersonRow
                  key={gIdx}
                  person={adviser}
                  onChangeName={(name) => updateName(gIdx, name)}
                  onRemove={() => removePerson(gIdx)}
                  canRemove={true}
                  error={errors[gIdx]}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
