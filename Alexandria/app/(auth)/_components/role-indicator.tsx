import Link from "next/link";
import type { UserRole } from "@/lib/auth/auth-contract";
import { getPostAuthDestination } from "@/lib/auth/auth-routing";
import { getRoleDisplay } from "@/lib/auth/role-display";

export function RoleIndicator({ role }: { role?: UserRole | null }) {
  const display = getRoleDisplay(role);
  const isPrivileged = role === "admin" || role === "moderator";

  return (
    <div className="flex items-center gap-2">
      {/* Role pill → links to profile */}
      <Link
        href={role ? "/profile" : "/login"}
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

      {/* Dashboard shortcut — only for admin and moderator */}
      {isPrivileged && (
        <Link
          href={getPostAuthDestination(role)}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[#368bfe]/40 bg-[#368bfe]/10 px-3 text-xs font-semibold text-[#368bfe] transition-colors hover:bg-[#368bfe]/20"
          aria-label="Go to your dashboard"
        >
          Dashboard →
        </Link>
      )}
    </div>
  );
}
