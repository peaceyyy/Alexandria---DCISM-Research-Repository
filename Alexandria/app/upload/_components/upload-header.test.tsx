// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { UploadHeader } from "./upload-header";

vi.mock("@/components/layout/theme-toggle", () => ({
  ThemeToggle: () => <button type="button">Theme</button>,
}));

vi.mock("@/components/ui/alexandria-brand-lockup", () => ({
  AlexandriaBrandLockup: () => <span>Alexandria</span>,
}));

describe("UploadHeader", () => {
  it("can keep the theme utility without rendering a duplicate repository brand", () => {
    render(<UploadHeader showBrand={false} />);

    expect(screen.getByRole("button", { name: "Theme" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /return to alexandria repository/i }),
    ).not.toBeInTheDocument();
  });
});
