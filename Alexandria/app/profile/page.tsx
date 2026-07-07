import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfilePage } from "./_components/profile-page";
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

  return (
    <ProfilePage
      user={userResult.data}
      logoutError={params.error === "logout"}
    />
  );
}
