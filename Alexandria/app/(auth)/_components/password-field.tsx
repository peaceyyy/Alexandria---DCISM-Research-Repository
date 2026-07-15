"use client";

import { Eye, EyeOff } from "lucide-react";
import type { ComponentProps } from "react";
import { useState } from "react";

type PasswordFieldProps = Omit<ComponentProps<"input">, "type"> & {
  label: string;
  error?: string;
};

export function PasswordField({
  label,
  error,
  id,
  ...inputProps
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
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
          type={visible ? "text" : "password"}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className="h-[60px] w-full rounded-md border border-[#368bfe] bg-[var(--color-bg)] px-6 pr-14 text-base text-[var(--color-text)] placeholder:text-[var(--color-placeholder)] focus:ring-2 focus:ring-[#368bfe] focus:outline-none transition-shadow"
          {...inputProps}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`}
          className="absolute top-1/2 right-2 grid size-11 -translate-y-1/2 place-items-center text-[var(--color-placeholder)]"
        >
          {visible ? (
            <EyeOff aria-hidden size={26} />
          ) : (
            <Eye aria-hidden size={26} />
          )}
        </button>
      </div>
      {error ? (
        <p id={errorId} className="mt-1 px-2 text-sm text-[var(--color-danger)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
