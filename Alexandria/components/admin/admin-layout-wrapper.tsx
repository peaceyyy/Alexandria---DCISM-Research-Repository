"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/app/admin/_components/admin-sidebar";
import type { UserRole } from "@/lib/auth/auth-contract";

export function AdminLayoutWrapper({
  children,
  role,
}: {
  children: React.ReactNode;
  role: UserRole;
}) {
  const pathname = usePathname();
  // Hide sidebar on the review detail page to maximize screen real estate for the focus mode
  const isReviewDetail =
    pathname.startsWith("/admin/review/") && pathname !== "/admin/review";

  if (isReviewDetail) {
    return (
      <div className="flex min-h-svh bg-[#14181c]">
        <main className="flex-1 min-h-svh flex flex-col" id="admin-main-content">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh bg-[#14181c]">
      <AdminSidebar role={role} />
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
