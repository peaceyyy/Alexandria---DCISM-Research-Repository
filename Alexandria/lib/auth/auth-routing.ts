import type { UserRole } from "./auth-contract";

/**
 * Determines where to send a user after successful login based on their role.
 * - admin     → /admin/dashboard   (task-first: management is their primary job)
 * - moderator → /admin/moderators  (placeholder until mod dashboard exists)
 * - member    → /theses            (reader-first: the public repository)
 */
export function getPostAuthDestination(role?: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "moderator":
      return "/admin/moderators";
    default:
      return "/theses";
  }
}
