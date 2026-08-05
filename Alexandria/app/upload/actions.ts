"use server";

import { getCurrentUser } from "@/lib/services/auth-service";

/**
 * Returns the one UI capability that belongs to the authenticated principal,
 * without exposing a role selector or changing the submission authorization
 * boundary. `submitThesis` remains responsible for the actual write policy.
 */
export async function getUploadCapabilities() {
  const result = await getCurrentUser();
  const role = result.data?.role;

  return {
    canUseStaffSample: role === "admin" || role === "moderator",
  };
}
