// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ReviewSubmission } from "@/lib/services/types";
import { AdminMetadataEditorDialog } from "./admin-metadata-editor-dialog";

vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ open, children }: { open: boolean; children: React.ReactNode }) =>
    open ? <div>{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div role="dialog">{children}</div>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  DialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));

vi.mock("@/components/research/research-area-multi-select", () => ({
  ResearchAreaMultiSelect: () => null,
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
  tags: ["frontend"],
  reviewStatus: "for_review",
} as unknown as ReviewSubmission;

describe("AdminMetadataEditorDialog", () => {
  it("asks before cancelling a metadata draft with changes", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <AdminMetadataEditorDialog
        submission={submission}
        open
        onOpenChange={onOpenChange}
        onSave={async () => null}
      />,
    );

    await user.type(screen.getByDisplayValue("Original title"), " revised");
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onOpenChange).not.toHaveBeenCalledWith(false);
    expect(screen.getByText("Discard unsaved metadata changes?")).toBeInTheDocument();
  });

  it("asks before browser Back discards a metadata draft", async () => {
    const user = userEvent.setup();

    render(
      <AdminMetadataEditorDialog
        submission={submission}
        open
        onOpenChange={() => undefined}
        onSave={async () => null}
      />,
    );

    await user.type(screen.getByDisplayValue("Original title"), " revised");
    fireEvent.popState(window);

    expect(screen.getByText("Discard unsaved metadata changes?")).toBeInTheDocument();
  });
});
