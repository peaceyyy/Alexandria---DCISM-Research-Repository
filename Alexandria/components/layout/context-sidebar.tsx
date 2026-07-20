import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard, LibraryBig, LogOut, UserRound } from "lucide-react";
import type { UserRole } from "@/lib/auth/auth-contract";
import { getPostAuthDestination } from "@/lib/auth/auth-routing";
import { logoutAction } from "@/lib/auth/actions";
import { getRoleDisplay } from "@/lib/auth/role-display";
import { ThemeToggle } from "@/components/layout/theme-toggle";

type ContextSidebarProps = {
  role: UserRole | null;
  profileName?: string | null;
  active: "detail" | "profile";
  returnHref?: string;
  returnLabel?: string;
};

/**
 * Navigation for contextual public-app pages. Unlike RepositorySidebar, this
 * deliberately contains no search or filters: readers should not be asked to
 * operate browse controls while they are reading one thesis or managing an account.
 */
export function ContextSidebar({
  role,
  profileName,
  active,
  returnHref,
  returnLabel = "Back to results",
}: ContextSidebarProps) {
  const display = getRoleDisplay(role);
  const isStaff = role === "admin" || role === "moderator";
  const accountName = profileName?.trim() || display.label;

  return (
    <aside
      className="hidden h-full flex-col border-r border-[var(--color-separator)] bg-[var(--color-surface-alt)] px-3 py-4 xl:flex"
      aria-label="Alexandria navigation"
    >
      <Link
        href="/home"
        className="inline-flex min-h-9 items-center gap-2.5 px-1 text-[var(--color-text)] no-underline"
        aria-label="Alexandria repository home"
      >
        <Image
          src="/brand/alexandria-mark.svg"
          width={28}
          height={28}
          alt=""
          className="theme-invert"
        />
        <span className="font-[var(--font-khula)] text-[15px] font-extrabold tracking-tight">
          ALEXANDRIA
        </span>
      </Link>

      <nav className="mt-5 grid gap-1 border-b border-[var(--color-separator)] pb-4" aria-label="Context navigation">
        {returnHref ? (
          <Link
            href={returnHref}
            className="inline-flex min-h-9 items-center gap-2 rounded-md px-2 text-sm font-semibold text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-text)]/[0.06] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-bright)]/30"
          >
            <ArrowLeft size={15} aria-hidden />
            {returnLabel}
          </Link>
        ) : null}
        <Link
          href="/home"
          className="inline-flex min-h-9 items-center gap-2 rounded-md px-2 text-sm font-semibold text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-text)]/[0.06] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-bright)]/30"
        >
          <LibraryBig size={15} aria-hidden />
          Browse repository
        </Link>
        <Link
          href={role ? "/profile" : "/login"}
          aria-current={active === "profile" ? "page" : undefined}
          className={`inline-flex min-h-9 items-center gap-2 rounded-md px-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-bright)]/30 ${
            active === "profile"
              ? "bg-[var(--color-text)]/[0.08] text-[var(--color-text)]"
              : "text-[var(--color-text-muted)] hover:bg-[var(--color-text)]/[0.06] hover:text-[var(--color-text)]"
          }`}
        >
          <UserRound size={15} aria-hidden />
          {role ? "Account" : "Sign in"}
        </Link>
      </nav>

      <div className="mt-auto border-t border-[var(--color-separator)] pt-3">
        {isStaff ? (
          <Link
            href={getPostAuthDestination(role)}
            className="mb-2 inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-brand-bright)]/30 bg-[var(--color-brand-bright)]/10 px-3 text-sm font-semibold text-[var(--color-brand-bright)] transition-colors hover:bg-[var(--color-brand-bright)]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-bright)]/30"
          >
            <LayoutDashboard size={15} aria-hidden />
            Dashboard
          </Link>
        ) : null}

        <div className="mb-2 grid grid-cols-[1fr_auto] items-center gap-2">
          <span className="px-1 text-xs font-medium text-[var(--color-text-muted)]">Theme</span>
          <ThemeToggle />
        </div>

        {role ? (
          <div className={`flex min-w-0 items-center overflow-hidden rounded-lg border ${display.className}`}>
            <Link
              href="/profile"
              className="flex min-w-0 flex-1 items-center gap-2 px-2 py-1.5 text-xs font-semibold"
              title={accountName}
            >
              <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-full bg-black/15 px-1 text-[10px] font-black">
                {display.abbreviation}
              </span>
              <span className="truncate">{accountName}</span>
            </Link>
            <form action={logoutAction} className="flex shrink-0 border-l border-current/20">
              <button
                type="submit"
                className="inline-flex size-9 items-center justify-center opacity-70 transition hover:bg-black/10 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-bright)]/30"
                aria-label="Log out"
                title="Log out"
              >
                <LogOut size={15} aria-hidden />
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </aside>
  );
}

/** Mobile equivalent of ContextSidebar. The full rail is intentionally desktop-only. */
export function ContextHeader({
  role,
  active,
  returnHref,
  returnLabel = "Back",
}: Omit<ContextSidebarProps, "profileName">) {
  const isStaff = role === "admin" || role === "moderator";

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-[var(--color-separator)] bg-[var(--color-bg)]/95 px-4 backdrop-blur-md xl:hidden">
      <Link href="/home" className="shrink-0" aria-label="Alexandria repository home">
        <Image src="/brand/alexandria-mark.svg" width={26} height={26} alt="" className="theme-invert" />
      </Link>
      {returnHref ? (
        <Link
          href={returnHref}
          className="inline-flex min-w-0 flex-1 items-center gap-1.5 text-sm font-semibold text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
        >
          <ArrowLeft size={15} aria-hidden />
          <span className="truncate">{returnLabel}</span>
        </Link>
      ) : (
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[var(--color-text)]">
          {active === "profile" ? "Account" : "Thesis details"}
        </span>
      )}
      {isStaff ? (
        <Link
          href={getPostAuthDestination(role)}
          className="inline-flex size-8 items-center justify-center rounded-full border border-[var(--color-brand-bright)]/30 text-[var(--color-brand-bright)]"
          aria-label="Open dashboard"
          title="Dashboard"
        >
          <LayoutDashboard size={15} aria-hidden />
        </Link>
      ) : null}
      <Link
        href={role ? "/profile" : "/login"}
        className="inline-flex size-8 items-center justify-center rounded-full border border-[var(--color-separator-mid)] text-[var(--color-text-muted)]"
        aria-label={role ? "Open account" : "Sign in"}
      >
        <UserRound size={15} aria-hidden />
      </Link>
      <ThemeToggle />
    </header>
  );
}
