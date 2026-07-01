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
    className: "border-white/25 bg-white/5 text-[#d8dadc]",
  },
  member: {
    role: "member",
    label: "Member",
    abbreviation: "M",
    className: "border-[#1da0c9]/55 bg-[#1da0c9]/10 text-[#65d6f5]",
  },
  moderator: {
    role: "moderator",
    label: "Moderator",
    abbreviation: "MOD",
    className: "border-[#368bfe]/65 bg-[#1752f0]/15 text-[#8bb6ff]",
  },
  admin: {
    role: "admin",
    label: "Admin",
    abbreviation: "A",
    className: "border-[#ffd900]/55 bg-[#ffd900]/10 text-[#ffe66b]",
  },
};

export function getRoleDisplay(role?: UserRole | null): RoleDisplay {
  return ROLE_DISPLAYS[role ?? "guest"];
}
