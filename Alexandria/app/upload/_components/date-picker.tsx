"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface DatePickerProps {
  value: string; // "YYYY-MM-DD" or ""
  onChange: (value: string) => void;
  max?: string; // "YYYY-MM-DD" — hard ceiling (today)
  error?: boolean;
}

function parseMax(max?: string) {
  if (!max) return null;
  const [y, m, d] = max.split("-").map(Number);
  return { year: y, month: m - 1, day: d }; // month 0-indexed
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function DatePicker({ value, onChange, max, error }: DatePickerProps) {
  const maxParsed = parseMax(max);
  const minYear = 1990;
  const maxYear = maxParsed?.year ?? new Date().getFullYear();

  // Parse current value
  const [selYear, selMonth, selDay] = useMemo(() => {
    if (!value) return [maxYear, maxParsed?.month ?? new Date().getMonth(), 0];
    const [y, m, d] = value.split("-").map(Number);
    return [y, m - 1, d]; // month 0-indexed
  }, [value, maxYear, maxParsed?.month]);

  const yearOptions = useMemo(
    () => Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i),
    [maxYear],
  );

  // Available months — clamp if on maxYear
  const monthOptions = useMemo(() => {
    const ceiling = maxParsed && selYear === maxParsed.year ? maxParsed.month : 11;
    return MONTHS.slice(0, ceiling + 1).map((name, idx) => ({ name, idx }));
  }, [selYear, maxParsed]);

  // Available days — clamp if on max month/year
  const dayOptions = useMemo(() => {
    const maxDay =
      maxParsed && selYear === maxParsed.year && selMonth === maxParsed.month
        ? maxParsed.day
        : daysInMonth(selYear, selMonth);
    return Array.from({ length: maxDay }, (_, i) => i + 1);
  }, [selYear, selMonth, maxParsed]);

  function emit(y: number, m: number, d: number) {
    if (!d) return;
    const mm = String(m + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    onChange(`${y}-${mm}-${dd}`);
  }

  function handleYear(e: React.ChangeEvent<HTMLSelectElement>) {
    const y = Number(e.target.value);
    // Clamp month if necessary
    const monthCeiling =
      maxParsed && y === maxParsed.year ? maxParsed.month : 11;
    const safeMonth = Math.min(selMonth, monthCeiling);
    // Clamp day
    const dayCeiling =
      maxParsed && y === maxParsed.year && safeMonth === maxParsed.month
        ? maxParsed.day
        : daysInMonth(y, safeMonth);
    const safeDay = Math.min(selDay || 1, dayCeiling);
    emit(y, safeMonth, safeDay);
  }

  function handleMonth(e: React.ChangeEvent<HTMLSelectElement>) {
    const m = Number(e.target.value);
    // Clamp day
    const dayCeiling =
      maxParsed && selYear === maxParsed.year && m === maxParsed.month
        ? maxParsed.day
        : daysInMonth(selYear, m);
    const safeDay = Math.min(selDay || 1, dayCeiling);
    emit(selYear, m, safeDay);
  }

  function handleDay(e: React.ChangeEvent<HTMLSelectElement>) {
    emit(selYear, selMonth, Number(e.target.value));
  }

  const cls = cn(
    "h-[42px] w-full appearance-none rounded-lg border bg-[#0D1117] pl-3 pr-7 text-sm text-white outline-none transition-colors",
    error
      ? "border-[#ff6b6b]/50 focus:border-[#ff6b6b]/80"
      : "border-white/8 focus:border-[#368BFE]/60",
  );

  return (
    <div className="flex items-center gap-2">
      {/* Month */}
      <div className="relative flex-[2]">
        <select value={selMonth} onChange={handleMonth} className={cls} aria-label="Month">
          {monthOptions.map(({ name, idx }) => (
            <option key={idx} value={idx} className="bg-[#1C2026]">{name}</option>
          ))}
        </select>
        <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/25" aria-hidden />
      </div>

      {/* Day */}
      <div className="relative flex-1">
        <select value={selDay || ""} onChange={handleDay} className={cls} aria-label="Day">
          <option value="" disabled className="bg-[#1C2026]">DD</option>
          {dayOptions.map((d) => (
            <option key={d} value={d} className="bg-[#1C2026]">{d}</option>
          ))}
        </select>
        <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/25" aria-hidden />
      </div>

      {/* Year */}
      <div className="relative flex-[1.5]">
        <select value={selYear} onChange={handleYear} className={cls} aria-label="Year">
          {yearOptions.map((y) => (
            <option key={y} value={y} className="bg-[#1C2026]">{y}</option>
          ))}
        </select>
        <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/25" aria-hidden />
      </div>
    </div>
  );
}
