import type { UserRole } from "./auth-contract";

export type SessionDisplayRole = UserRole | "guest";

export type RoleDisplay = {
  role: SessionDisplayRole;
  label: string;
  abbreviation: string;
  className: string;
};

const ROLE_DISPLAYS: Record<SessionDisplayRole, RoleDisplay> = {
  guest: {
    role: "guest",
    label: "Guest",
    abbreviation: "G",
    className: "border-[var(--color-separator)] bg-[var(--color-text)]/5 text-[var(--color-text-muted)]",
  },
  member: {
    role: "member",
    label: "Member",
    abbreviation: "M",
    className: "border-[var(--color-chip-cyan-bd)] bg-[var(--color-chip-cyan-bg)] text-[var(--color-chip-cyan-text)]",
  },
  moderator: {
    role: "moderator",
    label: "Moderator",
    abbreviation: "MOD",
    className: "border-[var(--color-brand-bright)]/40 bg-[var(--color-brand-bright)]/10 text-[var(--color-brand-bright)]",
  },
  admin: {
    role: "admin",
    label: "Admin",
    abbreviation: "A",
    className: "border-[var(--color-pronunciation)]/40 bg-[var(--color-pronunciation)]/10 text-[var(--color-pronunciation)]",
  },
};

export function getRoleDisplay(role?: UserRole | null): RoleDisplay {
  return ROLE_DISPLAYS[role ?? "guest"];
}
