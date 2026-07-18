"use server";

import { revalidatePath } from "next/cache";
import {
  deactivateUser,
  reactivateUser,
  updateUserRole,
} from "@/lib/services/user-service";
import type { ServiceResult, UserRole } from "@/lib/services/types";

const ADMIN_PATHS = [
  "/admin/dashboard",
  "/admin/users",
];

function revalidateAdminPaths() {
  ADMIN_PATHS.forEach((path) => revalidatePath(path));
}

export async function changeUserRoleAction(
  userId: string,
  role: UserRole,
): Promise<ServiceResult<null>> {
  const result = await updateUserRole(userId, role);

  if (!result.error) {
    revalidateAdminPaths();
  }

  return result;
}

export async function deactivateUserAction(
  userId: string,
  reason: string,
): Promise<ServiceResult<null>> {
  const result = await deactivateUser(userId, reason);

  if (!result.error) {
    revalidateAdminPaths();
  }

  return result;
}

export async function reactivateUserAction(
  userId: string,
): Promise<ServiceResult<null>> {
  const result = await reactivateUser(userId);

  if (!result.error) {
    revalidateAdminPaths();
  }

  return result;
}
