import { Camera } from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";
import {
  formatMemberSince,
  getAccessLevels,
  getAffiliationLabel,
} from "@/lib/auth/profile-display";
import { getRoleDisplay } from "@/lib/auth/role-display";
import type { CurrentUser } from "@/lib/services/types";
import { ContextSidebar } from "@/components/layout/context-sidebar";
import { BackLink } from "@/components/ui/back-link";

export function ProfilePage({
  user,
  logoutError = false,
  isStaffWorkspace = false,
}: {
  user: CurrentUser;
  logoutError?: boolean;
  isStaffWorkspace?: boolean;
}) {
  const role = getRoleDisplay(user.role);
  const accessLevels = getAccessLevels(user.role);
  const initial = user.profile_name.trim().charAt(0).toUpperCase() || "A";

  return (
    <div className={`min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] ${
      isStaffWorkspace ? "" : "xl:grid xl:grid-cols-[auto_minmax(0,1fr)] motion-safe:xl:transition-[grid-template-columns] motion-safe:xl:duration-200"
    }`}>
      {!isStaffWorkspace ? (
        <ContextSidebar
          role={user.role}
          profileName={user.profile_name}
          active="profile"
        />
      ) : null}
      <div
        className={`mx-auto flex max-w-6xl items-center px-5 py-12 sm:px-8 lg:py-16 ${
          isStaffWorkspace ? "min-h-svh" : "min-h-[calc(100vh-56px)] xl:min-h-svh"
        }`}
      >
        <section
          aria-labelledby="profile-heading"
          className="w-full rounded-[7px] border border-[var(--color-separator)] bg-[var(--color-surface)]"
        >
          <div className="flex items-center justify-between border-b border-[var(--color-separator)] px-6 py-5 sm:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                Account
              </p>
              <h1 id="profile-heading" className="mt-1 text-xl font-semibold tracking-tight">
                Profile
              </h1>
            </div>
            <BackLink
              href={isStaffWorkspace ? "/admin/dashboard" : "/home"}
              label={isStaffWorkspace ? "Back to dashboard" : "Back to repository"}
            />
          </div>

          {logoutError ? (
            <div
              role="alert"
              className="mx-6 mt-6 rounded-md border border-[var(--color-danger)]/35 bg-[var(--color-danger)]/10 px-4 py-3 text-sm text-[var(--color-danger)] sm:mx-8"
            >
              We could not log you out. Please try again.
            </div>
          ) : null}

          <div className="grid gap-10 p-6 sm:p-8 md:grid-cols-[220px_minmax(0,1fr)] md:items-start lg:gap-14 lg:p-12">
            <div className="mx-auto flex flex-col items-center">
              <div className="group relative grid h-28 w-28 place-items-center rounded-full border border-[var(--color-separator-mid)] bg-[var(--color-surface-alt)] sm:h-32 sm:w-32">
                <span
                  aria-hidden="true"
                  className="text-4xl font-light tracking-[-0.06em] text-[var(--color-text)] sm:text-5xl"
                >
                  {initial}
                </span>
                
                {/* Upload Affordance */}
                <div 
                  className="absolute inset-0 flex cursor-not-allowed items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity group-hover:opacity-100" 
                  title="Avatar upload unavailable"
                >
                  <Camera className="h-6 w-6 text-white/80" />
                </div>
              </div>
              <span
                className={`mt-5 inline-flex min-h-8 items-center rounded-full border px-3 text-[11px] font-bold uppercase tracking-[0.12em] ${role.className}`}
              >
                {role.label}
              </span>
            </div>

            <div className="min-w-0">
              <div className="border-b border-[var(--color-separator)] pb-6">
                <p className="text-[13px] font-medium text-[var(--color-text-muted)]">Signed in as</p>
                <h2 className="mt-1 truncate text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
                  {user.profile_name}
                </h2>
              </div>

              <dl className="grid gap-x-8 gap-y-6 border-b border-[var(--color-separator)] py-8 text-[14px] sm:grid-cols-[140px_minmax(0,1fr)]">
                <dt className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[var(--color-text-muted)] sm:mt-0.5">Email</dt>
                <dd className="break-all font-medium text-[var(--color-text)]">
                  {user.email}
                </dd>

                <dt className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[var(--color-text-muted)] sm:mt-0.5">Affiliation</dt>
                <dd className="font-medium text-[var(--color-text)]">
                  {getAffiliationLabel(user.affiliation)}
                </dd>

                <dt className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[var(--color-text-muted)] sm:mt-0.5">Member since</dt>
                <dd className="font-medium text-[var(--color-text)]">
                  {formatMemberSince(user.created_at)}
                </dd>

                <dt className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[var(--color-text-muted)] sm:mt-1">Access</dt>
                <dd className="flex flex-wrap gap-2">
                  {accessLevels.map((level) => (
                    <span
                      key={level}
                      className="rounded-md border border-[var(--color-separator-mid)] bg-[var(--color-surface-alt)] px-2.5 py-1 text-[12px] font-medium text-[var(--color-text-muted)]"
                    >
                      {level}
                    </span>
                  ))}
                </dd>
              </dl>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  disabled
                  title="Password changes are not available yet"
                  className="inline-flex min-h-[40px] cursor-not-allowed items-center justify-center rounded-md border border-[var(--color-separator)] bg-[var(--color-surface-alt)] px-6 text-[14px] font-medium text-[var(--color-text)] opacity-60"
                >
                  Change Password <span className="ml-2 text-[12px] font-normal text-[var(--color-text-muted)]">(Unavailable)</span>
                </button>

                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="inline-flex min-h-[40px] w-full items-center justify-center rounded-md border border-[var(--color-danger)]/40 bg-transparent px-8 text-[14px] font-medium text-[var(--color-danger)] transition-colors hover:bg-[var(--color-danger)]/10 sm:w-auto"
                  >
                    Log Out
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
