// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DemoBanner } from "./demo-banner";

describe("DemoBanner", () => {
  it("renders as quiet fixed metadata instead of a pill-shaped notification", () => {
    render(<DemoBanner />);

    expect(screen.getByRole("status")).toHaveClass("fixed");
    expect(screen.getByRole("status")).toHaveClass("pointer-events-none");
    expect(screen.getByRole("status")).not.toHaveClass("rounded-full");
    expect(screen.getByRole("status")).not.toHaveClass("border");
    expect(screen.getByRole("status")).not.toHaveClass("bg-[var(--color-surface)]/95");
  });
});
