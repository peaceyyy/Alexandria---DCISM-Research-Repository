// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ReviewableField } from "./reviewable-field";

describe("ReviewableField", () => {
  it("uses theme tokens for the expanded-text dialog", async () => {
    const user = userEvent.setup();

    render(
      <ReviewableField
        fieldKey="abstract"
        label="Abstract"
        comments={[]}
        isActive={false}
        onCommentIconClick={() => undefined}
        expandable
      >
        <p>Full abstract text</p>
      </ReviewableField>,
    );

    await user.click(screen.getByRole("button", { name: /open preview/i }));

    expect(screen.getByRole("dialog")).toHaveClass("bg-[var(--color-surface)]");
    expect(screen.getByRole("dialog")).toHaveClass("text-[var(--color-text)]");
  });
});
