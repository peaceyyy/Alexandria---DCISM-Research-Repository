import Link from "next/link";
import type { UserRole } from "@/lib/auth/auth-contract";
import { getRoleDisplay } from "@/lib/auth/role-display";

export function RoleIndicator({ role }: { role?: UserRole | null }) {
  const display = getRoleDisplay(role);

  const destination = role ? "/profile" : "/login";

  return (
    <Link
      href={destination}
      aria-label={`Current access role: ${display.label}`}
      title={`Current access role: ${display.label}`}
      className={`inline-flex min-h-9 items-center gap-2 rounded-full border px-2.5 pr-3 text-xs font-semibold transition-colors hover:brightness-125 ${display.className}`}
    >
      <span
        aria-hidden="true"
        className="grid h-6 min-w-6 place-items-center rounded-full bg-black/20 px-1 text-[10px] font-black"
      >
        {display.abbreviation}
      </span>
      <span>{display.label}</span>
    </Link>
  );
}
