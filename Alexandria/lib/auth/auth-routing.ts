import type { UserRole } from "./auth-contract";

export function getPostAuthDestination(_role?: UserRole): "/theses" {
  return "/theses";
}
