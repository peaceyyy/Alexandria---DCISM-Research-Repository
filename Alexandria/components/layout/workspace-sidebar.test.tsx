import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { WorkspaceSidebar } from "./workspace-sidebar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/home",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/lib/auth/actions", () => ({ logoutAction: vi.fn() }));

describe("WorkspaceSidebar", () => {
  it("keeps anonymous navigation focused on browsing", () => {
    render(<WorkspaceSidebar role={null} />);

    expect(screen.getByRole("link", { name: /browse research/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /my submissions/i })).not.toBeInTheDocument();
    expect(screen.getByText(/coming later/i)).toBeInTheDocument();
  });

  it("shows My submissions for signed-in members", () => {
    render(<WorkspaceSidebar role="member" profileName="Alex" />);

    expect(screen.getByRole("link", { name: /my submissions/i })).toBeInTheDocument();
  });
});
