import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DatePicker } from "@/app/upload/_components/date-picker";

describe("DatePicker", () => {
  it("uses one date control and emits the selected calendar date", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(
      <DatePicker
        value="2026-05-07"
        max="2026-07-15"
        onChange={onChange}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /select publication date/i }),
    );

    expect(screen.getByRole("dialog", { name: "Publication date" })).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /friday, may 8th, 2026/i }),
    );

    expect(onChange).toHaveBeenCalledWith("2026-05-08");
  });
});
