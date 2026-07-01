import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/services/auth-service";

export default async function MembersLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const result = await getCurrentUser();
  
  if (result.data?.role !== "admin") {
    redirect("/admin/dashboard");
  }

  return children;
}
