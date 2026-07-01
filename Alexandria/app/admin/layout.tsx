import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { getCurrentUser } from "@/lib/services/auth-service";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const result = await getCurrentUser();
  const user = result.data;

  // Route guard: Must be logged in, and must be admin or moderator
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "admin" && user.role !== "moderator") {
    redirect("/theses");
  }

  return (
    <div className="flex min-h-svh bg-[#14181c]">
      <AdminSidebar role={user.role} />
      {/* Main Content — offset by sidebar width */}
      <main
        className="flex-1 ml-[240px] min-h-svh flex flex-col"
        id="admin-main-content"
      >
        {children}
      </main>
    </div>
  );
}
