// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AdminSidebar } from "./admin-sidebar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/dashboard",
}));

vi.mock("@/components/layout/theme-toggle", () => ({
  ThemeToggle: () => <button type="button">Theme</button>,
}));

vi.mock("@/components/ui/alexandria-brand-lockup", () => ({
  AlexandriaBrandLockup: () => <span>Alexandria</span>,
}));

vi.mock("@/lib/auth/actions", () => ({ logoutAction: vi.fn() }));

describe("AdminSidebar", () => {
  it.each(["admin", "moderator"] as const)("shows the Presentation demo destination to %s staff", (role) => {
    render(
      <AdminSidebar
        role={role}
        email={`${role}@alexandria.example`}
        profileName="Sample Staff"
        isCollapsed={false}
        isMobileOpen={false}
        isNarrowViewport={false}
        onToggleCollapse={() => undefined}
        onMobileClose={() => undefined}
        onNavigate={() => undefined}
      />,
    );

    expect(screen.getByRole("link", { name: /presentation demo/i })).toHaveAttribute(
      "href",
      "/admin/demo",
    );
  });
});
