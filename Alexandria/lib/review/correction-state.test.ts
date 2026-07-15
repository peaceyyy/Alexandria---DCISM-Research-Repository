import { describe, expect, it } from "vitest";
import {
  getCommentCorrectionState,
  getCorrectionSummary,
} from "./correction-state";

describe("correction state", () => {
  it("shows a revised state after a member saves a field change", () => {
    expect(
      getCommentCorrectionState({
        memberRevisedAt: "2026-07-15T08:00:00.000Z",
      }),
    ).toBe("revised");
  });

  it("keeps the feedback summary informative when a comment needs no field change", () => {
    expect(
      getCorrectionSummary([
        { memberRevisedAt: null },
        { memberRevisedAt: "2026-07-15T08:00:00.000Z" },
        { memberRevisedAt: "2026-07-15T08:05:00.000Z" },
      ]),
    ).toEqual({
      totalComments: 3,
      revisedCommentCount: 2,
      pendingRevisionCommentCount: 1,
    });
  });
});
