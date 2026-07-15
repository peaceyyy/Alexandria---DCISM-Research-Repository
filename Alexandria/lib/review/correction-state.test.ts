import { describe, expect, it } from "vitest";
import {
  getCommentCorrectionState,
  getCorrectionSummary,
} from "./correction-state";

describe("correction state", () => {
  it("keeps an acknowledged comment visible as a distinct state", () => {
    expect(
      getCommentCorrectionState({
        memberRevisedAt: "2026-07-15T08:00:00.000Z",
        addressedAt: "2026-07-15T08:05:00.000Z",
      }),
    ).toBe("addressed");
  });

  it("shows saved field evidence before a member acknowledges the comment", () => {
    expect(
      getCommentCorrectionState({
        memberRevisedAt: "2026-07-15T08:00:00.000Z",
        addressedAt: null,
      }),
    ).toBe("revised");
  });

  it("summarizes remaining comments without turning them into a resubmission gate", () => {
    expect(
      getCorrectionSummary([
        { memberRevisedAt: null, addressedAt: null },
        { memberRevisedAt: "2026-07-15T08:00:00.000Z", addressedAt: null },
        {
          memberRevisedAt: "2026-07-15T08:00:00.000Z",
          addressedAt: "2026-07-15T08:05:00.000Z",
        },
      ]),
    ).toEqual({
      totalComments: 3,
      revisedCommentCount: 2,
      acknowledgedCommentCount: 1,
      unacknowledgedCommentCount: 2,
    });
  });
});
