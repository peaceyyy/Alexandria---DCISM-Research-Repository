import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/services/auth-service";

export default async function ModeratorsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const result = await getCurrentUser();

  if (result.error?.code === "ACCOUNT_DEACTIVATED") {
    redirect("/login?reason=account-deactivated");
  }

  if (result.data?.role !== "admin") {
    redirect("/admin/dashboard");
  }

  return children;
}
