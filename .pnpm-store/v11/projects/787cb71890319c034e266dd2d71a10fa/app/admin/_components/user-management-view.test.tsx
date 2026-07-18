// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { changeUserRoleAction } from "@/app/admin/actions";
import { UserManagementView } from "./user-management-view";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("@/app/admin/actions", () => ({
  changeUserRoleAction: vi.fn(),
  deactivateUserAction: vi.fn(),
  reactivateUserAction: vi.fn(),
}));

describe("UserManagementView", () => {
  it("asks for confirmation before promoting a member", async () => {
    const user = userEvent.setup();

    render(
      <UserManagementView
        rows={[{
          id: "member-1",
          email: "member@usc.edu.ph",
          profile_name: "Jane Doe",
          usc_id: 12345,
          role: "member",
          affiliation: "student",
          created_at: "2026-07-18T00:00:00.000Z",
          deactivated_at: null,
          deactivation_reason: null,
          deactivated_by_user_id: null,
        }]}
        pagination={{ page: 1, limit: 20, total_count: 1 }}
        role="member"
        roleCounts={{ member: 1, moderator: 0, admin: 1 }}
        viewerName="Admin"
      />,
    );

    await user.click(screen.getByRole("button", { name: /promote jane doe/i }));

    expect(changeUserRoleAction).not.toHaveBeenCalled();
    expect(
      screen.getByRole("dialog", { name: /promote jane doe to moderator/i }),
    ).toBeInTheDocument();
  });
});
