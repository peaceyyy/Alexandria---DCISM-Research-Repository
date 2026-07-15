import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import type { ComponentType } from "react";
import { describe, expect, it, vi } from "vitest";
import FilterSidebar from "./filter-sidebar";

type MySubmissionsFilterProps = {
  fromYear: string;
  toYear: string;
  setFromYear: (value: string) => void;
  setToYear: (value: string) => void;
  selectedResearchAreas: string[];
  selectedDepartments: string[];
  onToggleResearchArea: (value: string) => void;
  onToggleDepartment: (value: string) => void;
  showMySubmissions: boolean;
  mySubmissionsActive: boolean;
  flaggedSubmissionCount: number;
  onToggleMySubmissions: () => void;
};

const FilterSidebarWithMySubmissions =
  FilterSidebar as unknown as ComponentType<MySubmissionsFilterProps>;

function renderSidebar(overrides: Partial<MySubmissionsFilterProps> = {}) {
  return render(
    <FilterSidebarWithMySubmissions
      fromYear=""
      toYear=""
      setFromYear={vi.fn()}
      setToYear={vi.fn()}
      selectedResearchAreas={[]}
      selectedDepartments={[]}
      onToggleResearchArea={vi.fn()}
      onToggleDepartment={vi.fn()}
      showMySubmissions
      mySubmissionsActive={false}
      flaggedSubmissionCount={0}
      onToggleMySubmissions={vi.fn()}
      {...overrides}
    />,
  );
}

describe("FilterSidebar my-submissions filter", () => {
  it("shows a flagged-submission count only when a member needs to take action", () => {
    renderSidebar({ flaggedSubmissionCount: 2 });

    expect(screen.getByRole("checkbox", { name: "My submissions" })).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("2 need revision")).toBeInTheDocument();
  });

  it("keeps the filter available without an attention badge when nothing is flagged", () => {
    renderSidebar();

    expect(screen.getByRole("checkbox", { name: "My submissions" })).toBeInTheDocument();
    expect(screen.queryByText(/need revision/)).not.toBeInTheDocument();
  });
});
