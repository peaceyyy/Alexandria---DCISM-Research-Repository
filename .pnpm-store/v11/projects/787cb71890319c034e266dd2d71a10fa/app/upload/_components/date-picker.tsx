"use client";

import { useMemo, useState } from "react";
import { Popover } from "@base-ui/react/popover";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: string; // "YYYY-MM-DD" or ""
  onChange: (value: string) => void;
  max?: string; // "YYYY-MM-DD" — hard ceiling (today)
  error?: boolean;
}

const MIN_YEAR = 1990;

function parseISODate(value?: string) {
  if (!value) return undefined;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined;
  }

  return date;
}

function toISODate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
}

function formatDate(date?: Date) {
  if (!date) return "Select date";

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function DatePicker({ value, onChange, max, error }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selectedDate = useMemo(() => parseISODate(value), [value]);
  const maxDate = useMemo(() => parseISODate(max) ?? new Date(), [max]);
  const minDate = useMemo(() => new Date(MIN_YEAR, 0, 1), []);
  const displayDate = formatDate(selectedDate);

  function handleSelect(date: Date | undefined) {
    if (!date) return;

    onChange(toISODate(date));
    setOpen(false);
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        aria-label={`Select publication date${selectedDate ? `: ${displayDate}` : ""}`}
        className={cn(
          "flex h-[42px] w-full items-center gap-2 rounded-md border bg-[var(--color-surface)] px-3 text-left text-sm transition-colors",
          error
            ? "border-[var(--color-danger)]/50 text-[var(--color-text)] focus-visible:border-[var(--color-danger)]/80"
            : "border-[var(--color-separator)] text-[var(--color-text)] hover:border-[var(--color-separator-mid)] focus-visible:border-[var(--color-brand-bright)]/70",
        )}
      >
        <CalendarIcon className="size-4 shrink-0 text-[var(--color-brand-bright)]" aria-hidden />
        <span className={cn("flex-1", !selectedDate && "text-[var(--color-placeholder)]")}>
          {displayDate}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-[var(--color-text-muted)] transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner
          align="end"
          side="bottom"
          sideOffset={8}
          collisionPadding={{ top: 16, right: 16, bottom: 80, left: 16 }}
          collisionAvoidance={{
            side: "flip",
            align: "shift",
            fallbackAxisSide: "top",
          }}
        >
          <Popover.Popup
            aria-label="Publication date"
            className="z-50 rounded-md border border-[var(--color-separator)] bg-[var(--color-surface)] p-2 text-[var(--color-text)] shadow-lg outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
            role="dialog"
          >
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              defaultMonth={selectedDate ?? maxDate}
              startMonth={minDate}
              endMonth={new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)}
              disabled={[{ before: minDate }, { after: maxDate }]}
              captionLayout="dropdown"
              navLayout="after"
              showOutsideDays={false}
              autoFocus
              className="bg-transparent p-1"
              classNames={{
                button_next: "text-[var(--color-text-muted)] hover:bg-[var(--color-separator)] hover:text-[var(--color-text)]",
                button_previous: "text-[var(--color-text-muted)] hover:bg-[var(--color-separator)] hover:text-[var(--color-text)]",
                caption_label: "text-[var(--color-text)]",
                day_button:
                  "text-[var(--color-text)] hover:bg-[var(--color-separator)] hover:text-[var(--color-text)] data-[selected-single=true]:bg-[var(--color-brand)] data-[selected-single=true]:text-white",
                disabled: "text-[var(--color-text-muted)] opacity-50",
                weekday: "text-[var(--color-text-muted)]",
              }}
            />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
