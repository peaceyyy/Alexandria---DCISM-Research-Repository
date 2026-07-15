// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ReviewDecisionActions } from "./review-decision-actions";

describe("ReviewDecisionActions", () => {
  it("asks for confirmation before approving a submission", async () => {
    const onDecision = vi.fn();
    const user = userEvent.setup();

    render(
      <ReviewDecisionActions
        status="for_review"
        role="moderator"
        onDecision={onDecision}
      />,
    );

    await user.click(screen.getByRole("button", { name: /approve this submission/i }));

    expect(onDecision).not.toHaveBeenCalled();
    const dialog = screen.getByRole("dialog", { name: /approve this submission/i });
    expect(dialog).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: /^approve$/i }));

    expect(onDecision).toHaveBeenCalledWith("accepted");
  });

  it("allows approved submissions to be sent back to pending review after confirmation", async () => {
    const onDecision = vi.fn();
    const user = userEvent.setup();

    render(
      <ReviewDecisionActions
        status="accepted"
        role="moderator"
        onDecision={onDecision}
      />,
    );

    await user.click(screen.getByRole("button", { name: /send submission back to review/i }));

    expect(onDecision).not.toHaveBeenCalled();
    const dialog = screen.getByRole("dialog", { name: /send back to review/i });
    expect(dialog).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: /send back to review/i }));

    expect(onDecision).toHaveBeenCalledWith("for_review");
  });
});
