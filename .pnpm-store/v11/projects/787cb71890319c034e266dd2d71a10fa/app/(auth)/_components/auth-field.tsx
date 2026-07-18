import type { ComponentProps, ReactNode } from "react";

type AuthFieldProps = ComponentProps<"input"> & {
  label: string;
  icon: ReactNode;
  error?: string;
};

export function AuthField({
  label,
  icon,
  error,
  id,
  ...inputProps
}: AuthFieldProps) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-[var(--color-text)]"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className="h-[60px] w-full rounded-md border border-[#368bfe] bg-[var(--color-bg)] px-6 pr-14 text-base text-[var(--color-text)] placeholder:text-[var(--color-placeholder)] focus:ring-2 focus:ring-[#368bfe] focus:outline-none transition-shadow"
          {...inputProps}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 text-[var(--color-placeholder)]"
        >
          {icon}
        </span>
      </div>
      {error ? (
        <p id={errorId} className="mt-1 px-2 text-sm text-[var(--color-danger)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
