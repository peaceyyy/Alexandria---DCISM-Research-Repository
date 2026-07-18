// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReviewSubmission } from "@/lib/services/types";
import { MemberCorrectionClient } from "./member-correction-client";

const mocks = vi.hoisted(() => ({
  back: vi.fn(),
  push: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ back: mocks.back, push: mocks.push }),
}));

vi.mock("next/link", () => ({
  default: ({ children, ...props }: React.ComponentProps<"a">) => (
    <a {...props}>{children}</a>
  ),
}));

vi.mock("@/components/review/comment-side-panel", () => ({
  CommentSidePanel: () => null,
}));

vi.mock("@/components/review/review-audit-timeline", () => ({
  ReviewAuditTimeline: () => null,
}));

vi.mock("@/components/review/reviewable-field", () => ({
  ReviewableField: ({ label, children }: { label: string; children: React.ReactNode }) => (
    <section>
      <span>{label}</span>
      {children}
    </section>
  ),
}));

vi.mock("@/components/research/research-area-multi-select", () => ({
  ResearchAreaMultiSelect: () => null,
}));

vi.mock("@/lib/services/review-service", () => ({
  replaceFlaggedSubmissionPdf: vi.fn(),
  resubmitFlaggedSubmission: vi.fn(),
  updateFlaggedSubmission: vi.fn(),
}));

const submission = {
  id: "thesis-1",
  title: "Original title",
  department: "CS",
  studyType: "thesis",
  publicationDate: "2026-07-01",
  publicationLink: null,
  conference: null,
  researchArea: "web_development",
  abstract: "Abstract",
  recommendations: null,
  lessonsLearned: null,
  tags: [],
  authors: ["Jane Doe"],
  advisers: [],
  contributorEntries: [],
  fieldComments: [],
  auditEvents: [],
  primaryFile: null,
  reviewStatus: "flagged",
} as unknown as ReviewSubmission;

describe("MemberCorrectionClient", () => {
  beforeEach(() => {
    mocks.push.mockReset();
    mocks.back.mockReset();
  });

  it("asks before leaving a correction draft with unsaved changes", async () => {
    const user = userEvent.setup();
    render(<MemberCorrectionClient initialSubmission={submission} />);

    await user.type(screen.getByDisplayValue("Original title"), " revised");
    await user.click(screen.getByRole("link", { name: /my submissions/i }));

    expect(mocks.push).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog", { name: /discard unsaved changes/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /keep editing/i }));
    expect(screen.queryByRole("dialog", { name: /discard unsaved changes/i })).not.toBeInTheDocument();
  });

  it("opens the discard confirmation when browser back is used with unsaved changes", async () => {
    const user = userEvent.setup();
    render(<MemberCorrectionClient initialSubmission={submission} />);

    await user.type(screen.getByDisplayValue("Original title"), " revised");
    fireEvent.popState(window);

    expect(screen.getByRole("dialog", { name: /discard unsaved changes/i })).toBeInTheDocument();
  });
});
