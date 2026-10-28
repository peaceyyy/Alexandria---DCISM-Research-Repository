import { describe, expect, it } from "vitest";
import { getProgressRequirementErrors } from "./progress-policy";

describe("repository progress policy", () => {
  it("requires the Thesis 1 approval milestone for work in progress", () => {
    expect(
      getProgressRequirementErrors({
        progress: "in_progress",
        proposalApprovedOn: "",
        publicationDate: "",
        publicationLink: "",
        conference: "",
        hasPrimaryPdf: true,
      }),
    ).toEqual(["Proposal approval date is required for work in progress."]);
  });

  it("requires final-publication evidence before a record can be completed", () => {
    expect(
      getProgressRequirementErrors({
        progress: "completed",
        proposalApprovedOn: "2026-01-12",
        publicationDate: "",
        publicationLink: "",
        conference: "",
        hasPrimaryPdf: false,
      }),
    ).toEqual([
      "A final PDF is required for completed work.",
      "Publication or presentation date is required for completed work.",
      "Publication link is required for completed work.",
      "Conference or venue is required for completed work.",
    ]);
  });

  it("accepts the complete completed-record contract", () => {
    expect(
      getProgressRequirementErrors({
        progress: "completed",
        proposalApprovedOn: "2026-01-12",
        publicationDate: "2026-05-20",
        publicationLink: "https://example.org/proceedings/record",
        conference: "DCISM Research Colloquium",
        hasPrimaryPdf: true,
      }),
    ).toEqual([]);
  });
});
