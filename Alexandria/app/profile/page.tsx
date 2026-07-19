import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfilePage } from "./_components/profile-page";
import { AdminLayoutWrapper } from "@/components/admin/admin-layout-wrapper";
import { getCurrentUser } from "@/lib/services/auth-service";

export const metadata: Metadata = {
  title: "Profile",
  description: "View your Alexandria account and access level.",
};

export default async function ProfileRoute({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const [userResult, params] = await Promise.all([
    getCurrentUser(),
    searchParams,
  ]);

  if (userResult.error?.code === "ACCOUNT_DEACTIVATED") {
    redirect("/login?reason=account-deactivated");
  }

  if (!userResult.data) {
    redirect("/login");
  }

  const isStaff =
    userResult.data.role === "admin" || userResult.data.role === "moderator";
  const profile = (
    <ProfilePage
      user={userResult.data}
      logoutError={params.error === "logout"}
      isStaffWorkspace={isStaff}
    />
  );

  if (isStaff) {
    return (
      <AdminLayoutWrapper
        role={userResult.data.role}
        email={userResult.data.email}
        profileName={userResult.data.profile_name}
      >
        {profile}
      </AdminLayoutWrapper>
    );
  }

  return profile;
}
