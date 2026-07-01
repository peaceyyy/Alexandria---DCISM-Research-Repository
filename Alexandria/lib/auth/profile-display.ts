import type { Affiliation, UserRole } from "./auth-contract";

const ACCESS_LEVELS: Record<UserRole, string[]> = {
  member: ["Member"],
  moderator: ["Member", "Moderator"],
  admin: ["Member", "Moderator", "Admin"],
};

const AFFILIATION_LABELS: Record<Affiliation, string> = {
  student: "Student",
  alumni: "Alumni",
  professor: "Professor",
};

export function getAccessLevels(role: UserRole): string[] {
  return ACCESS_LEVELS[role];
}

export function getAffiliationLabel(affiliation: Affiliation): string {
  return AFFILIATION_LABELS[affiliation];
}

export function formatMemberSince(createdAt: string): string {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Unavailable";
  }

  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
