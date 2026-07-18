"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

/** Container for a single wizard step's content. */
export function StepWrapper({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[540px] space-y-7 px-4 sm:px-0">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-[var(--color-text)]">{title}</h2>
        {description && (
          <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{description}</p>
        )}
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

/** A labelled form field wrapper with optional hint text. */
export function Field({
  label,
  required,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
        {label}
        {required && <span className="text-[var(--color-brand-bright)]" aria-hidden>*</span>}
      </label>
      {hint && (
        <p className="text-xs text-[var(--color-text-muted)] opacity-70 leading-relaxed">{hint}</p>
      )}
      {children}
    </div>
  );
}

/** Inline validation error message. */
export function FieldError({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="text-xs text-[var(--color-danger)]">
      {children}
    </p>
  );
}

/** Base CSS class string for text inputs and textareas. */
export function inputClass(hasError?: boolean) {
  return cn(
    "h-[42px] w-full rounded-lg border bg-[var(--color-surface-alt)] px-3 text-sm text-[var(--color-text)] placeholder-[var(--color-placeholder)] outline-none transition-colors",
    hasError
      ? "border-[var(--color-danger)]/50 focus:border-[var(--color-danger)]/80"
      : "border-[var(--color-separator)] focus:border-[var(--color-brand-bright)]/40",
  );
}

/** Native <select> wrapped with a custom chevron. */
export function SelectInput({
  hasError,
  children,
  ...props
}: React.ComponentProps<"select"> & { hasError?: boolean }) {
  return (
    <div className="relative">
      <select
        {...props}
        className={cn(
          inputClass(hasError),
          "appearance-none cursor-pointer pr-9",
          "[&>option]:bg-[var(--color-surface)] [&>option]:text-[var(--color-text)]",
        )}
      >
        {children}
      </select>
      <ChevronDown
        size={13}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
        aria-hidden
      />
    </div>
  );
}
